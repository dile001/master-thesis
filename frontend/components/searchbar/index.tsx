import { ChangeEvent, useEffect, useState } from "react";
import React from "react";
import usePageFind from "../../utils/hooks/usePageFind";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";

interface SearchResultItem {
  meta?: { title?: string };
  raw_url?: string;
  excerpt?: string;
}

const performCustomSearch = async (
  results: any,
  searchValue: string,
): Promise<SearchResultItem[]> => {
  const modifiedResults: SearchResultItem[] = [];
  const searchValueNormalized = searchValue.trim().toLowerCase();

  for (const result of results) {
    const data = await result?.data();
    const regex = /<mark>(.*?)<\/mark>/gi;
    const matches = data.excerpt.match(regex);

    if (
      matches &&
      matches.some((match: string) => {
        const matchContent = match.replace(/<\/?mark>/gi, "").toLowerCase();
        return (
          matchContent.includes(searchValueNormalized) ||
          searchValueNormalized.includes(matchContent)
        );
      })
    ) {
      modifiedResults.push(data);
    }
  }
  return modifiedResults;
};

export default function SearchBar() {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const pageFind = usePageFind();
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(inputValue !== "" && isFocused);
    }, 100);
  }, [isFocused, inputValue]);

  const handleSearch = async (searchValue: string) => {
    setInputValue(searchValue);
    if (pageFind) {
      await pageFind.options({
        excerptLength: 25,
        highlightParam: "highlight",
        ranking: {
          termSimilarity: 1.0,
        },
      });
      const search = await pageFind.debouncedSearch(searchValue, 3000);

      if (search?.results?.length > 0) {
        const modifiedResults = await performCustomSearch(
          search.results,
          searchValue,
        );
        setResults(modifiedResults ?? []);
      }
    } else {
      console.log("Could not load pageFind");
    }
  };

  return (
    <div className="relative h-fit">
      <div className="flex justify-center">
        <motion.div
          className="relative flex w-full max-w-xl"
          animate={{
            scale: isFocused || inputValue !== "" ? 1 : 0.9,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-y-0 left-3 flex origin-center items-center"
            initial={{ rotate: 0 }}
            animate={{
              rotate: isFocused || inputValue !== "" ? 90 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <FiSearch className="h-5 w-5 text-gray-500" />
          </motion.div>
          <motion.input
            type="text"
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-500 shadow focus:outline-none"
            placeholder="Suche..."
            value={inputValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleSearch(e.target.value)
            }
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            initial={{
              width: "80%",
            }}
            animate={{
              width: isFocused || inputValue !== "" ? "100%" : "80%",
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>
      <DropDown results={results} open={isOpen} />
    </div>
  );
}

const DropDown = ({
  results,
  open,
}: {
  results: SearchResultItem[];
  open?: boolean;
}) => {
  return (
    <motion.div animate={open ? "open" : "closed"}>
      <motion.ul
        initial={wrapperVariants.closed}
        variants={wrapperVariants}
        style={{ originY: "top", translateX: "-100%" }}
        className="group absolute left-[100%] top-[130%] z-50 flex max-h-96 w-96 flex-col gap-2 overflow-x-hidden overflow-y-scroll rounded-lg border bg-white p-2 shadow-xl"
      >
        {results?.length > 0 ? (
          results?.map((item, index) => <Option item={item} key={index} />)
        ) : (
          <li className="flex w-full items-center p-2 text-black transition-colors">
            {"No results found"}
          </li>
        )}
      </motion.ul>
    </motion.div>
  );
};

const Option = ({ item }: { item: SearchResultItem }) => {
  return (
    <li className="flex max-h-96 w-full cursor-pointer items-center gap-2 border-b border-gray-100 p-2 text-black transition-colors last:border-b-0 hover:border-b-0">
      {item !== undefined && item.raw_url !== undefined && (
        <Link href={item?.raw_url}>
          <div
            className={
              "group/item flex cursor-pointer flex-col items-center px-5 py-2 font-medium text-secondary transition-colors duration-500 first:rounded-t-lg last:rounded-b-lg hover:bg-primary hover:text-white"
            }
          >
            text={item?.meta?.title}
            {item?.excerpt && <span>...${item?.excerpt}...</span>}
          </div>
        </Link>
      )}
    </li>
  );
};

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};
