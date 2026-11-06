const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("ENSv2 Integration", function () {
  let ensv2Registry;
  let owner;
  let contractor;

  beforeEach(async function () {
    [owner, contractor] = await ethers.getSigners();

    // Mock ENSv2 registry for testing
    const ENSv2Registry = await ethers.getContractFactory("MockENSv2Registry");
    ensv2Registry = await ENSv2Registry.deploy();
    await ensv2Registry.waitForDeployment();
  });

  it("Should register subname under dao.eth", async function () {
    const subname = ethers.encodeBytes32String("contractor001");
    const ownerAddress = contractor.address;
    const resolver = contractor.address;
    const expiry = 365 * 24 * 60 * 60; // 1 year in seconds
    const dataExpiry = 0;
    const permissions = 0;

    const tx = await ensv2Registry.registerSubname(
      subname,
      ownerAddress,
      resolver,
      expiry,
      dataExpiry,
      permissions
    );

    const receipt = await tx.wait();

    // Check that subname was registered
    const isRegistered = await ensv2Registry.isSubnameRegistered(subname);
    expect(isRegistered).to.be.true;
  });

  it("Should resolve subname to get payment history", async function () {
    const subname = ethers.encodeBytes32String("contractor002");
    const ownerAddress = contractor.address;
    const resolver = contractor.address;

    // Register subname first
    await ensv2Registry.registerSubname(subname, ownerAddress, resolver, 365 * 24 * 60 * 60, 0, 0);

    // Get text records
    const paymentHistory = "Paid 5 invoices, total $50,000 USDT";
    const reputation = "Excellent - 100% on-time payment";
    const lastPayment = "2024-01-15";

    // Set text records (mock)
    await ensv2Registry.setTextRecord(subname, "paymentHistory", paymentHistory);
    await ensv2Registry.setTextRecord(subname, "reputation", reputation);
    await ensv2Registry.setTextRecord(subname, "lastPayment", lastPayment);

    // Resolve and verify
    const retrievedHistory = await ensv2Registry.getTextRecord(subname, "paymentHistory");
    const retrievedReputation = await ensv2Registry.getTextRecord(subname, "reputation");
    const retrievedLastPayment = await ensv2Registry.getTextRecord(subname, "lastPayment");

    expect(retrievedHistory).to.equal(paymentHistory);
    expect(retrievedReputation).to.equal(reputation);
    expect(retrievedLastPayment).to.equal(lastPayment);
  });

  it("Should link ENSv2 subname to Whitechain payment contract", async function () {
    const subname = ethers.encodeBytes32String("contractor003");
    const ensSubnameHash = ethers.keccak256(subname);

    // Simulate contract registering ENSv2 subname
    const WhitechainPayment = await ethers.getContractFactory("WhitechainPayment");
    const paymentContract = await WhitechainPayment.deploy();
    await paymentContract.waitForDeployment();

    // Register contractor with ENSv2 subname
    await paymentContract.connect(contractor).registerContractor(ensSubnameHash);

    const storedSubname = await paymentContract.getENSv2Subname(contractor.address);
    expect(storedSubname).to.equal(ensSubnameHash);
  });
});