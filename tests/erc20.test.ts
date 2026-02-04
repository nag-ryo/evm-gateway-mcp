import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockReadContract, mockCreatePublicClient, mockHttp } = vi.hoisted(() => {
  const readContract = vi.fn();
  const createPublicClient = vi.fn(() => ({
    readContract,
  }));
  const http = vi.fn(() => ({}));

  return {
    mockReadContract: readContract,
    mockCreatePublicClient: createPublicClient,
    mockHttp: http,
  };
});

vi.mock("viem", async () => {
  const actual = await vi.importActual<typeof import("viem")>("viem");

  return {
    ...actual,
    createPublicClient: mockCreatePublicClient,
    http: mockHttp,
  };
});

vi.mock("viem/chains", () => ({
  mainnet: { id: 1, name: "Ethereum" },
}));

import { getErc20Balance } from "../src/tools/erc20";

describe("getErc20Balance", () => {
  beforeEach(() => {
    mockReadContract.mockReset();
  });

  it("returns formatted ERC-20 balance for USDC-like token decimals", async () => {
    const walletAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    const tokenAddress = "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

    mockReadContract.mockResolvedValueOnce(6).mockResolvedValueOnce(1_000_000n);

    const result = await getErc20Balance(walletAddress, tokenAddress);

    expect(result).toBe("1");
    expect(mockReadContract).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        address: tokenAddress,
        functionName: "decimals",
      }),
    );
    expect(mockReadContract).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        address: tokenAddress,
        functionName: "balanceOf",
        args: [walletAddress],
      }),
    );
  });
});
