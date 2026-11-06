import { useState, useEffect } from 'react';
import WorldIDVerification from '../components/WorldIDVerification';
import InvoiceForm from '../components/InvoiceForm';
import PaymentStatus from '../components/PaymentStatus';
import ContributorProfile from '../components/ContributorProfile';
import MerchantDashboard from '../components/MerchantDashboard';

const HomePage = () => {
  const [isVerifiedContractor, setIsVerifiedContractor] = useState(false);
  const [contractorAddress, setContractorAddress] = useState('');
  const [currentInvoiceId, setCurrentInvoiceId] = useState(null);
  const [currentView, setCurrentView] = useState('verification'); // 'verification', 'invoice', 'payment', 'profile', 'merchant'
  const [relayerAddress, setRelayerAddress] = useState('0x0000000000000000000000000000000000000001'); // Demo relayer

  useEffect(() => {
    // Check for stored verification state
    const stored = sessionStorage.getItem('verified_contractors');
    if (stored) {
      const data = JSON.parse(stored);
      setIsVerifiedContractor(true);
      setContractorAddress(data.address);
      setCurrentView('profile');
    }
  }, []);

  const handleVerified = (contractorData) => {
    setIsVerifiedContractor(true);
    setContractorAddress(contractorData.address);
    sessionStorage.setItem('verified_contractors', JSON.stringify(contractorData));
    setCurrentView('profile');
  };

  const handleInvoiceCreated = (invoiceData) => {
    setCurrentInvoiceId(invoiceData.invoiceId);
    setCurrentView('payment');
  };

  const handlePaymentComplete = () => {
    setCurrentView('profile');
  };

  const handleMakeContractor = () => {
    setCurrentView('verification');
    sessionStorage.removeItem('verified_contractors');
    setIsVerifiedContractor(false);
    setContractorAddress('');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">GP</div>
          <div>
            <p className="eyebrow">Whitechain / payroll desk</p>
            <h1>Gasless payroll</h1>
          </div>
        </div>
        <div className="header-meta">
          <span className="network-status"><span aria-hidden="true">●</span> Sepolia testnet</span>
          <span className="header-caption">USDT settlement</span>
        </div>
        <nav className="app-nav" aria-label="Payroll workspace">
          <button
            className={currentView === 'profile' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('profile')}
            disabled={!isVerifiedContractor}
          >
            Profile
          </button>
          <button
            className={currentView === 'invoice' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('invoice')}
            disabled={!isVerifiedContractor}
          >
            New invoice
          </button>
          <button
            className={currentView === 'merchant' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('merchant')}
            disabled={!isVerifiedContractor}
          >
            Payments
          </button>
        </nav>
      </header>

      <div className="workspace-intro">
        <div>
          <p className="eyebrow">Contractor workspace</p>
          <h2>{currentView === 'verification' ? 'Start with a verified identity.' : 'Keep every payment moving.'}</h2>
        </div>
        <div className="workspace-summary">
          <span className={isVerifiedContractor ? 'summary-dot is-live' : 'summary-dot'} aria-hidden="true"></span>
          <span>{isVerifiedContractor ? 'Identity verified' : 'Verification required'}</span>
        </div>
      </div>

      <main className="workspace-main">
        {currentView === 'verification' && (
          <WorldIDVerification onVerified={handleVerified} />
        )}

        {currentView === 'invoice' && (
          <InvoiceForm
            onInvoiceCreated={handleInvoiceCreated}
            contractorAddress={contractorAddress}
            relayerAddress={relayerAddress}
          />
        )}

        {currentView === 'payment' && (
          <PaymentStatus
            invoiceId={currentInvoiceId}
            onPaymentComplete={handlePaymentComplete}
          />
        )}

        {currentView === 'profile' && (
          <ContributorProfile contractorAddress={contractorAddress} />
        )}

        {currentView === 'merchant' && (
          <MerchantDashboard onPaymentComplete={handlePaymentComplete} />
        )}

        {!isVerifiedContractor && currentView !== 'verification' && (
          <div className="not-verified">
            <p>Please verify your identity to continue.</p>
            <button onClick={() => setCurrentView('verification')}>Verify Now</button>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p><strong>Gasless payroll</strong> <span>Built on World ID, Whitechain, and ENSv2</span></p>
        <span className="footer-status">Demo environment / 2026</span>
      </footer>
    </div>
  );
};

export default HomePage;