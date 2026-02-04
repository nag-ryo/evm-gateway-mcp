import { afterEach, describe, expect, it, vi } from "vitest";

import { getContractAbi } from "../src/tools/contract";

describe("getContractAbi", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches contract ABI from Etherscan API and returns parsed ABI", async () => {
    const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    const responsePayload = {
      status: "1",
      result:
        '[{"inputs":[],"name":"totalSupply","type":"function"}]',
    };

    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(responsePayload),
    } as unknown as Response);

    const result = await getContractAbi(address);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("https://api.etherscan.io/api?"),
    );
    expect(result).toEqual([
      { inputs: [], name: "totalSupply", type: "function" },
    ]);
  });
});
