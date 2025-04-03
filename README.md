# AI-Powered Static Search Engine

## Deployment and Usage Instructions

This project consists of three core components:
- **Frontend**: A static Next.js application exported with `output: export`
- **Backend**: Python Flask API for AI-powered search using AWS Bedrock and OpenSearch Serverless
- **Infrastructure**: Deployed via Terraform across multiple modules (`shared`, `costoptimized`, `ai-powered`, etc.)

---

### Repository Structure

```
project-root/
├── frontend/                 # Static frontend app (Next.js)
├── infra/
│   ├── shared/              # Shared AWS resources (S3, IAM roles, VPC)
│   ├── costoptimized/       # Cost-efficient Pagefind backend
│   ├── ai-powered/          # AI-powered backend (Bedrock + OpenSearch)
│   └── default-opensearch/  # Traditional OpenSearch backend
└── README.md
```

---

### Prerequisites

- Node.js ≥ 18 (for frontend)
- Terraform ≥ 1.5
- AWS CLI configured (`aws configure`)
- Python ≥ 3.10 (for AI backend)
- Docker (to build Lambda image for AI backend)

---

### Deploying the AI-Powered Backend

1. **Navigate to the AI Terraform folder:**
```bash
   cd infra/ai-powered
```

2. **Build and push your container image to ECR:**
```bash
   docker build -t ai-search-lambda .
   docker tag ai-search-lambda:latest 577240613147.dkr.ecr.eu-central-1.amazonaws.com/ai-search-lambda:latest
   aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 577240613147.dkr.ecr.eu-central-1.amazonaws.com
   docker push 577240613147.dkr.ecr.eu-central-1.amazonaws.com/ai-search-lambda:latest
```

3. **Apply infrastructure via Terraform:**
```bash
   terraform init
   terraform apply
```

4. **Provide the ECR image URI when prompted:**
```
577240613147.dkr.ecr.eu-central-1.amazonaws.com/ai-search-lambda:latest
```

Once deployed, your API Gateway URL will be output like:
```
ai_api_url = https://xyz.execute-api.eu-central-1.amazonaws.com
```

---

### Deploying the Static Frontend

1. **Build and export the frontend:**
```bash
   cd frontend
   npm install
   npm run build
```

2. **Copy the `out/` directory to the S3 bucket (from shared module):**
```bash
   aws s3 sync out/ s3://shared-bucket-for-all-systems
  ```

---

### Running Locally for Development

#### AI Backend:
```bash
  cd ai-backend
  python -m venv venv && source venv/bin/activate
  pip install -r requirements.txt
  python app.py
```

#### Frontend:
```bash
  cd frontend
  npm run dev
```

---

### A/B Testing Note

The frontend includes logic that randomly assigns users to either the **cost-efficient** or **AI-powered** backend using `localStorage`. This enables unbiased A/B testing. The assigned group is silently tracked via hidden form input during user feedback collection.
