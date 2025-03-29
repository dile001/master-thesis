import boto3
import json

bedrock_client = boto3.client("bedrock-runtime", region_name="eu-central-1")

def expand_query(query):
    response = bedrock_client.invoke_model(
        modelId="anthropic.claude-3-5-sonnet-20240620-v1:0",
        body=json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "messages": [
                {
                    "role": "user",
                    "content": f"Rewrite this search query to be more detailed and precise: '{query}'"
                }
            ],
            "max_tokens": 100,
            "temperature": 0.5
        }),
        contentType="application/json",
        accept="application/json"
    )

    response_json = json.loads(response["body"].read())

    if "content" in response_json and isinstance(response_json["content"], list):
        return response_json["content"][0].get("text", query)

    return query
