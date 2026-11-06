// World ID verification utilities for the Gasless Payroll demo
// In production this would integrate with @worldcoin/idkit React component
// For hackathon demo, we simulate the verification flow to demonstrate the gate

// Generate a mock nullifier hash (32 bytes, hex)
const generateMockNullifier = () => {
  const hex = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += hex[Math.floor(Math.random() * 16)];
  }
  return hash;
};

// Generate a mock contractor address (looks like an Ethereum address)
const generateMockContractorAddress = () => {
  const hex = '0123456789abcdef';
  let addr = '0x';
  for (let i = 0; i < 40; i++) {
    addr += hex[Math.floor(Math.random() * 16)];
  }
  return addr;
};

// Simulate World ID verification (Proof of Human / Passport / Selfie Check)
export const verifyWithWorldID = async (mode = 'mock') => {
  // In production, this calls the World ID API
  // For demo: simulate success with realistic-looking data
  await new Promise(resolve => setTimeout(resolve, 1200)); // Network delay

  const nullifierHash = generateMockNullifier();
  const contractorAddress = generateMockContractorAddress();

  return {
    isVerified: true,
    credential: {
      credential_type: 'Proof of Human',
      verification_level: 'orb',
      nullifier_hash: nullifierHash
    },
    nullifierHash: nullifierHash,
    contractorAddress: contractorAddress,
    timestamp: Date.now()
  };
};

// Simulate the alternative rejection path (denied/expired/cancelled)
export const simulateVerificationFailure = async (failureType = 'denied') => {
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    isVerified: false,
    failureType: failureType,
    message: {
      denied: 'User declined World ID verification',
      expired: 'Verification request expired (5 min timeout)',
      cancelled: 'User cancelled the verification flow'
    }[failureType]
  };
};

// Helper: register ENSv2 subname
export const registerENSv2Subname = async (subname, nullifierHash) => {
  return {
    subname: subname,
    nullifierHash: nullifierHash,
    status: 'registered'
  };
};

// Check if user has verified identity (from sessionStorage)
export const isUserVerified = () => {
  if (typeof window === 'undefined') return false;
  return !!sessionStorage.getItem('verified_contractors');
};

// Get contractor address from stored session (or generate a fresh mock)
export const getVerifiedContractorAddress = () => {
  if (typeof window === 'undefined') return '0x0000000000000000000000000000000000000000';
  const stored = sessionStorage.getItem('verified_contractors');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      return data.address || generateMockContractorAddress();
    } catch {
      return generateMockContractorAddress();
    }
  }
  return '0x0000000000000000000000000000000000000000';
};
