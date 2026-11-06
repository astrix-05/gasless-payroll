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
  const [currentView, setCurrentView] = useState('verification'); // 'verification', 'invoice', 'payment', 'profile', 'merchant', 'info'
  const [relayerAddress, setRelayerAddress] = useState('0x0000000000000000000000000000000000000001'); // Demo relayer
  const [theme, setTheme] = useState('light');

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

  useEffect(() => {
    const storedTheme = localStorage.getItem('payroll_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const nextTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('payroll_theme', nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  };

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
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span aria-hidden="true">{theme === 'dark' ? '☼' : '☾'}</span>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
        <nav className="app-nav" aria-label="Payroll workspace">
          <button
            className={currentView === 'info' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('info')}
          >
            How it works
          </button>
          <button
            className={currentView === 'profile' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('profile')}
          >
            Profile
          </button>
          <button
            className={currentView === 'invoice' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('invoice')}
          >
            New invoice
          </button>
          <button
            className={currentView === 'merchant' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('merchant')}
          >
            Payments
          </button>
        </nav>
      </header>

      <div className="workspace-intro">
        <div>
          <p className="eyebrow">Contractor workspace</p>
          <h2>{currentView === 'verification' ? 'Start with a verified identity.' : currentView === 'info' ? 'The payment flow, explained.' : 'Keep every payment moving.'}</h2>
        </div>
        <div className="workspace-summary">
          <span className={isVerifiedContractor ? 'summary-dot is-live' : 'summary-dot'} aria-hidden="true"></span>
          <span>{isVerifiedContractor ? 'Identity verified' : 'Verification required'}</span>
        </div>
      </div>

      <main className="workspace-main">
        {currentView === 'info' && (
          <section className="info-panel" aria-labelledby="info-title">
            <div className="info-panel-header">
              <div>
                <p className="eyebrow">A simple path to settlement</p>
                <h3 id="info-title">Payroll without the payment friction.</h3>
              </div>
              <span className="info-chip">World ID + Whitechain + ENSv2</span>
            </div>

            <p className="info-lede">
              Gasless Stablecoin Payroll helps contributors send invoices and receive USDT without managing transaction gas. Identity, payment authorization, and contributor history stay connected in one workflow.
            </p>

            <div className="workflow-grid">
              <article className="workflow-step">
                <span className="step-number">01</span>
                <h4>Verify once</h4>
                <p>World ID confirms that a real person is behind the contractor account before payment features are unlocked.</p>
              </article>
              <article className="workflow-step">
                <span className="step-number">02</span>
                <h4>Create an invoice</h4>
                <p>Set the USDT amount, payment window, and ENS subname that should travel with the invoice.</p>
              </article>
              <article className="workflow-step">
                <span className="step-number">03</span>
                <h4>Approve gaslessly</h4>
                <p>The merchant signs the payment permit and a relayer submits the transaction, covering the network gas.</p>
              </article>
              <article className="workflow-step">
                <span className="step-number">04</span>
                <h4>Build reputation</h4>
                <p>ENSv2 keeps the contributor identity and payment history available for future invoices and dApps.</p>
              </article>
            </div>

            <div className="info-bottom-grid">
              <div>
                <p className="eyebrow">What it is</p>
                <h4>A shared payment desk for independent work.</h4>
                <p>Contractors get a verifiable identity and predictable settlement. Merchants get a clear invoice queue and a gasless payment path.</p>
              </div>
              <div>
                <p className="eyebrow">Why it matters</p>
                <h4>Less setup. More trust.</h4>
                <p>World ID reduces duplicate identities, Whitechain handles settlement, and ENSv2 gives payment history a portable home.</p>
              </div>
            </div>

            <div className="relayer-explainer">
              <div>
                <p className="eyebrow">How the relayer earns</p>
                <h4>Gasless for the user, sustainable for the service.</h4>
                <p>The relayer submits the authorized transaction and pays the network gas first. The service can charge a small, transparent fee to the merchant, such as 1% of the payment, to cover gas and operate profitably.</p>
              </div>
              <div className="relayer-example" aria-label="Relayer fee example">
                <span>Example payment</span>
                <strong>$5,000 USDT</strong>
                <span>1% service fee = $50</span>
                <span>Network gas is paid by the relayer</span>
              </div>
            </div>

            <p className="info-disclaimer">This interface is a testnet demo. The current relayer address and payment flow are simulated; production would use a funded relayer wallet and an on-chain fee mechanism.</p>
          </section>
        )}

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

        {!isVerifiedContractor && currentView !== 'verification' && currentView !== 'info' && (
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