import Head from "next/head";
import SearchBar from "../components/SearchBar";

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

        <main className="flex flex-col items-center justify-center min-h-screen px-4">
          <h1 className="text-4xl font-bold mb-6">AI-Powered Search Engine</h1>

          <SearchBar />

          <footer className="mt-12 text-center text-sm text-gray-500">
            <p>Powered by Next.js, AWS, and AI</p>
          </footer>
        </main>
      </>
  );
}
