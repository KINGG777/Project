# 🚀 AWS Three-Tier DevOps Project on EKS

A complete production-style DevOps project demonstrating how to deploy a Three-Tier Application on AWS EKS using modern DevOps tools and GitOps practices.

## 📌 Features

- Infrastructure as Code with Terraform
- CI/CD with Jenkins
- Code Quality with SonarQube
- Security Scanning with Trivy
- Docker + Amazon ECR
- Kubernetes Deployment on Amazon EKS
- GitOps with ArgoCD
- Monitoring with Prometheus & Grafana
- DNS with Route53
- Database with AWS RDS

---

## 🏗️ Project Architecture

```text
User
 ↓
Route53 Domain
 ↓
Frontend LoadBalancer
 ↓
Backend LoadBalancer
 ↓
AWS RDS MySQL

CI/CD Flow:
GitHub → Jenkins → SonarQube → Trivy → Docker → ECR
        ↓
Update Kubernetes Manifests
        ↓
ArgoCD Sync
        ↓
Amazon EKS
```

---

## 🛠️ Tech Stack

- AWS EC2
- AWS VPC
- AWS EKS
- AWS RDS
- AWS ECR
- Route53
- Terraform
- Jenkins
- SonarQube
- Trivy
- Docker
- Kubernetes
- ArgoCD
- Helm
- Prometheus
- Grafana
- GitHub

---

## 📂 Clone Repository

```bash
git clone https://github.com/KINGG777/Project.git
cd Project
```

---

## ⚙️ Configure AWS CLI

```bash
aws configure
```

Use:

- AWS Access Key
- AWS Secret Key
- Region: `us-east-1`

---

## 🏗️ Deploy Infrastructure

```bash
cd terraform_main_ec2
terraform init
terraform apply --auto-approve
```

Update these values before apply:

- Key Pair Name
- S3 Bucket Name

---

## ✅ Terraform Creates

- VPC
- Public / Private Subnets
- Internet Gateway
- NAT Gateway
- Security Groups
- Jump Host EC2
- AWS RDS MySQL
- Amazon EKS Cluster (`project-eks`)

---

## 🖥️ Jump Host Auto Setup

Installed automatically:

- Docker
- Jenkins
- Git
- Java
- Maven
- Terraform
- Helm
- Trivy

---

## 🔐 Jenkins Access

```text
http://<JUMPHOST_PUBLIC_IP>:8080
```

Install required plugins:

- Git Plugin
- Pipeline Stage View
- Eclipse Temurin Installer
- SonarQube Scanner
- NodeJS Plugin

---

## 🔧 Jenkins Credentials

Add Secret Text credentials:

| ID | Value |
|----|------|
| ACCOUNT_ID | AWS Account ID |
| ECR_REPO1 | frontend |
| ECR_REPO2 | backend |
| git-token | GitHub Token |
| sonar-token | Sonar Token |

---

## 🔍 SonarQube Setup

```text
http://<SERVER_IP>:9000
```

Create projects:

- three-tier-frontend
- three-tier-backend

Webhook:

```text
http://<JENKINS_IP>:8080/sonarqube-webhook/
```

---

## 🐳 Create ECR Repositories

- frontend
- backend

---

## 🌐 Route53 Setup

Create hosted zone for your domain.

Example:

```text
yourdomain.com
```

---

## ⚠️ Update Frontend API URL

File:

```text
client/src/pages/config.js
```

Change:

```javascript
const API_BASE_URL = "http://yourdomain.com";
```

---

## 🚀 Jenkins Pipelines

Create these pipelines:

1. EKS Infrastructure Pipeline (`eks-terraform`)
2. Frontend Pipeline
3. Backend Pipeline

### Pipelines Perform:

- Code Checkout
- Build Application
- SonarQube Scan
- Trivy Scan
- Docker Build
- Push to ECR
- Update Kubernetes YAML
- Push Changes to GitHub

---

## ☸️ Configure kubectl from Jump Host

```bash
ssh -i key.pem ec2-user@<JUMPHOST_PUBLIC_IP>

aws eks update-kubeconfig --region us-east-1 --name project-eks

kubectl get nodes
```

---

## ☸️ Create Namespaces

```bash
kubectl create namespace eks
kubectl create namespace argocd
kubectl create namespace prometheus
```

---

## 🚀 Install ArgoCD

```bash
kubectl apply --server-side -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Expose ArgoCD:

```bash
kubectl patch svc argocd-server -n argocd -p '{"spec":{"type":"LoadBalancer"}}'
kubectl get svc -n argocd
```

---

## 🔐 Get ArgoCD Password

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

Login:

- Username: `admin`

---

## 📦 Create ArgoCD Application

Use:

- GitHub Repo URL
- Path: `kubernetes-files`
- Namespace: `eks`

---

## 🗄️ Configure Database Secret

```bash
echo -n "your-rds-endpoint.amazonaws.com" | base64
```

Paste encoded value into:

```text
kubernetes-files/secret.yaml
```

---

## 📥 Insert Dummy Data into RDS

```bash
sudo dnf install mariadb105 -y

mysql -h <RDS-ENDPOINT> -u admin -pPASSWORD < test.sql
```

---

## 📊 Monitoring Setup

```bash
helm repo add stable https://charts.helm.sh/stable
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

kubectl create namespace prometheus

helm install stable prometheus-community/kube-prometheus-stack -n prometheus
```

---

## ⚠️ If Pods Pending

```bash
eksctl scale nodegroup \
--cluster project-eks \
--region us-east-1 \
--name project-node-group \
--nodes 3

kubectl get pods -n prometheus -w

kubectl rollout restart deployment stable-grafana -n prometheus
```

---

## 🌐 Expose Monitoring Services

```bash
kubectl patch svc stable-kube-prometheus-sta-prometheus -n prometheus -p '{"spec":{"type":"LoadBalancer"}}'

kubectl patch svc stable-grafana -n prometheus -p '{"spec":{"type":"LoadBalancer"}}'
```

---

## 🔐 Grafana Password

```bash
kubectl get secret stable-grafana -n prometheus -o jsonpath="{.data.admin-password}" | base64 -d
```

---

## 📈 Grafana Dashboards

- CPU Usage
- Memory Usage
- Pod Metrics
- Cluster Health
- Node Monitoring

---

## 🎯 Final Outcome

- Fully Automated AWS DevOps Project
- End-to-End CI/CD Pipeline
- GitOps Kubernetes Deployment
- Secure Container Delivery
- Real-Time Monitoring Stack

---

## 👑 Author

**DevOps KINGG**

GitHub: https://github.com/KINGG777

---

## ⭐ Support

If this project helped you, give it a star on GitHub.
