import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { verifyWithWorldID, registerENSv2Subname, getVerifiedContractorAddress } from '../utils/worldid';
import { registerSubname, getContractorProfile } from '../utils/ensv2';

const WorldIDVerification = ({ onVerified }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [verificationDetails, setVerificationDetails] = useState(null);
  const [registeringENS, setRegisteringENS] = useState(false);
  const [ensStatus, setENSStatus] = useState(null);
  const [error, setError] = useState(null);
  const [altPath, setAltPath] = useState(null); // 'denied' | 'expired' | 'cancelled'
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    setError(null);

    if (!window.ethereum) {
      setError('No wallet detected. Install MetaMask or another EVM wallet to continue.');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setWalletAddress(accounts[0] || '');
    } catch (err) {
      setError(`Wallet connection failed: ${err.message}`);
    }
  };

  useEffect(() => {
    // Check for stored verification state from session
    const stored = sessionStorage.getItem('verified_contractors');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setIsVerified(true);
        setVerificationDetails(data);
      } catch (e) {
        // Invalid session data
      }
    }
  }, []);

  const handleVerification = async () => {
    setError(null);
    setAltPath(null);
    setVerificationDetails(null);
    setRegisteringENS(true);
    setENSStatus(null);

    try {
      if (!walletAddress) {
        throw new Error('Connect your wallet before verifying your contractor identity');
      }

      // Step 1: Verify with World IDKit
      const result = await verifyWithWorldID();

      if (!result.isVerified) {
        // Alternative path: User denied verification
        setAltPath('denied');
        setENSStatus('rejected');
        return;
      }

      // Use the address returned by the verification itself (NOT the session,
      // which is only written later). Fall back to a generated address.
      const contractorAddress = walletAddress;
      const nullifierHash = result.nullifierHash;

      if (!contractorAddress || contractorAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error('Invalid contractor address from verification');
      }

      // Step 2: Register ENSv2 subname
      const subname = `${contractorAddress.toString().slice(-4)}.dao.eth`;

      setENSStatus('registering');

      // Register via ENSv2 mock/simulator
      await registerSubname(subname, contractorAddress);

      // Record in session storage
      const verifiedData = {
        address: contractorAddress,
        subname: subname,
        nullifierHash: nullifierHash,
        credentials: result.credential,
        timestamp: Date.now()
      };

      setIsVerified(true);
      setVerificationDetails(verifiedData);
      setENSStatus('registered');

      sessionStorage.setItem('verified_contractors', JSON.stringify(verifiedData));

      if (onVerified) {
        onVerified({
          address: contractorAddress,
          subname,
          credentials: result.credential
        });
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(`Verification failed: ${err.message}`);
      setENSStatus('error');
    } finally {
      setRegisteringENS(false);
    }
  };

  const handleAlternativePath = (path) => {
    setError(null);
    setAltPath(path);
    setENSStatus('rejected');

    // Store alternative path for demo
    sessionStorage.setItem('alt_path', JSON.stringify({ path, timestamp: Date.now() }));
  };

  return (
    <div className="world-id-verification">
      {isVerified ? (
        <div className="verified-state">
          <div className="status-badge status-verified">✅ Verified</div>
          <h3>Verified as Contractor</h3>
          <p>You have completed World ID verification.</p>
          <div className="details">
            <p><strong>Address:</strong> <code>{verificationDetails?.address}</code></p>
            <p><strong>ENS Subname:</strong> <code>{verificationDetails?.subname}</code></p>
            <p><strong>Verification:</strong> World ID {verificationDetails?.credentials?.credential_type || 'Proof of Human'}</p>
          </div>
          <button className="secondary-btn" onClick={() => {
            sessionStorage.removeItem('verified_contractors');
            setIsVerified(false);
            setVerificationDetails(null);
            setENSStatus(null);
          }}>
            Sign Out
          </button>
        </div>
      ) : (
        <div className="verification-gate">
          <div className="status-badge status-pending">⏳ Awaiting Verification</div>
          <h3>Verify Your Identity</h3>
          <p>
            To create invoices and receive gasless payments, verify you're a real human via World ID.
            This ensures Sybil-resistant contractor onboarding.
          </p>

          <div className="wallet-connection">
            <div>
              <span className="eyebrow">Step 1 / wallet</span>
              <strong>{walletAddress ? 'Wallet connected' : 'Connect a payout wallet'}</strong>
              {walletAddress && <code>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</code>}
            </div>
            <button onClick={connectWallet} disabled={registeringENS} className="secondary-btn">
              {walletAddress ? 'Change wallet' : 'Connect wallet'}
            </button>
          </div>

          <div className="verification-options">
            <button
              onClick={handleVerification}
              disabled={registeringENS || !walletAddress}
              className="primary-btn"
            >
              {registeringENS ? 'Verifying...' : 'Verify with World ID'}
            </button>
            <button
              onClick={() => handleAlternativePath('denied')}
              className="secondary-btn"
            >
              Alternative Path: Denied
            </button>
          </div>

          {altPath && (
            <div className={`alt-path alt-path-${altPath}`}>
              <h4>Alternative Path: {altPath.charAt(0).toUpperCase() + altPath.slice(1)}</h4>
              <p>
                {altPath === 'denied'
                  ? 'Verification was denied. You can still browse invoices but cannot create new ones.'
                  : altPath === 'expired'
                  ? 'Verification request expired. Please try again.'
                  : 'Verification cancelled by user.'}
              </p>
              <button onClick={() => setAltPath(null)}>Try Again</button>
            </div>
          )}

          <p className="demo-note">
            <small>
              Demo Note: World IDKit uses simulator/testnet proofs. This is a testnet demo only.
              Production requires verified human credentials.
            </small>
          </p>
        </div>
      )}
    </div>
  );
};

export default WorldIDVerification;