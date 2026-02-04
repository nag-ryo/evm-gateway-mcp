import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGetEnsAddress, mockGetEnsName, mockCreatePublicClient, mockHttp } =
  vi.hoisted(() => {
    const getEnsAddress = vi.fn();
    const getEnsName = vi.fn();
    const createPublicClient = vi.fn(() => ({
      getEnsAddress,
      getEnsName,
    }));
    const http = vi.fn(() => ({}));

    return {
      mockGetEnsAddress: getEnsAddress,
      mockGetEnsName: getEnsName,
      mockCreatePublicClient: createPublicClient,
      mockHttp: http,
    };
  });

vi.mock("viem", () => ({
  createPublicClient: mockCreatePublicClient,
  http: mockHttp,
}));

vi.mock("viem/chains", () => ({
  mainnet: { id: 1, name: "Ethereum" },
}));

import { resolveEns } from "../src/tools/ens";

describe("resolveEns", () => {
  beforeEach(() => {
    mockGetEnsAddress.mockReset();
    mockGetEnsName.mockReset();
  });

  it("returns mocked address for ENS name input", async () => {
    const expectedAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    mockGetEnsAddress.mockResolvedValue(expectedAddress);

    const result = await resolveEns("vitalik.eth");

    expect(result).toBe(expectedAddress);
    expect(mockGetEnsAddress).toHaveBeenCalledWith({ name: "vitalik.eth" });
    expect(mockGetEnsName).not.toHaveBeenCalled();
  });

  it("returns mocked ENS name for address input", async () => {
    const inputAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    const expectedName = "vitalik.eth";
    mockGetEnsName.mockResolvedValue(expectedName);

    const result = await resolveEns(inputAddress);

    expect(result).toBe(expectedName);
    expect(mockGetEnsName).toHaveBeenCalledWith({ address: inputAddress });
    expect(mockGetEnsAddress).not.toHaveBeenCalled();
  });
});
