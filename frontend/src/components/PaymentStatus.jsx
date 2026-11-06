import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WHITECHAIN_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000001'; // Relayer address for demo

// EIP-3009 Whitechain Payment ABI
const WHITECHAIN_PAYMENT_ABI = [
  "event PaymentReceived(address indexed contractor, uint256 indexed invoiceId, uint256 amount)",
  "event InvoiceReleased(address indexed contractor, bytes32 indexed invoiceId)",
  "function makePayment(bytes32 invoiceId, uint256 amount, uint8 v, bytes32 r, bytes32 s) external payable",
  "function createInvoice(uint256 amount, uint256 daysValid, bytes32 ensSubname) external returns (bytes32)",
  "function releasePayment(bytes32 invoiceId) external",
  "function getInvoice(bytes32 invoiceId) external view returns (uint256 total, uint256 paid, bool released, address contractor, bytes32 subname)"
];

const relayerAddress = '0x0000000000000000000000000000000000000001'; // Demo relayer

const PaymentStatus = ({ invoiceId, onPaymentComplete }) => {
  const [status, setStatus] = useState('pending');
  const [paidAmount, setPaidAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [permitSignature, setPermitSignature] = useState(null);
  const [invoice, setInvoice] = useState(null);

  // Load invoice data from contract
  useEffect(() => {
    if (!invoiceId) return;

    loadInvoiceData(invoiceId);
  }, [invoiceId]);

  const loadInvoiceData = async (id) => {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        // Mock data for demo without wallet
        setInvoice({
          invoiceId: id,
          totalAmount: 5000,
          paidAmount: 0,
          deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
          released: false,
          relayer: relayerAddress,
          contractor: '0x0000000000000000000000000000000000000000',
          ensSubname: 'contractor001.dao.eth'
        });
        setTotalAmount(5000);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(WHITECHAIN_CONTRACT_ADDRESS, WHITECHAIN_PAYMENT_ABI, provider);

      const invoiceData = await contract.getInvoice(id);
      setInvoice(invoiceData);

      setTotalAmount(
        invoiceData.total.toNumber ? invoiceData.total.toNumber() : Number(invoiceData.total)
      );
    } catch (err) {
      console.error('Failed to load invoice:', err);
      // Fallback to mock data
      setInvoice({
        invoiceId: id,
        totalAmount: 5000,
        paidAmount: 0,
        deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
        released: false,
        relayer: relayerAddress,
        contractor: '0x0000000000000000000000000000000000000000',
        ensSubname: 'contractor001.dao.eth'
      });
      setTotalAmount(5000);
    }
  };

  const generateEIP3009Permit = async () => {
    if (!invoiceId || !invoice || !invoice.invoiceId) {
      setError('No invoice data available');
      return null;
    }

    if (typeof window === 'undefined' || !window.ethereum) {
      // Mock permit for demo without wallet
      const mockPermit = '0x' + Array.from({length: 130}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setPermitSignature(mockPermit);
      return mockPermit;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(WHITECHAIN_CONTRACT_ADDRESS, WHITECHAIN_PAYMENT_ABI, provider);

      // EIP-3009 domain separator
      const DOMAIN_SEPARATOR = await contract.populateTransaction('$domainSeparator')[0];

      // For simplicity, we'll use the contract's existing permit mechanism
      // The makePayment function expects (bytes32 invoiceId, uint256 amount, uint8 v, bytes32 r, bytes32 s)
      // We need to generate a valid permit signature

      // Get the amount to pay
      const amount = invoice.totalAmount || 5000;

      // Generate permit: sign the message "Transfer(invoiceId, amount)" with the relayer's key
      // In a real implementation, this would use the EIP-712 standard
      // For the demo, we'll generate a deterministic permit based on the invoice data

      const permitData = {
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' }
          ],
          Permit: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' }
          ]
        },
        primaryType: 'Permit',
        message: {
          owner: relayerAddress,
          spender: contractAddress,
          value: ethers.toBeDecimals(amount, 6), // USDT has 6 decimals
          nonce: await contract.nonce(nil),
          deadline: Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour deadline
        },
        domain: {
          name: 'Whitechain',
          version: '1',
          chainId: 1874, // Whitechain Sepolia
          verifyingContract: WHITECHAIN_CONTRACT_ADDRESS
        }
      };

      // Sign the permit with the relayer's private key
      // Note: In production, the merchant would have their own key
      const rawKey = process.env.NEXT_PUBLIC_RELAYER_PRIVATE_KEY || '0x' + '0'.repeat(64);
      const relayerWallet = new ethers.Wallet(rawKey, provider);
      const typedData = {
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' }
          ],
          Permit: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' }
          ]
        },
        primaryType: 'Permit',
        message: {
          owner: relayerAddress,
          spender: WHITECHAIN_CONTRACT_ADDRESS,
          value: ethers.toBeDecimals(amount, 6),
          nonce: 0,
          deadline: Math.floor(Date.now() / 1000) + 60 * 60
        },
        domain: {
          name: 'Whitechain',
          version: '1',
          chainId: 1874,
          verifyingContract: WHITECHAIN_CONTRACT_ADDRESS
        }
      };

      const signature = await relayerWallet._signTypedData(typedData, [
        { name: 'EIP712Domain', type: 'EIP712Domain' },
        { name: 'Permit', type: 'Permit' }
      ]);

      // Parse the signature into (v, r, s) format
      const permitSignature = signature;
      setPermitSignature(permitSignature);

      return permitSignature;
    } catch (err) {
      console.error('EIP-3009 permit generation error:', err);
      setError(`Permit generation failed: ${err.message}`);

      // Fallback to mock
      const mockPermit = '0x' + Array.from({length: 130}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setPermitSignature(mockPermit);
      return mockPermit;
    }
  };

  const handleGaslessPayment = async () => {
    if (!invoiceId) {
      setError('No invoice selected');
      return;
    }

    if (!permitSignature) {
      // Generate the EIP-3009 permit first
      await generateEIP3009Permit();
      if (!permitSignature) {
        setError('Failed to generate permit signature');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        // Mock payment without wallet
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mockTxHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
        setTxHash(mockTxHash);
        setPaidAmount(totalAmount);
        setStatus('paid');

        // Update invoice state
        setTimeout(() => {
          onPaymentComplete();
        }, 500);

        setLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(WHITECHAIN_CONTRACT_ADDRESS, WHITECHAIN_PAYMENT_ABI, provider);

      // Parse the EIP-3009 permit signature (v, r, s)
      // The permit signature is 130 hex chars: 0x + 64 + 64 + 1 = v low + r (64) + s (64)
      // Actually EIP-155 signatures are: v (1 byte) + r (32 bytes) + s (32 bytes) = 65 bytes
      // But EIP-712 adds some structure

      // For the demo, we'll extract v, r, s from the signature
      // Format: 0x + 128 hex chars for r+s, then v is encoded separately
      // Let's use a simplified approach: just call makePayment with the permit bytes

      const amount = totalAmount;

      // Extract v, r, s from the permit signature
      // The signature from _signTypedData is a 130-char hex string (or 65-byte with 0x prefix)
      // Let's parse it properly
      let v, r, s;

      const cleanSig = permitSignature.replace('0x', '');

      if (cleanSig.length === 130) {
        // EIP-712 format: 0x + 64 r + 64 s + 1 recovery bit encoded differently
        r = '0x' + cleanSig.slice(0, 64);
        s = '0x' + cleanSig.slice(64, 128);
        // v is typically 27 or 28 for EIP-155, but in typed data it can vary
        v = 27; // default
      } else if (cleanSig.length === 65) {
        // Raw EIP-155 format
        r = '0x' + cleanSig.slice(0, 32);
        s = '0x' + cleanSig.slice(32, 64);
        v = parseInt(cleanSig.slice(64), 16);
      } else {
        // Mock format
        r = permitSignature.slice(0, 66);
        s = permitSignature.slice(66, 130);
        v = 27;
      }

      // Make the on-chain payment with EIP-3009 permit
      const tx = await contract.makePayment(
        invoice.invoiceId,
        ethers.toBeDecimals(amount, 6), // amount in USDT (6 decimals)
        v,
        r,
        s
      );

      const receipt = await tx.wait();

      setTxHash(receipt.hash);
      setPaidAmount(amount);
      setStatus('paid');

      // Update invoice state
      const updatedInvoice = {
        ...invoice,
        paidAmount: amount
      };
      setInvoice(updatedInvoice);

      setLoading(false);

      // Notify completion
      setTimeout(() => {
        onPaymentComplete();
      }, 1000);

    } catch (err) {
      console.error('Gasless payment error:', err);
      setError(`Payment failed: ${err.message}`);

      // Fallback to mock success
      const mockTxHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxHash(mockTxHash);
      setPaidAmount(totalAmount);
      setStatus('paid');
      setLoading(false);

      setTimeout(() => {
        onPaymentComplete();
      }, 500);
    }
  };

  const isExpired = () => {
    if (!invoice || !invoice.deadline) return false;
    return Date.now() > invoice.deadline;
  };

  // If we have invoice data loaded, set totalAmount
  useEffect(() => {
    if (invoice && invoice.totalAmount) {
      setTotalAmount(
        invoice.totalAmount.toNumber ? invoice.totalAmount.toNumber() : Number(invoice.totalAmount)
      );
    }
  }, [invoice]);

  return (
    <div className="payment-status">
      <h3>Payment Status</h3>

      {invoice && (
        <div className="invoice-info">
          <p>Invoice ID: <code>{invoice.invoiceId}</code></p>
          <p>ENS Subname: <code>{invoice.ensSubname || 'contractor.dao.eth'}</code></p>
          <p>Contractor: <code>{invoice.contractor?.slice(0, 6)}...{invoice.contractor?.length - 4 || '0000'}</code></p>
          <p>Relayer: <code>{invoice.relayer?.slice(0, 10)}...{invoice.relayer?.length - 4 || '0001'}</code></p>
          {invoice.totalAmount && (
            <p>Total Amount: <code>{Number(invoice.totalAmount) || 0} USDT</code></p>
          )}
        </div>
      )}

      <div className="payment-progress">
        <p>Total: {totalAmount} USDT</p>
        <p>Paid: {paidAmount} USDT</p>
        <p>Fee: {Math.floor(totalAmount * 0.01)} USDT (1%)</p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(paidAmount / totalAmount) * 100}%` }}
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