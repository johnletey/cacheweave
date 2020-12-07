import { run } from "ar-gql";
import Arweave from "arweave";
import { StateInterface } from "community-js/lib/faces";
import { readContract } from "smartweave";
import { updateCache } from "./utils";

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
  const isBrowser: boolean = typeof window !== "undefined";

  if (isBrowser) {
    const latest = await latestInteraction(
      contract,
      (await client.network.getInfo()).height
    );
    const cache = JSON.parse(localStorage.getItem("smartweaveCache") || "{}");

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
  } else {
    return await readContract(client, contract);
  }
};
