const AWS = require('aws-sdk');
const { searchPagefind } = require('./utils/search');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const query = body.query;

        if (!query) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Query is required." }),
            };
        }

        const results = await searchPagefind(s3, query);

        return {
            statusCode: 200,
            body: JSON.stringify({ results }),
        };
    } catch (err) {
        console.error("Search error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error", error: err.message }),
        };
    }
};
