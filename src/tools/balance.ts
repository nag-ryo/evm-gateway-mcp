import { createPublicClient, formatEther, http } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http(process.env.RPC_URL),
});

export async function getWalletBalance(address: string): Promise<string> {
  const value = address.trim();

  if (value.length === 0) {
    throw new Error("address is required");
  }

  const balanceWei = await client.getBalance({ address: value as `0x${string}` });

  return formatEther(balanceWei);
}
