export const contractAddress = "0x892a3bc90de12c43abef9023ab90d34e902bc345d";

export const contractAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "contentHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "creatorAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "royaltySplit",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "parentHash",
        "type": "string"
      }
    ],
    "name": "AssetRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "assetHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "licensee",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "splitToParent",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "splitToDerivative",
        "type": "uint256"
      }
    ],
    "name": "LicensePurchased",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "agreements",
    "outputs": [
      {
        "internalType": "string",
        "name": "assetHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "licensee",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "assets",
    "outputs": [
      {
        "internalType": "string",
        "name": "contentHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "creatorAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "royaltySplit",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "parentHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "licenseTermsHash",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAgreementCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAssetList",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_assetHash",
        "type": "string"
      }
    ],
    "name": "purchaseLicense",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_contentHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_royaltySplit",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_parentHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_licenseTermsHash",
        "type": "string"
      }
    ],
    "name": "registerAsset",
    "outputs": [],
    "stateMutability": "external",
    "type": "function"
  }
] as const;
