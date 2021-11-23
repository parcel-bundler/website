import { useState } from "react";
import { useDebounce } from "react-use";
import { formatDistance } from "date-fns";
import { useSearch, useHashState } from "./hooks.js";

export default function App() {
  const [{ type, page, filter, includeOfficial }, setState] = useHashState({
    type: "transformer",
    page: 0,
    filter: "",
    includeOfficial: false,
  });

  let [debouncedFilter, setDebouncedFilter] = useState("");

  useDebounce(
    () => {
      setDebouncedFilter(filter);
    },
    100,
    [filter]
  );

  let results = useSearch({
    type,
    page,
    filter: debouncedFilter,
    includeOfficial,
  });

  return (
    <div className="bg-white text-black dark:bg-gray-800 dark:text-white flex gap-2 flex-col items-center p-2 min-h-screen">
      <div className="flex gap-2 flex-col md:flex-row">
        <label className="flex gap-1">
          Plugin type:
          <select
            value={type}
            onChange={(e) => setState({ type: e.target.value, page: 0 })}
            className="bg-white dark:bg-gray-800 shadow-md rounded-md px-1 border-gray-400 border"
          >
            {[
              "transformer",
              "resolver",
              "bundler",
              "namer",
              "runtime",
              "packager",
              "optimizer",
              "compressor",
              "validator",
              "config",
              "reporter",
            ].map((v) => (
              <option value={v} key={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="flex gap-1">
          Filter:
          <input
            type="text"
            value={filter}
            onChange={(e) => setState({ filter: e.target.value, page: 0 })}
            className="bg-white dark:bg-gray-800 shadow-md rounded-md px-1 border-gray-400 border"
          />
        </label>
        <label className="flex gap-1 items-center">
          <input
            type="checkbox"
            checked={includeOfficial}
            onChange={(e) =>
              setState({ includeOfficial: e.target.checked, page: 0 })
            }
            className="shadow-md rounded-md px-1 border-gray-400 border"
          />
          Include offical Plugins
        </label>
      </div>
      <div className="w-full md:w-3xl flex-1">
        {results?.hits.map((r, i) => (
          <Result
            key={i}
            name={r.name}
            downloads={r.humanDownloadsLast30Days}
            modified={r.modified}
            description={r.description}
          />
        ))}
        <div className="flex justify-center gap-2">
          <button
            className="cursor-auto disabled:opacity-30 px-1"
            onClick={() => setState({ page: page - 1 })}
            disabled={page === 0}
          >
            Previous Page
          </button>
          <span>
            {page + 1} {results && `of ${results.nbPages}`}
          </span>
          <button
            className="cursor-auto disabled:opacity-30 px-1"
            onClick={() => setState({ page: page + 1 })}
            disabled={results && page === results.nbPages - 1}
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
}

function Result({ name, downloads, modified, description }) {
  return (
    <div className="bg-white dark:bg-gray-700 mx-auto my-4 w-full p-3 rounded-xl shadow-md gap-2 grid grid-cols-2 grid-rows-2">
      <a
        className="font-bold underline col-span-2 sm:col-span-1"
        href={`https://www.npmjs.com/package/${name}`}
      >
        {name}
      </a>
      <div className="text-right text-gray-400 col-span-2 sm:col-span-1">
        published {formatDistance(modified, new Date(), { addSuffix: true })},
        {downloads} ⏬
      </div>
      <div className="col-span-2">{description}</div>
    </div>
  );
}
