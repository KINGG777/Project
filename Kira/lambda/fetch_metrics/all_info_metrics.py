import json
import urllib.request
import urllib.parse
from datetime import datetime

PROMETHEUS_URL = "http://a1a729cdce4694f9fa8b22b38bf0e15a-140886258.us-east-1.elb.amazonaws.com:9090"

DEFAULT_NAMESPACE = "all"

METRIC_QUERIES = {
    # EXISTING METRICS
    "pod_cpu_utilization": 'sum(rate(container_cpu_usage_seconds_total{namespace!=""}[5m])) by (pod)',
    "pod_memory_utilization": 'sum(container_memory_working_set_bytes{namespace!=""}) by (pod)',
    "pod_restarts": 'increase(kube_pod_container_status_restarts_total{namespace!=""}[1h])',
    "deployment_replicas_unavailable": 'kube_deployment_status_replicas_unavailable{namespace!=""}',
    "deployment_replicas_available": 'kube_deployment_status_replicas_available{namespace!=""}',

    # NEW CLUSTER-WIDE METRICS
    "all_pods": 'kube_pod_info{namespace!=""}',
    "all_namespaces": 'kube_namespace_labels',
    "all_deployments": 'kube_deployment_labels{namespace!=""}',
    "all_services": 'kube_service_info{namespace!=""}',
}


def prometheus_range_query(query, hours_back, step="5m"):
    end = int(datetime.utcnow().timestamp())
    start = end - (hours_back * 3600)
    url = (
        f"{PROMETHEUS_URL}/api/v1/query_range"
        f"?query={urllib.parse.quote(query)}"
        f"&start={start}&end={end}&step={step}"
    )
    with urllib.request.urlopen(url, timeout=10) as resp:
        return json.loads(resp.read())["data"]["result"]


def lambda_handler(event, context):
    params = {}
    for param in event.get("parameters", []):
        params[param["name"]] = param["value"]

    metric_name = params.get("metric_name", "pod_cpu_utilization")
    hours_back = int(params.get("hours_back", "1"))

    try:
        if metric_name in METRIC_QUERIES:
            query = METRIC_QUERIES[metric_name]
        else:
            query = metric_name

        raw_results = prometheus_range_query(query, hours_back)

        # ===============================
        # 🔥 CLUSTER INFO HANDLING
        # ===============================

        if metric_name == "all_pods":
            pods = list(set([r["metric"].get("pod") for r in raw_results if r["metric"].get("pod")]))
            result = {
                "status": "ok",
                "total_pods": len(pods),
                "sample_pods": pods[:10]
            }

        elif metric_name == "all_namespaces":
            namespaces = list(set([r["metric"].get("namespace") for r in raw_results if r["metric"].get("namespace")]))
            result = {
                "status": "ok",
                "total_namespaces": len(namespaces),
                "namespaces": namespaces
            }

        elif metric_name == "all_deployments":
            deployments = list(set([r["metric"].get("deployment") for r in raw_results if r["metric"].get("deployment")]))
            result = {
                "status": "ok",
                "total_deployments": len(deployments),
                "sample_deployments": deployments[:10]
            }

        elif metric_name == "all_services":
            services = list(set([r["metric"].get("service") for r in raw_results if r["metric"].get("service")]))
            result = {
                "status": "ok",
                "total_services": len(services),
                "sample_services": services[:10]
            }

        # ===============================
        # 📊 NORMAL METRICS HANDLING
        # ===============================

        elif not raw_results:
            result = {"status": "no_data", "metric": metric_name}

        else:
            series = []
            for r in raw_results[:10]:
                label = (
                    r["metric"].get("pod")
                    or r["metric"].get("deployment")
                    or r["metric"].get("instance")
                    or "unknown"
                )
                values = [float(v[1]) for v in r["values"]]
                series.append({
                    "name": label,
                    "current": round(values[-1], 3),
                    "avg": round(sum(values) / len(values), 3),
                    "max": round(max(values), 3),
                })

            result = {
                "status": "ok",
                "metric": metric_name,
                "data": series
            }

    except Exception as e:
        result = {"status": "error", "message": str(e)}

    return {
        "messageVersion": "1.0",
        "response": {
            "actionGroup": event.get("actionGroup", ""),
            "apiPath": event.get("apiPath", ""),
            "httpMethod": event.get("httpMethod", ""),
            "httpStatusCode": 200,
            "responseBody": {
                "application/json": {
                    "body": json.dumps(result, separators=(',', ':'))
                }
            },
        },
    }