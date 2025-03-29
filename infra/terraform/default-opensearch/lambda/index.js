const { Client } = require('@opensearch-project/opensearch');
const createAwsConnector = require('aws-opensearch-connector');
const AWS = require('aws-sdk');

const awsCredentials = new AWS.EnvironmentCredentials('AWS');

const client = new Client({
    ...createAwsConnector({
        credentials: awsCredentials,
        region: 'eu-central-1',
    }),
    node: `https://${process.env.OPENSEARCH_ENDPOINT}`,
});

exports.lambda_handler = async (event) => {
    console.log("🚀 Lambda started");
    console.log("Raw event:", JSON.stringify(event));

    const body = JSON.parse(event.body || '{}');
    const searchQuery = body.query;

    console.log("Parsed query:", searchQuery);
    console.log("Using endpoint:", process.env.OPENSEARCH_ENDPOINT);
    console.log("Using index:", process.env.OPENSEARCH_INDEX);

    if (!searchQuery) {
        console.log("❌ No search query provided");
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

        console.log("✅ OpenSearch response:", JSON.stringify(response.body));

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Search successful',
                results: response.body.hits.hits,
            }),
        };
    } catch (error) {
        console.error("🔥 Error executing OpenSearch query:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to execute search query',
                error: error.message,
            }),
        };
    }
};
