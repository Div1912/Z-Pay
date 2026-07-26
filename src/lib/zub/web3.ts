export const ZUB_TREASURY_ADDRESS = '0x763c1FbEA2697959E41EaEAFED5aBB07f00C7d55';

export const EVM_NETWORKS: Record<string, any> = {
  base: {
    chainId: 8453,
    chainIdHex: '0x2105',
    name: 'Base Mainnet',
    rpc: 'https://mainnet.base.org',
    usdcAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
  },
  polygon: {
    chainId: 137,
    chainIdHex: '0x89',
    name: 'Polygon Mainnet',
    rpc: 'https://polygon-rpc.com',
    usdcAddress: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    decimals: 6,
  },
  arbitrum: {
    chainId: 42161,
    chainIdHex: '0xA4B1',
    name: 'Arbitrum One',
    rpc: 'https://arb1.arbitrum.io/rpc',
    usdcAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    decimals: 6,
  }
};

export const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];
