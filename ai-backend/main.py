from flask import Flask, request, jsonify
from search import process_query

app = Flask(__name__)

@app.route("/search", methods=["POST"])
def search():
    data = request.json
    query = data.get("query", "")
    if not query:
        return jsonify({"error": "Query is required"}), 400

    results = process_query(query)
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)
