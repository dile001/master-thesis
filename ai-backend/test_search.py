import unittest
from search import process_query

class TestSearch(unittest.TestCase):

    def test_search_results(self):
        """Test if the search function returns non-empty results."""
        test_query = "Best solar panels for home"
        response = process_query(test_query)

        self.assertIsInstance(response, dict, "Response should be a dictionary")
        self.assertIn("results", response, "Response should contain 'results' key")
        self.assertIsInstance(response["results"], list, "Results should be a list")
        self.assertGreater(len(response["results"]), 0, "Results should not be empty")

    def test_query_expansion(self):
        """Test if query expansion modifies the query meaningfully."""
        test_query = "cheap solar panels"
        response = process_query(test_query)

        self.assertIn("query", response, "Response should contain 'query' key")
        self.assertNotEqual(response["query"], test_query, "Expanded query should be different from input")

    def test_invalid_search(self):
        """Test if an empty query is handled properly."""
        response = process_query("")
        self.assertEqual(response, {"error": "Invalid query"}, "Should return an error for empty query")

if __name__ == "__main__":
    unittest.main()
