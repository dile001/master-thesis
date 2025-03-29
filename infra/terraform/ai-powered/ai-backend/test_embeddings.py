import unittest
from embeddings import generate_embedding

class TestEmbeddings(unittest.TestCase):

    def test_embedding_generation(self):
        """Test if the embedding function returns a valid vector."""
        test_text = "Solar panels efficiency in winter"
        embedding = generate_embedding(test_text)

        self.assertIsInstance(embedding, list, "Embedding should be a list")
        self.assertGreater(len(embedding), 0, "Embedding should not be empty")
        self.assertIsInstance(embedding[0], float, "Embedding values should be floats")

if __name__ == "__main__":
    unittest.main()
