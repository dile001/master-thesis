import { GetStaticProps, GetStaticPaths } from "next";
import pages from "../content/pages.json";

export default function Page({ pageData }: { pageData: any }) {
  if (!pageData) return <p>Page not found</p>;
  return (
    <main>
      <h1>{pageData.title}</h1>
      <p>{pageData.content}</p>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = pages.map((page) => ({ params: { slug: page.slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const pageData = pages.find((page) => page.slug === params?.slug);
  return { props: { pageData } };
};
