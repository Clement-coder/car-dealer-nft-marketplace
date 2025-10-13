// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

library Errors {
    error CarDoesNotExist();
    error InvalidCarOwner();
    error NotForSale();
    error InsufficientFunds();
    error InvalidAmount();
}