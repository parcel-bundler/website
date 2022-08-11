import { useMemo, useEffect, useState } from "react";

export function useSearch({ type, page, filter, includeOfficial }) {
  let [result, setResult] = useState();

  useEffect(() => {
    let outdated = false;

    const searchParams = new URLSearchParams({
      "x-algolia-agent": "parcel-plugin-browser",
      "x-algolia-application-id": "OFCNCOG2CU",
      "x-algolia-api-key": "f54e21fa3a2a0160595bb058179bfb1e",
    });

    const href = `https://ofcncog2cu-2.algolianet.com/1/indexes/*/queries?${searchParams.toString()}`;

    fetch(href, {
      method: "POST",
      body: JSON.stringify({
        // https://grep.app/search?q=OFCNCOG2CU
        // https://github.com/algolia/npm-search#usage
        requests: [
          {
            analyticsTags: ["parcel-plugin-browser"],
            attributesToHighlight: ["name", "description", "keywords"],
            attributesToRetrieve: [
              "isDeprecated",
              "description",
              "dependencies",
              // "downloadsLast30Days",
              // "homepage",
              "humanDownloadsLast30Days",
              // "keywords",
              "modified",
              "name",
              "owner",
              // "repository",
              // "version",
            ],
            facets: ["owner.name", "isDeprecated"],
            //facets: ["keywords", "keywords", "owner.name"],
            filters: `${
              !includeOfficial ? "NOT owner.name:parcel-bundler AND" : ""
            } NOT owner.name:thejameskyle AND isDeprecated:false`,
            hitsPerPage: 24,
            indexName: "npm-search",
            maxValuesPerFacet: 10,
            page: page,
            params: "",
            query: `parcel-${type} ${filter}`,
            tagFilters: "",
          },
        ],
      }),
    }).then(async (r) => {
      let json = await r.json();
      if (!outdated) {
        let [results] = json.results;
        if (type !== "config") {
          results.hits = results.hits?.filter(
            (r) => "@parcel/plugin" in r.dependencies
          );
        }
        setResult(results);
        window.scrollTo(0, 0);
      }
    });

    return () => {
      outdated = true;
    };
  }, [type, page, filter, includeOfficial]);

  return result;
}

export function useHashState(initialValue) {
  const [search, setSearch] = useState(window.location.search);

  useEffect(() => {
    let onPopState = e => {
      setSearch(window.location.search);
    };
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  const normalizedSearch = search.length > 0 ? search.substr(1) : "";

  let state = useMemo(() => {
    if (normalizedSearch.length > 0) {
      try {
        let params = new URLSearchParams(normalizedSearch);
        return Object.fromEntries(
          [...params.entries()].map(([k, v]) => [k, JSON.parse(v)])
        );
      } catch (e) {}
    }
    return initialValue;
  }, [normalizedSearch]);

  return [
    state,
    (change) => {
      let newState = { ...state, ...change };

      let params = new URLSearchParams();
      for (let [k, v] of Object.entries(newState)) {
        params.set(k, JSON.stringify(v));
      }
      setSearch('?' + params);
      history.pushState(null, null, '?' + params);
    },
  ];
}
