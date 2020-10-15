import Arweave from "arweave";
import { updateCache } from "./utils";

export async function getData(client: Arweave, id: string): Promise<string> {
  // @ts-ignore
  const isBrowser: boolean = process.browser;

  if (isBrowser) {
    // @ts-ignore
    const cache = JSON.parse(localStorage.getItem("dataCache") || "{}");

    if (id in cache) {
      return cache[id];
    }
  }

  const buf: string | Uint8Array = await client.transactions.getData(id, {
    decode: true,
    string: true,
  });

  if (isBrowser) updateCache("dataCache", id, buf.toString());

  return buf.toString();
}
