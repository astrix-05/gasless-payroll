import { useState, useEffect } from 'react';
import { verifyWithWorldID, registerENSv2Subname } from '../utils/worldid';
import { registerSubname, getContractorProfile } from '../utils/ensv2';

const WorldIDVerification = ({ onVerified }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [verificationDetails, setVerificationDetails] = useState(null);
  const [registeringENS, setRegisteringENS] = useState(false);
  const [ensStatus, setENSStatus] = useState(null);
  const [error, setError] = useState(null);
  const [altPath, setAltPath] = useState(null); // 'denied' | 'expired' | 'cancelled'

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
      // Step 1: Verify with World IDKit (real API or mock fallback)
      const result = await verifyWithWorldID();

      if (!result.isVerified) {
        // Alternative path: User denied verification
        setAltPath('denied');
        setENSStatus('rejected');
        return;
      }

      // Use the contractorAddress returned directly from verification
      // This fixes the bug where getVerifiedContractorAddress() was reading
      // stale session data before verification data was written
      const contractorAddress = result.contractorAddress;

      if (!contractorAddress || contractorAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error('Invalid contractor address from verification');
      }

      const nullifierHash = result.nullifierHash;

      // Step 2: Register ENSv2 subname
      const subname = `${contractorAddress.toString().slice(-4)}.dao.eth`;

      setENSStatus('registering');

      // Register via ENSv2 (simulated for demo; real integration in task #9)
      await registerSubname(subname, contractorAddress, nullifierHash);

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

          <div className="verification-options">
            <button
              onClick={handleVerification}
              disabled={registeringENS}
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