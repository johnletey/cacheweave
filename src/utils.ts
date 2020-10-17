import localPorridge from "localporridge";
import fetch from "node-fetch";

export const updateCache = (
  name: string,
  element: string,
  value: any
): void => {
  const storage = typeof localStorage === "undefined" ? new localPorridge("./.cache.json") : localStorage;

  const cache = JSON.parse(storage.getItem(name) || "{}");

  cache[element] = value;

  storage.setItem(name, JSON.stringify(cache));
};

export const query = async ({
  query,
  variables,
}: {
  query: string;
  variables: Record<string, unknown>;
}): Promise<any> => {
  const graphql = JSON.stringify({
    query,
    variables,
  });

  const requestOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: graphql,
  };

  const res = await fetch("https://arweave.net/graphql", requestOptions);
  return await res.clone().json();
};
