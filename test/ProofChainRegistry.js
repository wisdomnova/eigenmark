const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProofChainRegistry", function () {
  let Registry;
  let registry;
  let owner;
  let creator1;
  let creator2;
  let licensee;

  beforeEach(async function () {
    [owner, creator1, creator2, licensee] = await ethers.getSigners();
    Registry = await ethers.getContractFactory("ProofChainRegistry");
    registry = await Registry.deploy();
  });

  describe("Asset Registration", function () {
    it("should register a new asset successfully", async function () {
      const contentHash = "0xab12c345de6789f01234567890abcdef1234567890abcdef1234567890ab1234";
      const title = "Original Eagle Artwork";
      const royaltySplit = 10;
      const parentHash = "";
      const licenseTermsHash = "0xterms123";

      await expect(
        registry.connect(creator1).registerAsset(
          contentHash,
          title,
          royaltySplit,
          parentHash,
          licenseTermsHash
        )
      )
        .to.emit(registry, "AssetRegistered")
        .withArgs(contentHash, title, creator1.address, royaltySplit, parentHash);

      const asset = await registry.assets(contentHash);
      expect(asset.contentHash).to.equal(contentHash);
      expect(asset.title).to.equal(title);
      expect(asset.creatorAddress).to.equal(creator1.address);
      expect(asset.royaltySplit).to.equal(royaltySplit);
      expect(asset.parentHash).to.equal(parentHash);
      expect(asset.licenseTermsHash).to.equal(licenseTermsHash);
    });

    it("should fail if content hash is empty", async function () {
      await expect(
        registry.connect(creator1).registerAsset("", "Title", 10, "", "0xterms")
      ).to.be.revertedWith("Content hash cannot be empty");
    });

    it("should fail if asset is already registered", async function () {
      const contentHash = "0xab12c345de6789f01234567890abcdef1234567890abcdef1234567890ab1234";
      await registry.connect(creator1).registerAsset(contentHash, "Title", 10, "", "0xterms");

      await expect(
        registry.connect(creator2).registerAsset(contentHash, "Another Title", 20, "", "0xterms")
      ).to.be.revertedWith("Asset already registered");
    });

    it("should fail if royalty split exceeds 100 percent", async function () {
      const contentHash = "0xab12c345de6789f01234567890abcdef1234567890abcdef1234567890ab1234";
      await expect(
        registry.connect(creator1).registerAsset(contentHash, "Title", 101, "", "0xterms")
      ).to.be.revertedWith("Royalty split percentage cannot exceed 100");
    });

    it("should fail if parent hash is provided but parent does not exist", async function () {
      const contentHash = "0xcd34e567f01234567890abcdef1234567890abcdef1234567890abcdef1234cd";
      const nonExistentParent = "0xab12c345de6789f01234567890abcdef1234567890abcdef1234567890ab9999";
      
      await expect(
        registry.connect(creator1).registerAsset(
          contentHash,
          "Derivative Work",
          10,
          nonExistentParent,
          "0xterms"
        )
      ).to.be.revertedWith("Parent asset must exist");
    });
  });

  describe("Licensing Agreements and Royalty Settlements", function () {
    const parentHash = "0xab12c345de6789f01234567890abcdef1234567890abcdef1234567890ab1234";
    const derivativeHash = "0xcd34e567f01234567890abcdef1234567890abcdef1234567890abcdef1234cd";
    const licensePrice = ethers.parseEther("1.0"); // 1 ETH

    beforeEach(async function () {
      // Register parent asset (royalty settings of parent don't affect splits for derivative)
      await registry.connect(creator1).registerAsset(parentHash, "Parent Eagle", 15, "", "0xterms");
      
      // Register derivative asset (sets 20% royalty split to parent when licensed)
      await registry.connect(creator2).registerAsset(derivativeHash, "Derivative Eagle Anim", 20, parentHash, "0xterms");
    });

    it("should license an original asset and transfer 100 percent to its creator", async function () {
      const initialBalance = await ethers.provider.getBalance(creator1.address);

      const tx = await registry.connect(licensee).purchaseLicense(parentHash, { value: licensePrice });
      await expect(tx)
        .to.emit(registry, "LicensePurchased")
        .withArgs(parentHash, licensee.address, licensePrice, 0, licensePrice);

      const finalBalance = await ethers.provider.getBalance(creator1.address);
      expect(finalBalance - initialBalance).to.equal(licensePrice);
    });

    it("should license a derivative asset and split royalties between parent and derivative creators", async function () {
      const parentInitialBalance = await ethers.provider.getBalance(creator1.address);
      const derivativeInitialBalance = await ethers.provider.getBalance(creator2.address);

      // Expected split: 20% (0.2 ETH) to parent (creator1), 80% (0.8 ETH) to derivative (creator2)
      const expectedParentSplit = ethers.parseEther("0.2");
      const expectedDerivativeSplit = ethers.parseEther("0.8");

      const tx = await registry.connect(licensee).purchaseLicense(derivativeHash, { value: licensePrice });
      await expect(tx)
        .to.emit(registry, "LicensePurchased")
        .withArgs(derivativeHash, licensee.address, licensePrice, expectedParentSplit, expectedDerivativeSplit);

      const parentFinalBalance = await ethers.provider.getBalance(creator1.address);
      const derivativeFinalBalance = await ethers.provider.getBalance(creator2.address);

      expect(parentFinalBalance - parentInitialBalance).to.equal(expectedParentSplit);
      expect(derivativeFinalBalance - derivativeInitialBalance).to.equal(expectedDerivativeSplit);
    });

    it("should fail to purchase license if asset does not exist", async function () {
      const invalidHash = "0xab12c345de6789f01234567890abcdef1234567890abcdef1234567890ab9999";
      await expect(
        registry.connect(licensee).purchaseLicense(invalidHash, { value: licensePrice })
      ).to.be.revertedWith("Asset does not exist");
    });

    it("should fail if purchase price is zero", async function () {
      await expect(
        registry.connect(licensee).purchaseLicense(parentHash, { value: 0 })
      ).to.be.revertedWith("Licensing price must be greater than zero");
    });
  });
});
