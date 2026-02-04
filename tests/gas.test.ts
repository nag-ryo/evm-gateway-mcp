import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGetGasPrice, mockCreatePublicClient, mockHttp } = vi.hoisted(() => {
  const getGasPrice = vi.fn();
  const createPublicClient = vi.fn(() => ({
    getGasPrice,
  }));
  const http = vi.fn(() => ({}));

  return {
    mockGetGasPrice: getGasPrice,
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

import { getGasPrice } from "../src/tools/gas";

describe("getGasPrice", () => {
  beforeEach(() => {
    mockGetGasPrice.mockReset();
  });

  it("returns LOW status when gas is below 20 gwei", async () => {
    mockGetGasPrice.mockResolvedValue(10_000_000_000n);

    const result = await getGasPrice();

    expect(result).toEqual({ price: "10", status: "LOW" });
  });

  it("returns HIGH status when gas is above 50 gwei", async () => {
    mockGetGasPrice.mockResolvedValue(60_000_000_000n);

    const result = await getGasPrice();

    expect(result).toEqual(
      expect.objectContaining({
        status: "HIGH",
      }),
    );
  });
});
