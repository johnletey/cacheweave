export const updateCache = (
  name: string,
  element: string,
  value: any
): void => {
  // @ts-ignore
  const cache = JSON.parse(localStorage.getItem(name) || "{}");

  cache[element] = value;

  // @ts-ignore
  localStorage.setItem(name, JSON.stringify(cache));
};
