from bedrock_client import expand_query
from embeddings import generate_embedding
from opensearch_client import search_opensearch

def process_query(user_query):
    # Step 1: Use AWS Bedrock to expand & improve query
    expanded_query = expand_query(user_query)

    # Step 2: Convert query to embedding
    query_vector = generate_embedding(expanded_query)

    # Step 3: Perform vector search in OpenSearch
    results = search_opensearch(query_vector)

    return {"query": expanded_query, "results": results}
