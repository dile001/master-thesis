import json
from search import process_query

def handler(event, context):
    try:
        if event.get("body"):
            body = json.loads(event["body"])
        else:
            body = event

        query = body.get("query")
        if not query:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Query is required"})
            }

        results = process_query(query)

        return {
            "statusCode": 200,
            "body": json.dumps(results)
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
