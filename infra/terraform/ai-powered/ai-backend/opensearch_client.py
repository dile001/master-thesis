import requests
from config import OPENSEARCH_ENDPOINT, OPENSEARCH_INDEX

def search_opensearch(query_vector):
    url = f"{OPENSEARCH_ENDPOINT}/{OPENSEARCH_INDEX}/_search"

    headers = {"Content-Type": "application/json"}
    payload = {
        "size": 5,
        "query": {
            "knn": {
                "vector_field": {
                    "vector": query_vector,
                    "k": 5,
                    "num_candidates": 50
                }
            }
        }
    }

    response = requests.post(
        f"{OPENSEARCH_ENDPOINT}/{OPENSEARCH_INDEX}/_search",
        headers={"Content-Type": "application/json"},
        json=payload
    )
    return response.json().get("hits", {}).get("hits", [])
