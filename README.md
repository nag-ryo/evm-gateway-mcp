# evm-gateway-mcp

> Give your AI Agent the eyes to see the Ethereum Blockchain.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-000000)](https://modelcontextprotocol.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tests: Passing](https://img.shields.io/badge/Tests-Passing-brightgreen.svg)](#development--testing)

`evm-gateway-mcp` is a **Model Context Protocol (MCP)** server that lets AI agents (such as Claude Desktop) interact with EVM-compatible blockchains.

It gives agents practical blockchain awareness by exposing tools for ENS resolution, gas tracking, wallet/token balances, and smart contract ABI retrieval from Etherscan.

## ✨ Key Features

- **ENS Resolution**: Resolve `.eth` names to addresses and perform reverse lookup from address to ENS.
- **Gas Tracker**: Read current gas price and classify network conditions (`LOW` / `NORMAL` / `HIGH`).
- **Portfolio Tracking**: Fetch native ETH balances and ERC-20 token balances.
- **Smart Contract Analysis**: Pull verified contract ABIs directly from Etherscan.

## 🚀 Quick Start

### Prerequisites

- Node.js `v20+`
- An Etherscan API key
- An Ethereum RPC endpoint URL

### Installation

```bash
npm install
npm run build
```

### Configuration

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
# .env
ETHERSCAN_API_KEY=your_etherscan_api_key
RPC_URL=https://mainnet.infura.io/v3/your_project_id
```

## 🔌 Usage with Claude Desktop

Build once, then point Claude Desktop to the compiled server entry:

```json
{
  "mcpServers": {
    "evm-gateway-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/evm-gateway-mcp/dist/index.js"],
      "env": {
        "ETHERSCAN_API_KEY": "your_etherscan_api_key",
        "RPC_URL": "https://mainnet.infura.io/v3/your_project_id"
      }
    }
  }
}
```

Use this in your local `claude_desktop_config.json`.

## 🛡️ Development & Testing

This project is built with a **TDD (Test Driven Development)** workflow.
Unit tests are fully mocked (no live RPC or Etherscan calls), so they run offline and deterministically.

```bash
npm test
```

## Tech Stack

- **TypeScript**
- **viem**
- **@modelcontextprotocol/sdk**
- **Vitest**

