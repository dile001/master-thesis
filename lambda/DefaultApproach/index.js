const AWS = require('aws-sdk');
const { Client } = require('@opensearch-project/opensearch');

const client = new Client({
    node: process.env.OPENSEARCH_ENDPOINT,
});

exports.lambda_handler = async (event) => {
    const searchQuery = event.queryStringParameters.query;

    if (!searchQuery) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Search query is required',
            }),
        };
    }

    try {
        const response = await client.search({
            index: process.env.OPENSEARCH_INDEX,
            body: {
                query: {
                    match: {
                        _all: searchQuery,
                    },
                },
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Search successful',
                results: response.body.hits.hits,
            }),
        };
    } catch (error) {
        console.error('Error executing OpenSearch query:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to execute search query',
                error: error.message,
            }),
        };
    }
};
