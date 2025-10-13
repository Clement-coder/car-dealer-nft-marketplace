// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;


library Events {

    event CarMinted(
        uint256 indexed tokenId,
        string make,
        string model,
        uint256 year,
        address owner
    );

    event CarListedForSale(
        uint256 indexed tokenId,
        uint256 price
    );

    event CarSold(
        uint256 indexed tokenId,
        address indexed newOwner,
        uint256 price
    );

    event CarUnlisted(uint256 indexed tokenId);
    
    event CarPriceUpdated(uint256 indexed tokenId, uint256 indexed oldPrice, uint256 indexed newPrice);

    event MarketplaceFeeUpdated(uint256 oldFee, uint256 newFeePercent);

    event FeesWithdrawn(address owner, uint256 amount);

    event CarBurned(uint256 indexed tokenId);

    
}