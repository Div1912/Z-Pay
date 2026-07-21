const fs = require('fs');
const path = require('path');

const replaceInFile = (filePath, regex, replacement) => {
  const content = fs.readFileSync(filePath, 'utf8');
  if (regex.test(content)) {
    fs.writeFileSync(filePath, content.replace(regex, replacement));
    console.log(`Updated ${filePath}`);
  }
};

function walk(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      // Fix explorer links
      replaceInFile(p, /https:\/\/stellar\.expert\/explorer\/testnet\/tx\/\$\{([a-zA-Z0-9_\.]+)\}/g, "https://stellar.expert/explorer/${process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet' ? 'public' : 'testnet'}/tx/${$1}");
      
      // Fix the base explorer link in history
      replaceInFile(p, /https:\/\/stellar\.expert\/explorer\/testnet/g, "https://stellar.expert/explorer/${process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet' ? 'public' : 'testnet'}");
      
      // Fix QR code receive network
      if (p.includes('receive\\page.tsx') || p.includes('receive/page.tsx')) {
        replaceInFile(p, /network: "stellar-testnet",/g, "network: process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet' ? 'stellar-mainnet' : 'stellar-testnet',");
      }
      
      // Fix random text
      if (p.includes('dashboard\\page.tsx') || p.includes('dashboard/page.tsx')) {
        replaceInFile(p, /testnet crypto/g, "crypto");
      }
      if (p.includes('settings\\page.tsx') || p.includes('settings/page.tsx')) {
        replaceInFile(p, /Stellar Testnet/g, "Stellar ${process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet' ? 'Mainnet' : 'Testnet'}");
      }
      if (p.includes('profile\\page.tsx') || p.includes('profile/page.tsx')) {
        replaceInFile(p, /Stellar Horizon Testnet\. Horizon version 2\.14\.0\. Node: HORIZON-TESTNET-PROD/g, "Stellar Horizon ${process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet' ? 'Mainnet' : 'Testnet'}.");
      }
      if (p.includes('merchant\\page.tsx') || p.includes('merchant/page.tsx')) {
        replaceInFile(p, />Testnet</g, ">{process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet' ? 'Mainnet' : 'Testnet'}<");
      }
      if (p.includes('split\\new\\page.tsx') || p.includes('split/new/page.tsx')) {
        replaceInFile(p, /\(Stellar Testnet\)/g, "(Stellar ${process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet' ? 'Mainnet' : 'Testnet'})");
      }
      if (p.includes('admin\\metrics\\page.tsx') || p.includes('admin/metrics/page.tsx')) {
        replaceInFile(p, /Stellar testnet/g, "Stellar ${process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet' ? 'mainnet' : 'testnet'}");
      }
    }
  }
}
walk('src/app/dashboard');
