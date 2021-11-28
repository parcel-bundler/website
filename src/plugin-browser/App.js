import { useState } from "react";
import { useDebounce } from "react-use";
import { useSearch, useHashState } from "./hooks.js";

const dateFormatter = new Intl.RelativeTimeFormat(navigator.language, {numeric: 'auto'});
const day = 1000 * 3600 * 24;
const month = day * 31;
const year = day * 365;
function formatAgo(date) {
  let diff = date - Date.now();
  let absDiff = Math.abs(diff);
  let unit = 'day';
  if (absDiff >= year) {
    unit = 'year';
    diff /= year;
  } else if (absDiff >= month) {
    unit = 'month';
    diff /= month;
  } else {
    diff /= day;
  }

  return dateFormatter.format(Math.round(diff), unit);
}

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
    <div className="bg-white text-black dark:bg-gray-800 dark:text-white flex gap-8 flex-col p-2 min-h-screen">
      <div className="flex gap-4 flex-col md:flex-row">
        <label className="flex flex-col text-sm gap-1">
          Plugin type
          <div className="relative">
            <select
              value={type}
              onChange={(e) => setState({ type: e.target.value, page: 0 })}
              className="py-1 pl-2 pr-6 bg-white appearance-none dark:bg-gray-700 shadow-md rounded-md border-gray-400 dark:border-gray-600 border transition focus:outline-none focus:ring focus:ring-offset-0 focus:ring-sky-700 dark:focus:border-sky-600"
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
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 absolute top-0 right-1 h-full pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </label>
        <label className="flex flex-col text-sm gap-1">
          Filter
          <div className="relative">
            <svg aria-hidden="true" fill="none" className="w-4 absolute left-2 top-0 h-full" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={filter}
              onChange={(e) => setState({ filter: e.target.value, page: 0 })}
              className="bg-white dark:bg-gray-800 rounded-full pr-2 pl-8 py-1 w-48 transition border-gray-400 dark:border-gray-600 border focus:outline-none focus:ring focus:ring-offset-0 focus:ring-sky-700 dark:focus:border-sky-600"
            />
          </div>
        </label>
        <label className="flex gap-1 items-center self-end text-sm py-1">
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
      <div className="w-full md:w-3xl mt-3 flex flex-col flex-1 gap-3">
        {results?.nbPages === 0 && <span>No results</span>}
        {results?.hits.map((r, i) => (
          <Result
            key={i}
            name={r.name}
            downloads={r.humanDownloadsLast30Days}
            modified={r.modified}
            description={r.description}
          />
        ))}
        {results?.nbPages > 0 && 
        <div className="flex items-center justify-center gap-4 my-4 text-sm ">
          <Button
            onClick={() => setState({ page: page - 1 })}
            disabled={page === 0}
          >
            Previous Page
          </Button>
          <span>
            {page + 1} {results && `of ${results.nbPages}`}
          </span>
          <Button
            onClick={() => setState({ page: page + 1 })}
            disabled={results && page === results.nbPages - 1}
          >
            Next Page
          </Button>
        </div>}
      </div>
    </div>
  );
}

function Button(props) {
  return (
    <button 
      {...props}
      className="cursor-auto disabled:opacity-30 px-2 py-1 rounded-md transition dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-700 dark:disabled:bg-gray-700" />
  );
}

function Result({ name, downloads, modified, description }) {
  return (
    <a href={`https://www.npmjs.com/package/${name}`} target="_blank" className="bg-white dark:bg-gray-700 dark:hover:bg-gray-600 transition p-3 rounded-xl shadow-md gap-2 grid" style={{gridTemplateColumns: '1fr auto'}}>
      <span className="font-semibold text-lg">
        {name}
      </span>
      <div className="text-right text-gray-400 text-sm leading-relaxed row-span-2 flex flex-col">
        <span>{formatAgo(modified)}</span>
        <span><DownloadIcon /> {downloads}</span>
      </div>
      <div className="text-sm">{description}</div>
    </a>
  );
}

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
    </svg>
  );
}
