import { ethers } from 'ethers';

// Validation utilities for the payroll application

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return emailRegex.test(email);
};

// Validate USDT address
export const validateUSDTAddress = (address) => {
  if (!ethers.isAddress(address)) return false;
  return true;
};

// Validate amount (positive number)
export const validateAmount = (amount) => {
  if (typeof amount === 'string') amount = parseFloat(amount);
  return !isNaN(amount) && amount > 0 && amount <= 1000000; // Reasonable upper bound
};

// Validate ENS subname format
export const validateENSName = (name) => {
  // ENS subname rules
  const nameRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return nameRegex.test(name) && name.length >= 3 && name.length <= 63;
};

// Validate payment terms
export const validatePaymentTerms = (days) => {
  const daysInt = parseInt(days);
  return daysInt > 0 && daysInt <= 365; // Up to 1 year
};

// Validate World ID nullifier hash
export const validateNullifierHash = (hash) => {
  return typeof hash === 'string' && hash.length === 64 && /^[0-9a-f]+$/i.test(hash);
};

// Validate timestamp
export const validateTimestamp = (timestamp) => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  return timestamp > 0 && timestamp < now + (365 * day); // Valid for up to 1 year
};

// Check for duplicate nullifier hash
export const checkDuplicateNullifier = (storage, nullifierHash) => {
  const usedNullifiers = JSON.parse(storage.getItem('used_nullifiers') || '[]');
  return usedNullifiers.includes(nullifierHash);
};

// Add nullifier to used list
export const addUsedNullifier = (storage, nullifierHash) => {
  const usedNullifiers = JSON.parse(storage.getItem('used_nullifiers') || '[]');
  usedNullifiers.push(nullifierHash);
  storage.setItem('used_nullifiers', JSON.stringify(usedNullifiers));
};

// Generate random nonce for permit
export const generateNonce = () => {
  return Math.floor(Math.random() * 1000000000);
};

// Validate permit signature format
export const validatePermitSignature = (signature) => {
  return signature && signature.length >= 130; // Minimum valid signature length
};

// Validate invite code (for manual registration path)
export const validateInviteCode = (code) => {
  return typeof code === 'string' && code.length === 8;
};

// Check for rate limiting (per IP or user)
export const checkRateLimit = (storage, key, limit = 10) => {
  const requests = JSON.parse(storage.getItem(key) || '[]');
  const now = Date.now();
  const oneMinute = 60 * 1000;

  // Remove old requests (older than 1 minute)
  const recentRequests = requests.filter(t => now - t < oneMinute);
  storage.setItem(key, JSON.stringify(recentRequests));

  return recentRequests.length < limit;
};

// Record request for rate limiting
export const recordRateLimit = (storage, key) => {
  const requests = JSON.parse(storage.getItem(key) || '[]');
  requests.push(Date.now());
  storage.setItem(key, JSON.stringify(requests));
};

// Main validation function
export const validateInvoiceForm = (formData) => {
  const errors = [];

  // Required fields validation
  if (!formData.amount) errors.push('Amount is required');
  else if (!validateAmount(formData.amount)) errors.push('Amount must be a positive number');

  if (!formData.daysValid) errors.push('Validity period is required');
  else if (!validatePaymentTerms(formData.daysValid)) errors.push('Validity period must be between 1 and 365 days');

  if (!formData.ensSubname) errors.push('ENS subname is required');
  else if (!validateENSName(formData.ensSubname)) errors.push('ENS subname must be alphanumeric and 3-63 characters');

  // Additional validations for manual registration path
  if (formData.registrationMethod === 'manual') {
    if (!formData.email) errors.push('Email is required for manual registration');
    else if (!validateEmail(formData.email)) errors.push('Invalid email format');

    if (!formData.inviteCode) errors.push('Invite code is required');
    else if (!validateInviteCode(formData.inviteCode)) errors.push('Invalid invite code format');
  }

  return errors;
};

export default {
  validateEmail,
  validateUSDTAddress,
  validateAmount,
  validateENSName,
  validatePaymentTerms,
  validateNullifierHash,
  validateTimestamp,
  checkDuplicateNullifier,
  addUsedNullifier,
  generateNonce,
  validatePermitSignature,
  validateInviteCode,
  checkRateLimit,
  recordRateLimit,
  validateInvoiceForm
};