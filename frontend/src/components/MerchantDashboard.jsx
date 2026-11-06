import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WHITECHAIN_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

const MerchantDashboard = ({ onPaymentComplete }) => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // Mock invoice data for demo
  const mockInvoices = [
    {
      id: 'inv_001',
      amount: 5000,
      status: 'pending',
      contractor: '0x0000000000000000000000000000000000000001',
      ensSubname: 'contractor001.dao.eth',
      createdAt: '2024-11-04T14:30:00Z'
    },
    {
      id: 'inv_002',
      amount: 10000,
      status: 'paid',
      contractor: '0x0000000000000000000000000000000000000001',
      ensSubname: 'contractor002.dao.eth',
      createdAt: '2024-11-03T09:15:00Z'
    },
    {
      id: 'inv_003',
      amount: 2500,
      status: 'pending',
      contractor: '0x000000000000000000000000000000000000002',
      ensSubname: 'contractor003.dao.eth',
      createdAt: '2024-11-03T11:45:00Z'
    }
  ];

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleProcessPayment = async (invoiceId) => {
    try {
      setProcessing(true);
      setError('');

      // Simulate gasless payment via EIP-3009
      const mockPermit = '0x' + Array.from({length: 130}, () => Math.floor(Math.random() * 16).toString(16)).join('');

      // Simulate successful payment
      setSelectedInvoice(selectedInvoice);
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSelectedInvoice(null);
      setProcessing(false);
      onPaymentComplete();
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Check your connection.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="merchant-dashboard">
      <h3>Merchant Dashboard</h3>
      <p>Manage your invoices and payments.</p>

      <div className="invoice-list">
        {mockInvoices.length > 0 ? (
          <div className="invoice-list">
            {mockInvoices.map(invoice => (
              <div key={invoice.id} className="invoice-item">
                <div className="invoice-meta">
                  <p>Contractor: {invoice.contractor.slice(0, 6)}...{invoice.contractor.length - 4}</p>
                  <p>Subname: <code>{invoice.ensSubname}</code></p>
                  <p>Amount: {invoice.amount} USDT</p>
                  <p>Status: {invoice.status}</p>
                  <p>Created: {new Date(invoice.createdAt).toLocaleString()}</p>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={() => setSelectedInvoice(invoice)}
                    className="btn btn-primary"
                    disabled={processing}
                  >
                    Process Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>

      {error && <p className="error">{error}</p>}

      {selectedInvoice && (
        <div className="selected-invoice">
          <h4>Selected Invoice</h4>
          <div className="selected-invoice-detail">
            <p><strong>ID:</strong> {selectedInvoice.id}</div>
            <div className="detail-row">
              <span>Amount:</span> <span>{selectedInvoice.amount} USDT</span>
            </div>
            <div className="detail-row">
              <span>Status:</span> <span>{selectedInvoice.status}</span>
            </div>
            <div className="detail-row">
              <span>Contractor:</span> <span>{selectedInvoice.contractor.slice(0, 6)}...{selectedInvoice.contractor.length - 4}</span>
            </div>
            <div className="detail-row">
              <span>ENS Subname:</span> <span>{selectedInvoice.ensSubname}</span>
            </div>
          </div>

          {selectedInvoice.status === 'pending' && (
            <div className="action-section">
              <button
                onClick={() => handleProcessPayment(selectedInvoice.id)}
                className="btn btn-primary"
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Process Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;