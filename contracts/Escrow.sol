// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Escrow is Ownable(msg.sender), IERC721Receiver {
    using SafeERC20 for IERC20;

    struct TokenLoan {
        bool exists;
        uint128 loan;
        address token;
    }

    struct TokenVault {
        uint128 totalLoan;
        mapping (uint256 tokenId => TokenLoan) loanOf;
    }
    struct NftVault {
        mapping ( address owner => TokenVault) list;
    }

    mapping (address nft => NftVault vault) _vault;

    event onERC721Transfer(
        address nft,
        address operator,
        address from,
        uint256 tokenId,
        bytes data
    );

    constructor() payable  {}

    function _increaseTokenAllowance(address token, address spender, uint128 value) onlyOwner public {
        IERC20(token).safeIncreaseAllowance(spender, value);
    }

    function _reviewLoan(
        address nft,
        uint256 tokenId,
        address spender,
        address token,
        uint128 value
    ) onlyOwner public {
        TokenVault storage s = _vault[nft].list[spender];
        TokenLoan storage t = s.loanOf[tokenId];

        t.loan = value;
        t.token = token;
        t.exists = true;
        s.totalLoan += value;
        IERC20(token).safeIncreaseAllowance(spender, value);
    }

    function withdraw(
        address nft,
        uint256 tokenId
    ) public {
        TokenVault storage s = _vault[nft].list[msg.sender];
        TokenLoan storage t = s.loanOf[tokenId];
        
        require(t.exists);
        
        if (t.loan > 0) IERC20(t.token).safeTransferFrom(msg.sender, address(this), t.loan);
        t.loan = 0;

        IERC721(nft).safeTransferFrom(address(this), msg.sender, tokenId);
        t.exists = false;

        delete s.loanOf[tokenId];
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) public virtual returns (bytes4) {
        emit onERC721Transfer(msg.sender, operator, from, tokenId, data);
        return this.onERC721Received.selector;
    }
}
