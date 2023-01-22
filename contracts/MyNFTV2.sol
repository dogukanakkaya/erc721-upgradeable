// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFTV2 is ERC721URIStorageUpgradeable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    function initialize() public initializer {
        __ERC721_init("MyNFT", "MYN");
    }

    function mintItem(string memory tokenURI) public payable returns (uint256) {
        require(
            msg.value >= 0.00005 ether,
            "You have to pay at least 0.00005 ether to mint."
        );

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function latestTokenId() public view returns (uint256) {
        return _tokenIds.current();
    }

    function nextTokenId() public view returns (uint256) {
        uint256 current = _tokenIds.current();
        return current + 1;
    }
}
