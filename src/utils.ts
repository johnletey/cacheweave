import localPorridge from "localporridge";

export const updateCache = (
  name: string,
  element: string,
  value: any
): void => {
  const storage =
    typeof localStorage === "undefined"
      ? new localPorridge("./.cache.json")
      : localStorage;

  const cache = JSON.parse(storage.getItem(name) || "{}");

  cache[element] = value;

  storage.setItem(name, JSON.stringify(cache));
};
