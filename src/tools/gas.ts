import { createPublicClient, formatGwei, http } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http(process.env.RPC_URL),
});

export type GasStatus = "LOW" | "NORMAL" | "HIGH";

export interface GasPriceResult {
  price: string;
  status: GasStatus;
}

export async function getGasPrice(): Promise<GasPriceResult> {
  const gasPriceWei = await client.getGasPrice();
  const price = formatGwei(gasPriceWei);
  const gwei = Number(price);

  const status: GasStatus = gwei < 20 ? "LOW" : gwei > 50 ? "HIGH" : "NORMAL";

  return { price, status };
}
