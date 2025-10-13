// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./libs/Errors.sol";
import "./libs/Events.sol";

contract CarDealer is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    uint256 public marketplaceFeePercent = 2; // 2% fee
    uint256 public totalFeesCollected;

    struct Car {
        uint256 tokenId;
        string make;
        string model;
        uint256 year;
        uint256 price;
        address owner;
        bool isForSale;
    }

    mapping(uint256 => Car) public cars;
    mapping(address => uint256[]) private ownerCars;

    constructor() ERC721("CarDealer", "CAR") Ownable(msg.sender) {}

    // Helper function to check if token exists
    modifier tokenExists(uint256 tokenId) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        _;
    }

    // WRITE FUNCTIONS

    function mintCar(string memory make, string memory model, uint256 year, string memory _tokenURI) public onlyOwner {
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        cars[tokenId] = Car({
            tokenId: tokenId,
            make: make,
            model: model,
            year: year,
            price: 0,
            owner: msg.sender,
            isForSale: false
        });

        ownerCars[msg.sender].push(tokenId);

        emit Events.CarMinted(tokenId, make, model, year, msg.sender);
    }

    function listCarForSale(uint256 tokenId, uint256 price) public tokenExists(tokenId) {
        if(ownerOf(tokenId) != msg.sender) revert Errors.InvalidCarOwner();
        if(price <= 0) revert Errors.InvalidAmount();

        cars[tokenId].isForSale = true;
        cars[tokenId].price = price;

        emit Events.CarListedForSale(tokenId, price);
    }

    function unlistCar(uint256 tokenId) public tokenExists(tokenId) {
        if(ownerOf(tokenId) != msg.sender) revert Errors.InvalidCarOwner();
        
        cars[tokenId].isForSale = false;
        cars[tokenId].price = 0;

        emit Events.CarUnlisted(tokenId);
    }

    function updatePrice(uint256 tokenId, uint256 newPrice) public tokenExists(tokenId) {
        if(ownerOf(tokenId) != msg.sender) revert Errors.InvalidCarOwner();
        if(newPrice <= 0) revert Errors.InvalidAmount();
        if(!cars[tokenId].isForSale) revert Errors.NotForSale();

        uint256 oldPrice = cars[tokenId].price;
        cars[tokenId].price = newPrice;

        emit Events.CarPriceUpdated(tokenId, oldPrice, newPrice);
    }

    function buyCar(uint256 tokenId) public payable tokenExists(tokenId) {
        Car storage car = cars[tokenId];
        address currentOwner = ownerOf(tokenId);
        
        if(!car.isForSale) revert Errors.NotForSale();
        if(msg.value < car.price) revert Errors.InsufficientFunds();
        if(currentOwner == msg.sender) revert("Cannot buy your own car");

        // Calculate marketplace fee
        uint256 fee = (msg.value * marketplaceFeePercent) / 100;
        uint256 sellerAmount = msg.value - fee;
        
        totalFeesCollected += fee;

        // Transfer payment to seller
        address payable seller = payable(currentOwner);
        seller.transfer(sellerAmount);

        // Remove from previous owner's list
        _removeCarFromOwner(currentOwner, tokenId);

        // Transfer NFT
        _transfer(currentOwner, msg.sender, tokenId);
        
        // Update car struct
        car.owner = msg.sender;
        car.isForSale = false;
        car.price = 0;

        // Add to new owner's list
        ownerCars[msg.sender].push(tokenId);

        emit Events.CarSold(tokenId, msg.sender, msg.value);
    }

    function setMarketplaceFee(uint256 newFeePercent) public onlyOwner {
        require(newFeePercent <= 10, "Fee cannot exceed 10%");
        uint256 oldFee = marketplaceFeePercent;
        marketplaceFeePercent = newFeePercent;
        
        emit Events.MarketplaceFeeUpdated(oldFee, newFeePercent);
    }

    function withdrawFees() public onlyOwner {
        uint256 amount = totalFeesCollected;
        require(amount > 0, "No fees to withdraw");
        
        totalFeesCollected = 0;
        payable(owner()).transfer(amount);

        emit Events.FeesWithdrawn(owner(), amount);
    }

    function burnCar(uint256 tokenId) public tokenExists(tokenId) {
        if(ownerOf(tokenId) != msg.sender) revert Errors.InvalidCarOwner();
        
        _removeCarFromOwner(msg.sender, tokenId);
        _burn(tokenId);
        delete cars[tokenId];

        emit Events.CarBurned(tokenId);
    }

    // READ FUNCTIONS

    function getCarDetails(uint256 tokenId) public view tokenExists(tokenId) returns (Car memory) {
        return cars[tokenId];
    }

    function getAllCars() public view returns (Car[] memory) {
        uint256 totalCars = _tokenIdCounter;
        Car[] memory allCars = new Car[](totalCars);

        for (uint256 i = 0; i < totalCars; i++) {
            allCars[i] = cars[i + 1];
        }

        return allCars;
    }

    function getCarsForSale() public view returns (Car[] memory) {
        uint256 totalCars = _tokenIdCounter;
        uint256 forSaleCount = 0;

        // Count cars for sale
        for (uint256 i = 1; i <= totalCars; i++) {
            if (cars[i].isForSale) {
                forSaleCount++;
            }
        }

        // Create array of cars for sale
        Car[] memory carsForSale = new Car[](forSaleCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= totalCars; i++) {
            if (cars[i].isForSale) {
                carsForSale[index] = cars[i];
                index++;
            }
        }

        return carsForSale;
    }

    function getCarsByOwner(address owner) public view returns (Car[] memory) {
        uint256[] memory tokenIds = ownerCars[owner];
        Car[] memory ownedCars = new Car[](tokenIds.length);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            ownedCars[i] = cars[tokenIds[i]];
        }

        return ownedCars;
    }

    function getCarsByMake(string memory make) public view returns (Car[] memory) {
        uint256 totalCars = _tokenIdCounter;
        uint256 matchCount = 0;

        // Count matching cars
        for (uint256 i = 1; i <= totalCars; i++) {
            if (keccak256(bytes(cars[i].make)) == keccak256(bytes(make))) {
                matchCount++;
            }
        }

        // Create array of matching cars
        Car[] memory matchingCars = new Car[](matchCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= totalCars; i++) {
            if (keccak256(bytes(cars[i].make)) == keccak256(bytes(make))) {
                matchingCars[index] = cars[i];
                index++;
            }
        }

        return matchingCars;
    }

    function getCarsByPriceRange(uint256 minPrice, uint256 maxPrice) public view returns (Car[] memory) {
        uint256 totalCars = _tokenIdCounter;
        uint256 matchCount = 0;

        // Count cars in price range
        for (uint256 i = 1; i <= totalCars; i++) {
            if (cars[i].isForSale && cars[i].price >= minPrice && cars[i].price <= maxPrice) {
                matchCount++;
            }
        }

        // Create array of matching cars
        Car[] memory matchingCars = new Car[](matchCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= totalCars; i++) {
            if (cars[i].isForSale && cars[i].price >= minPrice && cars[i].price <= maxPrice) {
                matchingCars[index] = cars[i];
                index++;
            }
        }

        return matchingCars;
    }

    function getTotalCars() public view returns (uint256) {
        return _tokenIdCounter;
    }

    function getMarketplaceStats() public view returns (
        uint256 totalCars,
        uint256 carsForSale,
        uint256 feesCollected,
        uint256 feePercent
    ) {
        totalCars = _tokenIdCounter;
        
        uint256 forSaleCount = 0;
        for (uint256 i = 1; i <= totalCars; i++) {
            if (cars[i].isForSale) {
                forSaleCount++;
            }
        }

        return (totalCars, forSaleCount, totalFeesCollected, marketplaceFeePercent);
    }

    // INTERNAL HELPER FUNCTIONS

    function _removeCarFromOwner(address owner, uint256 tokenId) private {
        uint256[] storage tokenIds = ownerCars[owner];
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (tokenIds[i] == tokenId) {
                tokenIds[i] = tokenIds[tokenIds.length - 1];
                tokenIds.pop();
                break;
            }
        }
    }

    // OVERRIDES

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}