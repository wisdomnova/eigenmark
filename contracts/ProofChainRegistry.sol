// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract ProofChainRegistry {
    struct Asset {
        string contentHash;
        string title;
        address creatorAddress;
        uint256 royaltySplit;
        string parentHash;
        string licenseTermsHash;
        uint256 timestamp;
    }

    struct LicenseAgreement {
        string assetHash;
        address licensee;
        uint256 price;
        uint256 timestamp;
    }

    mapping(string => Asset) public assets;
    string[] public assetList;
    LicenseAgreement[] public agreements;

    event AssetRegistered(
        string contentHash,
        string title,
        address creatorAddress,
        uint256 royaltySplit,
        string parentHash
    );

    event LicensePurchased(
        string assetHash,
        address licensee,
        uint256 price,
        uint256 splitToParent,
        uint256 splitToDerivative
    );

    function registerAsset(
        string memory _contentHash,
        string memory _title,
        uint256 _royaltySplit,
        string memory _parentHash,
        string memory _licenseTermsHash
    ) external {
        require(bytes(_contentHash).length > 0, "Content hash cannot be empty");
        require(assets[_contentHash].creatorAddress == address(0), "Asset already registered");
        require(_royaltySplit <= 100, "Royalty split percentage cannot exceed 100");

        if (bytes(_parentHash).length > 0) {
            require(assets[_parentHash].creatorAddress != address(0), "Parent asset must exist");
        }

        assets[_contentHash] = Asset({
            contentHash: _contentHash,
            title: _title,
            creatorAddress: msg.sender,
            royaltySplit: _royaltySplit,
            parentHash: _parentHash,
            licenseTermsHash: _licenseTermsHash,
            timestamp: block.timestamp
        });

        assetList.push(_contentHash);

        emit AssetRegistered(
            _contentHash,
            _title,
            msg.sender,
            _royaltySplit,
            _parentHash
        );
    }

    function purchaseLicense(string memory _assetHash) external payable {
        Asset storage asset = assets[_assetHash];
        require(asset.creatorAddress != address(0), "Asset does not exist");
        require(msg.value > 0, "Licensing price must be greater than zero");

        uint256 splitToParent = 0;
        uint256 splitToDerivative = msg.value;

        if (bytes(asset.parentHash).length > 0) {
            Asset storage parent = assets[asset.parentHash];
            if (parent.creatorAddress != address(0)) {
                splitToParent = (msg.value * asset.royaltySplit) / 100;
                splitToDerivative = msg.value - splitToParent;

                payable(parent.creatorAddress).transfer(splitToParent);
                payable(asset.creatorAddress).transfer(splitToDerivative);
            } else {
                payable(asset.creatorAddress).transfer(msg.value);
            }
        } else {
            payable(asset.creatorAddress).transfer(msg.value);
        }

        agreements.push(LicenseAgreement({
            assetHash: _assetHash,
            licensee: msg.sender,
            price: msg.value,
            timestamp: block.timestamp
        }));

        emit LicensePurchased(
            _assetHash,
            msg.sender,
            msg.value,
            splitToParent,
            splitToDerivative
        );
    }

    function getAssetList() external view returns (string[] memory) {
        return assetList;
    }

    function getAgreementCount() external view returns (uint256) {
        return agreements.length;
    }
}
