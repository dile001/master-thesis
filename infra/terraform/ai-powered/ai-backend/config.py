import os
from dotenv import load_dotenv

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION", "eu-central-1")
AWS_BEDROCK_MODEL = os.getenv("AWS_BEDROCK_MODEL", "anthropic.claude-3-5-sonnet-20240620-v1:0")
AWS_BEDROCK_EMBEDDINGS_MODEL = os.getenv("AWS_BEDROCK_EMBEDDINGS_MODEL", "amazon.titan-embed-text-v1")

OPENSEARCH_ENDPOINT = os.getenv("OPENSEARCH_ENDPOINT", "https://1om7t6l9b67kot77a5v1.eu-central-1.aoss.amazonaws.com")
OPENSEARCH_INDEX = os.getenv("OPENSEARCH_INDEX", "pages")

API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", 5000))

DEBUG_MODE = os.getenv("DEBUG_MODE", "True").lower() == "true"
