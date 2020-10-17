import Arweave from "arweave";
import localPorridge from "localporridge";
import { updateCache } from "./utils";

export async function getData(client: Arweave, id: string): Promise<string> {
  const storage = typeof localStorage === "undefined" ? new localPorridge("./.cache.json") : localStorage;

  const cache = JSON.parse(storage.getItem("dataCache") || "{}");

  if (id in cache) {
    return cache[id];
  }

  const buf: string | Uint8Array = await client.transactions.getData(id, {
    decode: true,
    string: true,
  });

  updateCache("dataCache", id, buf.toString());

  return buf.toString();
}
