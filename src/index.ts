import "dotenv/config";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { getWalletBalance } from "./tools/balance.js";
import { getContractAbi } from "./tools/contract.js";
import { resolveEns } from "./tools/ens.js";
import { getErc20Balance } from "./tools/erc20.js";
import { getGasPrice } from "./tools/gas.js";

const server = new McpServer({
  name: "evm-gateway-mcp",
  version: "1.0.0",
});

server.tool(
  "resolve_ens",
  "Resolve an ENS name to an address, or reverse-resolve an address to an ENS name.",
  {
    input: z.string(),
  },
  async ({ input }) => {
    const result = await resolveEns(input);

    return {
      content: [
        {
          type: "text",
          text: result ?? "No ENS result found",
        },
      ],
    };
  },
);

server.tool(
  "get_gas_price",
  "Get the current gas price and network congestion status.",
  {
    chainId: z.number().optional(),
  },
  async ({ chainId }) => {
    void chainId;

    const result = await getGasPrice();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result),
        },
      ],
    };
  },
);

server.tool(
  "get_wallet_balance",
  "Get the native token balance (ETH) of a specific address.",
  {
    address: z.string(),
  },
  async ({ address }) => {
    const balance = await getWalletBalance(address);

    return {
      content: [
        {
          type: "text",
          text: balance,
        },
      ],
    };
  },
);

server.tool(
  "get_erc20_balance",
  "Get the balance of a specific ERC-20 token for a wallet.",
  {
    walletAddress: z.string(),
    tokenAddress: z.string(),
  },
  async ({ walletAddress, tokenAddress }) => {
    const balance = await getErc20Balance(walletAddress, tokenAddress);

    return {
      content: [
        {
          type: "text",
          text: balance,
        },
      ],
    };
  },
);

server.tool(
  "get_contract_abi",
  "Fetch the ABI of a smart contract from Etherscan.",
  {
    address: z.string(),
  },
  async ({ address }) => {
    const abi = await getContractAbi(address);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(abi),
        },
      ],
    };
  },
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error: unknown) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
});
