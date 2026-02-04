import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGetBalance, mockCreatePublicClient, mockHttp } = vi.hoisted(() => {
  const getBalance = vi.fn();
  const createPublicClient = vi.fn(() => ({
    getBalance,
  }));
  const http = vi.fn(() => ({}));

  return {
    mockGetBalance: getBalance,
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

import { getWalletBalance } from "../src/tools/balance";

describe("getWalletBalance", () => {
  beforeEach(() => {
    mockGetBalance.mockReset();
  });

  it("returns formatted ETH balance from wei", async () => {
    const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    mockGetBalance.mockResolvedValue(1_500_000_000_000_000_000n);

    const result = await getWalletBalance(address);

    expect(result).toBe("1.5");
    expect(mockGetBalance).toHaveBeenCalledWith({ address });
  });
});
