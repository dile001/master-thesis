import { useEffect, useState } from "react";

const usePageFind = () => {
  const [pageFind, setPageFind] = useState<any>(null);

  useEffect(() => {
    async function loadPageFind() {
      if (!pageFind) {
        try {
          const importedPageFind = await import(
            // @ts-expect-error pagefind exists only on build
            /* webpackIgnore: true */ "./pagefind/pagefind.js"
          );
          await importedPageFind.options({
            highlightParam: "highlight",
          });
          setPageFind(importedPageFind);
        } catch (e) {
          console.error("Error loading PageFind:", e);
        }
      }
    }
    loadPageFind();
  }, [pageFind]);

  return pageFind;
};

export default usePageFind;
