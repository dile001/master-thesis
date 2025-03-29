const fs = require('fs');
const fetch = require('node-fetch');

const STRAPI_BASE_URL = 'https://your-strapi-url.com/api/pages';

const generateSearchIndex = async () => {
    try {
        const res = await fetch(STRAPI_BASE_URL);
        const { data } = await res.json();

        const index = data.map((item) => ({
            id: item.id,
            url: `/your-path/${item.attributes.slug}`,
            title: item.attributes.title,
            excerpt: item.attributes.content.slice(0, 300),
        }));

        fs.writeFileSync('out/pagefind/search_index.json', JSON.stringify({ pages: index }, null, 2));
        console.log('✅ Successfully generated search index');
    } catch (err) {
        console.error('❌ Failed to generate search index', err);
    }
};

generateSearchIndex();
