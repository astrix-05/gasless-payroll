import { useState } from 'react';

const MerchantDashboard = ({ onPaymentComplete }) => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

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
      contractor: '0x0000000000000000000000000000000000000002',
      ensSubname: 'contractor003.dao.eth',
      createdAt: '2024-11-03T11:45:00Z'
    }
  ];

  const handleProcessPayment = async (invoiceId) => {
    try {
      setProcessing(true);
      setError('');
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

      {error && <p className="error">{error}</p>}

      <div className="invoice-list">
        {mockInvoices.map((invoice) => (
          <div key={invoice.id} className="invoice-item">
            <div className="invoice-meta">
              <p>Contractor: {invoice.contractor.slice(0, 6)}...{invoice.contractor.slice(-4)}</p>
              <p>Subname: <code>{invoice.ensSubname}</code></p>
              <p>Amount: {invoice.amount} USDT</p>
              <p>Status: {invoice.status}</p>
              <p>Created: {new Date(invoice.createdAt).toLocaleString()}</p>
            </div>

            <div className="action-buttons">
              <button
                onClick={() => setSelectedInvoice(invoice)}
                className="btn btn-primary"
              >
                Select Invoice
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedInvoice && (
        <div className="selected-invoice">
          <h4>Selected Invoice</h4>
          <div className="selected-invoice-detail">
            <div className="detail-row">
              <span>ID:</span> <span>{selectedInvoice.id}</span>
            </div>
            <div className="detail-row">
              <span>Amount:</span> <span>{selectedInvoice.amount} USDT</span>
            </div>
            <div className="detail-row">
              <span>Status:</span> <span>{selectedInvoice.status}</span>
            </div>
            <div className="detail-row">
              <span>Contractor:</span> <span>{selectedInvoice.contractor.slice(0, 6)}...{selectedInvoice.contractor.slice(-4)}</span>
            </div>
            <div className="detail-row">
              <span>ENS Subname:</span> <span>{selectedInvoice.ensSubname}</span>
            </div>
          </div>

          {selectedInvoice.status === 'pending' && (
            <button
              onClick={() => handleProcessPayment(selectedInvoice.id)}
              className="btn btn-primary"
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Process Gasless Payment (EIP-3009)'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MerchantDashboard;
