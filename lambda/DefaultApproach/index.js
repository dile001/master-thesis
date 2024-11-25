// lambda_function.js
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.lambda_handler = async (event) => {
    const bucketName = process.env.BUCKET_NAME; // Get the bucket name from environment variables

    try {
        // Example of retrieving an object from S3 bucket (you can modify this as needed)
        const params = {
            Bucket: bucketName,
            Key: 'example-file.txt' // Replace with the actual file name you want to access
        };

        const data = await s3.getObject(params).promise();

        // Return a successful response
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Successfully accessed the bucket: ${bucketName}`,
                fileContent: data.Body.toString('utf-8'), // This will output the file content
            }),
        };
    } catch (error) {
        console.error('Error accessing S3:', error);

        // Return an error response
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `Failed to access the bucket: ${bucketName}`,
                error: error.message,
            }),
        };
    }
};
