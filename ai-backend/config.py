import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# AWS Configuration
AWS_REGION = os.getenv("AWS_REGION", "eu-central-1")  # Default: eu-central-1
AWS_BEDROCK_MODEL = os.getenv("AWS_BEDROCK_MODEL", "anthropic.claude-3-5-sonnet-20240620-v1:0")
AWS_BEDROCK_EMBEDDINGS_MODEL = os.getenv("AWS_BEDROCK_EMBEDDINGS_MODEL", "amazon.titan-embed-text-v1")

# OpenSearch Configuration
OPENSEARCH_ENDPOINT = os.getenv("OPENSEARCH_ENDPOINT", "https://your-opensearch-domain")
OPENSEARCH_INDEX = os.getenv("OPENSEARCH_INDEX", "your-index-name")
OPENSEARCH_USERNAME = os.getenv("OPENSEARCH_USERNAME", "admin")
OPENSEARCH_PASSWORD = os.getenv("OPENSEARCH_PASSWORD", "your-password")

# Flask API Configuration
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", 5000))  # Convert to integer

# Debug Mode
DEBUG_MODE = os.getenv("DEBUG_MODE", "True").lower() == "true"
