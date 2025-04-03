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

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths: { params: { slug: string; }; locale: string; }[] = [];

  for (const locale of locales || []) {
    pages.forEach((page) => {
      paths.push({
        params: { slug: page.slug },
        locale,
      });
    });
  }

  return { paths, fallback: false };
};


export const getStaticProps: GetStaticProps = async ({ params }) => {
  const pageData = pages.find((page) => page.slug === params?.slug);
  console.log("pageData",pageData);
  return { props: { pageData } };
};
