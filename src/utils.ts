export const updateCache = (
  name: string,
  element: string,
  value: any
): void => {
  const cache = JSON.parse(localStorage.getItem(name) || "{}");

  cache[element] = value;

  localStorage.setItem(name, JSON.stringify(cache));
};
