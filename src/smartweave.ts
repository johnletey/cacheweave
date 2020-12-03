import { run } from "ar-gql";
import { updateCache } from "./utils";
import Arweave from "arweave";
import { StateInterface } from "community-js/lib/faces";
import localPorridge from "localporridge";
import { readContract } from "smartweave";

const latestInteraction = async (
  contract: string,
  block: number
): Promise<string> => {
  return (
    await run(
      `
        query($contract: [String!]!, $block: Int) {
          transactions(
            tags: [
              { name: "App-Name", values: "SmartWeaveAction" }
              { name: "Contract", values: $contract }
            ]
            first: 1
            block: { max: $block }
          ) {
            edges {
              node {
                id
              }
            }
          }
        }    
      `,
      {
        contract,
        block,
      }
    )
  ).data.transactions.edges[0]?.node.id;
};

export const getContract = async (
  client: Arweave,
  contract: string
): Promise<StateInterface> => {
  const storage =
    typeof localStorage === "undefined"
      ? new localPorridge("./.cache.json")
      : localStorage;

  const latest = await latestInteraction(
    contract,
    (await client.network.getInfo()).height
  );
  const cache = JSON.parse(storage.getItem("smartweaveCache") || "{}");

  if (contract in cache) {
    if (cache[contract].latest === latest) {
      return cache[contract].state;
    }
  }

  const state = await readContract(client, contract);
  updateCache("smartweaveCache", contract, {
    latest,
    state,
  });
  return state;
};
