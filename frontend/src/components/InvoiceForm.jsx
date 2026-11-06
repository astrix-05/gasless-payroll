import { useState } from 'react';
import { ethers } from 'ethers';

const USDT_ADDRESS = '0xcedfB56113143d55b2358b8CFbB0dEB5Ad2f55a7';

// Whitechain Payment contract placeholder (replace with actual deployed address after deployment)
const WHITECHAIN_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

const InvoiceForm = ({ onInvoiceCreated, contractorAddress, relayerAddress }) => {
  const [amount, setAmount] = useState('');
  const [daysValid, setDaysValid] = useState(30);
  const [ensSubname, setENSSubname] = useState('');
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateInvoice = async () => {
    const amountParsed = parseFloat(amount);
    const daysCount = parseInt(daysValid);

    // Basic validation
    if (!amountParsed || amountParsed <= 0) {
      setError('Amount must be positive');
      return;
    }

    if (!contractorAddress || contractorAddress === '0x0000000000000000000000000000000000000000') {
      setError('You must verify your identity first to create an invoice');
      return;
    }

    if (!relayerAddress || relayerAddress === '0x0000000000000000000000000000000000000000') {
      setError('No relayer configured for gasless payment');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate invoice creation
      // In production, this would call createInvoice on WhitechainPayment contract
      const simulatedInvoiceId = 'invoice_' + Date.now();

      // Mock transaction
      setTxHash('0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join(''));
      setSuccess(true);
      setLoading(false);

      // Notify parent of invoice creation
      onInvoiceCreated({
        invoiceId: simulatedInvoiceId,
        txHash: txHash,
        amount: amountParsed,
        daysValid: daysCount,
        ensSubname: ensSubname || `${contractorAddress.slice(-8)}.dao.eth`,
        relayer: relayerAddress
      });

      // Auto-advance to payment view after delay
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err) {
      console.error('Invoice creation error:', err);
      setError(`Failed to create invoice: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="invoice-form">
      <h3>Create Invoice</h3>

      {!contractorAddress || contractorAddress === '0x0000000000000000000000000000000000000000' ? (
        <p className="warning">First verify your identity to create an invoice.</p>
      ) : null}

      {error && <p className="error">{error}</p>}
      {success && <p className="success">Invoice created successfully!</p>}
      {txHash && (
        <p className="info">Transaction Hash: <code>{txHash.slice(0, 10)}...</code></p>
      )}

      <div className="form-group">
        <label>Amount (USD):</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in USD"
        />
      </div>

      <div className="form-group">
        <label>Validity Period (days):</label>
        <select value={daysValid} onChange={(e) => setDaysValid(e.target.value)}>
          <option value={7}>7 days</option>
          <option value={30}>30 days</option>
          <option value={90}>90 days</option>
          <option value={180}>180 days</option>
        </select>
      </div>

      <div className="form-group">
        <label>ENS Subname:</label>
        <input
          type="text"
          value={ensSubname}
          onChange={(e) => setENSSubname(e.target.value)}
          placeholder="contractor-identifier"
        />
      </div>

      <div className="form-group">
        <label>Relayer Address:</label>
        <input
          type="text"
          value={relayerAddress || '0x0000000000000000000000000000000000000001'}
          readOnly
        />
        <small>Relayer covers gas for gasless payment</small>
      </div>

      <button onClick={handleCreateInvoice} disabled={loading || !contractorAddress}>
        {loading ? 'Creating Invoice...' : 'Create Invoice'}
      </button>
    </div>
  );
};

export default InvoiceForm;