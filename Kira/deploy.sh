#!/usr/bin/env bash
set -euo pipefail

REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AGENT_ROLE_NAME="aiops-bedrock-agent-role"
AGENT_NAME="aiops-assistant"
SCRIPT_DIR=$(pwd -W 2>/dev/null || pwd)

echo ""
echo "============================================="
echo " AIOps — Bedrock Agent Deployment"
echo " Account : $ACCOUNT_ID"
echo " Region  : $REGION"
echo "============================================="
echo ""

echo "[0/3] Pre-flight checks..."

for FUNC in aiops-fetch-logs aiops-fetch-metrics aiops-fetch-health; do
  if ! aws lambda get-function --function-name "$FUNC" --region "$REGION" &>/dev/null; then
    echo "  ✗ Lambda '$FUNC' not found in $REGION"
    exit 1
  fi
  echo "  ✓ Lambda: $FUNC"
done

if ! aws iam get-role --role-name "$AGENT_ROLE_NAME" &>/dev/null; then
  echo "  ✗ IAM role '$AGENT_ROLE_NAME' not found"
  exit 1
fi

AGENT_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${AGENT_ROLE_NAME}"
echo "  ✓ IAM role: $AGENT_ROLE_NAME"

echo ""
echo "[1/3] Configuring Lambda functions..."

for FUNC in aiops-fetch-logs aiops-fetch-metrics aiops-fetch-health; do
  aws lambda update-function-configuration \
    --function-name "$FUNC" \
    --timeout 30 \
    --region "$REGION" > /dev/null
  echo "  ✓ $FUNC timeout set to 30s"
done

echo ""
echo "  Adding Bedrock invoke permissions..."

for FUNC in aiops-fetch-logs aiops-fetch-metrics aiops-fetch-health; do
  aws lambda add-permission \
    --function-name "$FUNC" \
    --statement-id "AllowBedrockInvoke" \
    --action "lambda:InvokeFunction" \
    --principal "bedrock.amazonaws.com" \
    --region "$REGION" 2>/dev/null || true
  echo "  ✓ $FUNC"
done

echo ""
echo "[2/3] Creating Bedrock Agent: $AGENT_NAME..."

AGENT_INSTRUCTION="You are Kira, a senior Site Reliability Engineer. You analyze logs, metrics, and system health to diagnose issues in EKS systems."

EXISTING_AGENT_ID=$(aws bedrock-agent list-agents \
  --region "$REGION" \
  --query "agentSummaries[?agentName=='$AGENT_NAME'].agentId | [0]" \
  --output text 2>/dev/null)

if [ -n "$EXISTING_AGENT_ID" ] && [ "$EXISTING_AGENT_ID" != "None" ]; then
  AGENT_ID="$EXISTING_AGENT_ID"
  echo "  ✓ Agent already exists: $AGENT_ID"
else
  AGENT_ID=$(aws bedrock-agent create-agent \
    --agent-name "$AGENT_NAME" \
    --agent-resource-role-arn "$AGENT_ROLE_ARN" \
    --foundation-model "qwen.qwen3-32b-v1:0" \
    --instruction "$AGENT_INSTRUCTION" \
    --region "$REGION" \
    --query 'agent.agentId' --output text)
  echo "  ✓ Agent created: $AGENT_ID"
  sleep 5
fi

echo ""
echo "[3/3] Adding action groups and preparing agent..."

python3 - <<PYEOF
import boto3, os

region = "$REGION"
agent_id = "$AGENT_ID"
account_id = "$ACCOUNT_ID"
script_dir = os.path.abspath("$SCRIPT_DIR")

client = boto3.client("bedrock-agent", region_name=region)

action_groups = [
    {
        "name": "fetch_logs",
        "func": "aiops-fetch-logs",
        "schema": "fetch_logs.json",
        "desc": "Search CloudWatch Logs for errors and events",
    },
    {
        "name": "fetch_metrics",
        "func": "aiops-fetch-metrics",
        "schema": "fetch_metrics.json",
        "desc": "Retrieve Prometheus metrics (CPU, memory, pod restarts, deployment health)",
    },
    {
        "name": "fetch_service_health",
        "func": "aiops-fetch-health",
        "schema": "fetch_health.json",
        "desc": "Check EKS cluster and pod health",
    },
]

existing = client.list_agent_action_groups(agentId=agent_id, agentVersion="DRAFT")
existing_names = [ag["actionGroupName"] for ag in existing.get("actionGroupSummaries", [])]

for ag in action_groups:
    if ag["name"] in existing_names:
        print(f"✓ {ag['name']} exists")
        continue

    with open(f"{script_dir}/schemas/{ag['schema']}") as f:
        schema_content = f.read()

    client.create_agent_action_group(
        agentId=agent_id,
        agentVersion="DRAFT",
        actionGroupName=ag["name"],
        description=ag["desc"],
        actionGroupExecutor={"lambda": f"arn:aws:lambda:{region}:{account_id}:function:{ag['func']}"},
        apiSchema={"payload": schema_content},
    )
    print(f"✓ {ag['name']} created")
PYEOF

echo ""
echo "Preparing agent..."
aws bedrock-agent prepare-agent --agent-id "$AGENT_ID" --region "$REGION"

echo ""
echo "Done!"
echo "Agent ID: $AGENT_ID"