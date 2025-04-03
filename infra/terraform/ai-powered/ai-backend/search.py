from bedrock_client import expand_query
from embeddings import generate_embedding
from opensearch_client import search_opensearch

def process_query(user_query):
    expanded_query = expand_query(user_query)

    query_vector = generate_embedding(expanded_query)

    results = search_opensearch(query_vector)

    return {"query": expanded_query, "results": results}
