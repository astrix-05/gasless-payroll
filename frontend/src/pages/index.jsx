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
      <header>
        <h1>Gasless Stablecoin Payroll</h1>
        <nav>
          <button
            onClick={() => setCurrentView('profile')}
            disabled={!isVerifiedContractor}
          >
            My Profile
          </button>
          <button
            onClick={() => setCurrentView('invoice')}
            disabled={!isVerifiedContractor}
          >
            Create Invoice
          </button>
          <button
            onClick={() => setCurrentView('merchant')}
            disabled={!isVerifiedContractor}
          >
            Merchant Dashboard
          </button>
        </nav>
      </header>

      <main>
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

      <footer>
        <p>Powered by World ID + Whitechain + ENSv2</p>
      </footer>
    </div>
  );
};

export default HomePage;