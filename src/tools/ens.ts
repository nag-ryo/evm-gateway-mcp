import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http(process.env.RPC_URL),
});

export async function resolveEns(input: string): Promise<string | null> {
  const value = input.trim();

  if (value.length === 0) {
    throw new Error("input is required");
  }

  if (value.startsWith("0x")) {
    return client.getEnsName({ address: value as `0x${string}` });
  }

  return client.getEnsAddress({ name: value });
}
