// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract TestNft is ERC721Enumerable {
    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    function testMint(uint256[] memory tokenIds) public {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _safeMint(msg.sender, tokenIds[i]);
        }
    }
}
