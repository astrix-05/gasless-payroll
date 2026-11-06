import { ethers } from 'ethers';

// ENSv2 Contract Addresses (Sepolia testnet)
const ENSV2_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_ENSV2_REGISTRY || '0x00000000000C2E074eC69A0dF209de8E5286A7F';

// ENSv2 ABI (minimal, for demo)
const ENSV2_ABI = [
  'function registerSubname(bytes32 subname, address owner, address resolver, uint256 expiry, uint256 dataExpiry, uint256 permissions) external returns (bytes32)',
  'function getSubname(bytes32 name) external view returns (bytes32, address, address, uint256, uint256, uint256)',
  'function getTextRecord(bytes32 name, string key) external view returns (string)',
  'function isSubnameRegistered(bytes32 subname) external view returns (bool)'
];

const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

// Register a subname under the parent namespace
export const registerSubname = async (subname, ownerAddress) => {
  if (typeof window === 'undefined' || !window.ethereum) {
    // SSR fallback: simulate registration
    return { status: 'simulated', subname };
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const ensv2Registry = new ethers.Contract(ENSV2_REGISTRY_ADDRESS, ENSV2_ABI, provider);
    const signer = await provider.getSigner();
    const ensv2WithSigner = ensv2Registry.connect(signer);

    // Encode subname as bytes32
    const subnameBytes = ethers.zeroPadValue(ethers.toUtf8Bytes(subname), 32);

    const tx = await ensv2WithSigner.registerSubname(
      subnameBytes,
      ownerAddress,
      ownerAddress,
      ONE_YEAR_SECONDS, // expiry (1 year)
      0,                // data expiry
      0                 // permissions
    );

    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.warn('ENSv2 registration simulated (contract not deployed yet):', error.message);
    return { status: 'simulated', subname, error: error.message };
  }
};

// Resolve subname and fetch permissioned text records
export const resolveSubname = async (subname) => {
  // Demo fallback data (contract not yet deployed)
  return {
    paymentHistory: '3 invoices | $15,000 USDT total | avg payment time 12 min',
    reputation: 'Excellent - 100% on-time payment',
    lastPayment: '2026-11-04'
  };
};

// Get contractor profile (subname + text records)
export const getContractorProfile = async (contractorAddress) => {
  const subname = `${contractorAddress.slice(-4)}.dao.eth`;
  const records = await resolveSubname(subname);

  return {
    contractor: contractorAddress,
    subname: subname,
    paymentHistory: records.paymentHistory,
    reputation: records.reputation,
    lastPayment: records.lastPayment,
    joinDate: '2026-11-01',
    verified: true
  };
};

// Check if subname is registered
export const isSubnameRegistered = async (subname) => {
  if (typeof window === 'undefined' || !window.ethereum) {
    return false;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const ensv2Registry = new ethers.Contract(ENSV2_REGISTRY_ADDRESS, ENSV2_ABI, provider);
    const subnameBytes = ethers.zeroPadValue(ethers.toUtf8Bytes(subname), 32);
    return await ensv2Registry.isSubnameRegistered(subnameBytes);
  } catch (error) {
    console.warn('ENSv2 check simulated:', error.message);
    return false;
  }
};
