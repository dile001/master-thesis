import boto3
import json

# AWS Bedrock client setup
bedrock_client = boto3.client("bedrock-runtime", region_name="eu-central-1")

def expand_query(query):
    """Enhances the search query using AWS Bedrock LLM."""
    prompt = f"Rewrite this search query to be more detailed and precise: '{query}'"

    response = bedrock_client.invoke_model(
        modelId="anthropic.claude-3-5-sonnet-20240620-v1:0",
        body=json.dumps({"prompt": prompt, "max_tokens": 50})
    )

    response_json = json.loads(response["body"].read())
    return response_json.get("completion", query)  # Return expanded query or fallback to original
