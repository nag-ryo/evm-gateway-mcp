const ETHERSCAN_API_URL = "https://api.etherscan.io/api";

interface EtherscanAbiResponse {
  status: string;
  result: string;
}

export async function getContractAbi(address: string): Promise<unknown> {
  const value = address.trim();

  if (value.length === 0) {
    throw new Error("address is required");
  }

  const searchParams = new URLSearchParams({
    module: "contract",
    action: "getabi",
    address: value,
    apikey: process.env.ETHERSCAN_API_KEY ?? "",
  });

  const response = await fetch(`${ETHERSCAN_API_URL}?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`etherscan request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as EtherscanAbiResponse;

  if (payload.status !== "1") {
    throw new Error(`etherscan error: ${payload.result}`);
  }

  return JSON.parse(payload.result);
}
