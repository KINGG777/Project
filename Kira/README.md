DEPLOY AIOPS (KIRA)

# 🚀 SETUP LOGGING (Fluent Bit)

## 🔹 Install Fluent Bit

```bash
helm repo add aws https://aws.github.io/eks-charts
helm repo update

helm upgrade --install aws-for-fluent-bit aws/aws-for-fluent-bit \
  --namespace amazon-cloudwatch \
  --create-namespace \
  --set cloudWatch.enabled=true \
  --set cloudWatch.region=us-east-1 \
  --set cloudWatch.logGroupName=/eks/3tier/pods \
  --set cloudWatch.logStreamPrefix=from-fluent-bit-
```

---

## ⚠️ IMPORTANT — IAM PERMISSION FIX

Attach this policy to your **EKS Worker Node IAM Role**:

```json
{
  "Effect": "Allow",
  "Action": [
    "logs:CreateLogGroup",
    "logs:CreateLogStream",
    "logs:PutLogEvents",
    "logs:DescribeLogStreams"
  ],
  "Resource": "*"
}
```

---

## 🔹 Restart Fluent Bit Pods

```bash
kubectl delete pod -n amazon-cloudwatch --all
```

---

## 🔹 Verify Fluent Bit

```bash
kubectl get pods -n amazon-cloudwatch
kubectl logs -n amazon-cloudwatch -l app.kubernetes.io/name=aws-for-fluent-bit
```

👉 You should see:

```
Created log stream ...
```

---

# 🚀 STEP 6 — VERIFY CLOUDWATCH LOGS

Go to:

👉 AWS Console → CloudWatch → Log Groups

You should see:

```
/eks/3tier/pods
/aws/eks/fluentbit-cloudwatch/logs
```

---

# 🚀 STEP 7 — DEPLOY AIOPS (KIRA)

## 🔹 Create Lambda Functions

Create 3 Lambda functions:

* aiops-fetch-health
* aiops-fetch-logs
* aiops-fetch-metrics

👉 Use your project code

---

## 🧪 TEST LAMBDA FUNCTIONS (IMPORTANT)

### 🔹 Health Lambda Test

```json
{
  "parameters": [
    { "name": "cluster_name", "value": "project-eks" },
    { "name": "namespace", "value": "eks" }
  ]
}
```

---

### 🔹 Logs Lambda Test

```json
{
  "parameters": [
    { "name": "filter_pattern", "value": "ERROR" },
    { "name": "log_group_name", "value": "/eks/3tier/pods" },
    { "name": "hours_back", "value": "1" }
  ]
}
```

---

### 🔹 Metrics Lambda Test

```json
{
  "parameters": [
    { "name": "metric_name", "value": "pod_cpu_utilization" },
    { "name": "namespace", "value": "eks" },
    { "name": "hours_back", "value": "1" }
  ]
}
```

---

## 🔹 Create IAM Role

Create role:

```
aiops-bedrock-agent-role
```

Attach required permissions:

* Lambda invoke
* CloudWatch access
* EKS describe

---

## 🔹 Deploy Bedrock Agent

```bash
chmod +x deploy.sh
./deploy.sh
```

---

# 🚀 STEP 8 — TEST KIRA (BEDROCK)

Go to:

👉 AWS Bedrock → Agents → aiops-assistant

Test queries:

```
check cluster health
show cpu usage
show errors
```

---

# 🚀 STEP 9 — RUN STREAMLIT UI

## 🔹 Install dependencies

```bash
pip install -r requirements.txt
```

---

## 🔹 Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```
BEDROCK_AGENT_ID=your-agent-id
AWS_REGION=us-east-1
```

---

## 🔹 Run UI

```bash
streamlit run app.py
```

👉 Open in browser:

```
http://localhost:8501
```

---

# 🧪 TEST SCENARIOS

## 🔹 Health Check

```
check cluster health
```

## 🔹 Logs

```
show recent errors
```

## 🔹 Metrics

```
show cpu usage
```

---

## 🔹 Failure Simulation

```bash
kubectl scale deployment backend -n eks --replicas=1
```

Then ask:

```
why is my app unhealthy
```

---

# 🎯 FINAL RESULT

* Logs → CloudWatch ✔
* Metrics → Prometheus ✔
* Health → Lambda ✔
* AI → Bedrock Agent ✔
* UI → Streamlit ✔

👉 Full AIOps system working 🚀
