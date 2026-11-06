import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WHITECHAIN_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

const PaymentStatus = ({ invoiceId, onPaymentComplete }) => {
  const [status, setStatus] = useState('pending');
  const [paidAmount, setPaidAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [permitSignature, setPermitSignature] = useState(null);

  // Mock invoice data for demo (replace with real contract call)
  const mockInvoiceData = {
    invoiceId: invoiceId || 'demo_invoice_123',
    totalAmount: 5000, // USDT
    paidAmount: 0,
    deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
    released: false,
    relayer: '0x0000000000000000000000000000000000000001',
    contractor: '0x0000000000000000000000000000000000000000',
    ensSubname: 'contractor001.dao.eth'
  };

  useEffect(() => {
    if (!invoiceId) return;

    setTotalAmount(mockInvoiceData.totalAmount);
  }, [invoiceId]);

  const generateMockPermit = async () => {
    // Generate mock EIP-3009 permit signature for demo
    const mockPermit = '0x' + Array.from({length: 130}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setPermitSignature(mockPermit);
    return mockPermit;
  };

  const handleGaslessPayment = async () => {
    if (!invoiceId) {
      setError('No invoice selected');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Generate permit signature for gasless payment
      const permit = await generateMockPermit();
      setPermitSignature(permit);

      // Simulate gasless payment via relayer
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      // Simulate successful payment
      const mockTxHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxHash(mockTxHash);
      setPaidAmount(mockInvoiceData.totalAmount);
      setStatus('paid');

      // Update mock data
      mockInvoiceData.paidAmount = mockInvoiceData.totalAmount;

      setLoading(false);

      // Notify completion
      setTimeout(() => {
        onPaymentComplete();
      }, 2000);

    } catch (err) {
      console.error('Payment error:', err);
      setError(`Payment failed: ${err.message}`);
      setLoading(false);
    }
  };

  const isExpired = () => {
    return Date.now() > mockInvoiceData.deadline;
  };

  return (
    <div className="payment-status">
      <h3>Payment Status</h3>

      <div className="invoice-info">
        <p>Invoice ID: <code>{mockInvoiceData.invoiceId}</code></p>
        <p>ENS Subname: <code>{mockInvoiceData.ensSubname}</code></p>
        <p>Relayer: <code>{mockInvoiceData.relayer.slice(0, 10)}...</code></p>
        <p>Contractor: <code>{mockInvoiceData.contractor.slice(0, 6)}...{mockInvoiceData.contractor.length - 4}</code></p>
      </div>

      <div className="payment-progress">
        <p>Total: {mockInvoiceData.totalAmount} USDT</p>
        <p>Paid: {mockInvoiceData.paidAmount} USDT</p>
        <p>Fee: {Math.floor(mockInvoiceData.totalAmount * 0.01)} USDT (1%)</p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(mockInvoiceData.paidAmount / mockInvoiceData.totalAmount) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="status-badge status-{status}">
        Status: {status.toUpperCase()}
      </div>

      {isExpired() && <p className="warning">Invoice has expired - payment window closed</p>}

      {error && <p className="error">{error}</p>}

      {txHash && (
        <p className="success">
          Payment confirmed: <code>{txHash.slice(0, 10)}...</code>
        </p>
      )}

      {permitSignature && (
        <details className="permit-details">
          <summary>View Permit Signature (EIP-3009)</summary>
          <code>{permitSignature.slice(0, 66)}...</code>
        </details>
      )}

      {status === 'pending' && !isExpired() && (
        <button
          onClick={handleGaslessPayment}
          disabled={loading}
          className="primary-btn"
        >
          {loading ? 'Processing Gasless Payment...' : 'Process Gasless Payment (EIP-3009)'}
        </button>
      )}

      {status === 'paid' && (
        <button onClick={() => onPaymentComplete()} className="secondary-btn">
          View Contractor Profile
        </button>
      )}
    </div>
  );
};

export default PaymentStatus;