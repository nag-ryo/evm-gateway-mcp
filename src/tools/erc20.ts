import { createPublicClient, formatUnits, http, parseAbi } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http(process.env.RPC_URL),
});

const erc20Abi = parseAbi([
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
]);

export async function getErc20Balance(
  walletAddress: string,
  tokenAddress: string,
): Promise<string> {
  const wallet = walletAddress.trim();
  const token = tokenAddress.trim();

  if (wallet.length === 0) {
    throw new Error("walletAddress is required");
  }

  if (token.length === 0) {
    throw new Error("tokenAddress is required");
  }

  const decimals = await client.readContract({
    address: token as `0x${string}`,
    abi: erc20Abi,
    functionName: "decimals",
  });

  const balance = await client.readContract({
    address: token as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [wallet as `0x${string}`],
  });

  return formatUnits(balance, decimals);
}
