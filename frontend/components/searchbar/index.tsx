import { ChangeEvent, useEffect, useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";

interface SearchResultItem {
  meta?: { title?: string };
  raw_url?: string;
  excerpt?: string;
}

export default function SearchBar() {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [apiUrl, setApiUrl] = useState<string>("");
  const [variant, setVariant] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("search_variant") as "1" | "2" | null;

    let selected: "1" | "2";
    if (stored) {
      selected = stored;
    } else {
      selected = Math.random() < 0.5 ? "1" : "2";
      console.log("Selected variant:", selected);
      localStorage.setItem("search_variant", selected);
    }

    setVariant(selected);
    setApiUrl(
        selected === "1"
            ? "https://your-cost-api/search"
            : "https://your-ai-api/search"
    );
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsOpen(inputValue !== "" && isFocused);
    }, 100);
    return () => clearTimeout(timeout);
  }, [isFocused, inputValue]);

  const handleSearch = async (query: string) => {
    setInputValue(query);
    if (!apiUrl || !query.trim()) return;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setResults(data?.results || []);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
      <div className="relative h-fit">
        <div className="flex justify-center">
          <motion.div
              className="relative flex w-full max-w-xl"
              animate={{ scale: isFocused || inputValue !== "" ? 1 : 0.95 }}
              transition={{ duration: 0.3 }}
          >
            <motion.div
                className="absolute inset-y-0 left-3 flex items-center"
                animate={{ rotate: isFocused || inputValue !== "" ? 90 : 0 }}
                transition={{ duration: 0.3 }}
            >
              <FiSearch className="h-5 w-5 text-gray-500" />
            </motion.div>
            <motion.input
                type="text"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-700 shadow focus:outline-none"
                placeholder="Search for anything..."
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleSearch(e.target.value)
                }
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                initial={{ width: "80%" }}
                animate={{
                  width: isFocused || inputValue !== "" ? "100%" : "80%",
                }}
                transition={{ duration: 0.3 }}
            />
          </motion.div>
        </div>

        <DropDown results={results} open={isOpen} />

        {variant && (
            <p className="mt-2 text-sm text-gray-400 text-center">
              Once you finished all the tasks, please fill this form out:
                <a
                    href={`https://docs.google.com/forms/d/e/1FAIpQLSeLMT-I6CyLD3JEX-DgewWTHV7fQNKtMPj-zbmuJ4BmVoBLLA/viewform?usp=pp_url&entry.93189840=${variant}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                >
                  Your feedback is important! Thank you!
                </a>
            </p>
        )}
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
      <motion.div
          animate={open ? "open" : "closed"}
          initial="closed"
          variants={wrapperVariants}
          transition={{ duration: 0.3 }}
          className="absolute left-1/2 top-[130%] z-50 w-full max-w-xl -translate-x-1/2 rounded-lg border bg-white shadow-xl"
      >
        <ul className="max-h-80 overflow-y-auto p-2 space-y-2">
          {results.length > 0 ? (
              results.map((item, index) => (
                  <li key={index}>
                    <Link href={item?.raw_url || "#"} passHref>
                      <div className="block rounded-md p-3 hover:bg-gray-100 transition-colors">
                        <p className="font-semibold text-gray-800">
                          {item.meta?.title || "Untitled"}
                        </p>
                        {item.excerpt && (
                            <p className="text-sm text-gray-500">
                              ...{item.excerpt}...
                            </p>
                        )}
                      </div>
                    </Link>
                  </li>
              ))
          ) : (
              <li className="text-gray-500 text-center p-4">No results found</li>
          )}
        </ul>
      </motion.div>
  );
};

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.05 },
  },
  closed: {
    scaleY: 0,
    transition: { when: "afterChildren", staggerChildren: 0.05 },
  },
};
