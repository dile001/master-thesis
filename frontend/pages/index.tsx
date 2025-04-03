import Head from "next/head";
import SearchBar from "../components/searchbar";

export default function Home() {
  return (
    <>
      <Head>
        <title>AI-Powered Search Engine</title>
        <meta
          name="description"
          content="Search your static site with AI-enhanced capabilities."
        />
      </Head>

        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-2xl text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                    🔍 AI-Powered Search
                </h1>
                <p className="text-gray-600 mb-8">
                    Explore static content using modern AI and semantic understanding.
                </p>

                <SearchBar/>
            </div>

            <footer className="mt-12 text-sm text-gray-400">
                Powered by Next.js, AWS Bedrock, and OpenSearch Serverless
            </footer>
        </main>

    </>
  );
}
