import boto3
import requests
import json
from requests_aws4auth import AWS4Auth

from config import OPENSEARCH_ENDPOINT, OPENSEARCH_INDEX, AWS_REGION

session = boto3.Session()
credentials = session.get_credentials()
auth = AWS4Auth(
    credentials.access_key,
    credentials.secret_key,
    AWS_REGION,
    "aoss",
    session_token=credentials.token
)

# A sample Titan-compatible vector (1536 floats)
sample_vector = [0.01] * 1536  # Replace with actual embedding later

doc = {
    "title": "How Solar Panels Work",
    "content": "Solar panels convert sunlight into electricity using photovoltaic cells...",
    "vector_field": sample_vector
}

headers = {"Content-Type": "application/json"}

res = requests.post(
    f"{OPENSEARCH_ENDPOINT}/{OPENSEARCH_INDEX}/_doc",
    auth=auth,
    headers=headers,
    data=json.dumps(doc)
)

print("Status:", res.status_code)
print("Response:", res.json())
