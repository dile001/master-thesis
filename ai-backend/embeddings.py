import boto3
import json

# AWS Bedrock Embeddings client
embed_client = boto3.client("bedrock-runtime", region_name="eu-central-1")

def generate_embedding(text):
    """Converts text into a vector representation using Amazon Titan."""
    response = embed_client.invoke_model(
        modelId="amazon.titan-embed-text-v1",
        body=json.dumps({"inputText": text})
    )

    response_json = json.loads(response["body"].read())
    return response_json.get("embedding", [])  # Return embedding vector
