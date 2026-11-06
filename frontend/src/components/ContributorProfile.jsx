import { useState, useEffect } from 'react';
import { getContractorProfile } from '../utils/ensv2';

const ContributorProfile = ({ contractorAddress }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [demoData, setDemoData] = useState(null);

  // Mock ENSv2 data for demo (replace with real contract call)
  const mockProfileData = {
    contractor: contractorAddress || '0x0000000000000000000000000000000000000000',
    subname: 'contractor001.dao.eth',
    paymentHistory: 'Paid 3 invoices | Total $15,000 USDT | Avg. payment time: 12 min',
    reputation: 'Excellent — 100% on-time payment',
    lastPayment: '2024-11-04 14:32 UTC',
    joinDate: '2024-11-01',
    verified: true
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!contractorAddress || contractorAddress === '0x0000000000000000000000000000000000000000') {
        setDemoData(mockProfileData);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const profileData = await getContractorProfile(contractorAddress);
        setProfile(profileData);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile — using demo data');
        setDemoData(mockProfileData);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [contractorAddress]);

  const activeProfile = profile || demoData;

  if (loading) return (
    <div className="profile-loading">
      <div className="spinner"></div>
      <p>Loading contributor profile...</p>
    </div>
  );

  if (error) return (
    <div className="profile-error">
      <p className="error">{error}</p>
      <p>Showing demo data:</p>
    </div>
  ];

  return (
    <div className="contributor-profile">
      <h3>📋 Contributor Profile</h3>

      <div className="profile-card">
        <div className="profile-header">
          <div className="identity-badge">
            <span className="status-indicator verified" aria-label="Verified">
              ●
            </span>
            <span>{activeProfile.contractor}</span>
          </div>

          <div className="profile-details">
            <div className="detail-row">
              <label>ENS Subname:</label>
              <span className="ens-name">📛 {activeProfile.subname}</span>
            </div>
            <div className="detail-row">
              <label>Status:</label>
              <span className="status-badge status-verified">✅ Yes</span>
            </div>
            <div className="detail-row">
              <label>Payment History:</label>
              <span className="reputation-badge">{activeProfile.reputation}</span>
            </div>
            <div className="detail-row">
              <label>Last Payment:</label>
              <span>{activeProfile.lastPayment}</span>
            </div>
            <div className="detail-row">
              <label>Join Date:</label>
              <span>{activeProfile.joinDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributorProfile;