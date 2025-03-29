const { S3 } = require('aws-sdk');

const BUCKET = process.env.S3_BUCKET || 'shared-bucket-for-all-systems';
const PREFIX = 'pagefind';

exports.searchPagefind = async (s3, query) => {
    const params = {
        Bucket: BUCKET,
        Key: `${PREFIX}/pagefind_index.json`,
    };

    const data = await s3.getObject(params).promise();
    const indexJson = JSON.parse(data.Body.toString());

    const results = indexJson.pages.filter((p) =>
        p.excerpt.toLowerCase().includes(query.toLowerCase())
    );

    return results;
};
