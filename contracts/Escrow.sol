// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Escrow is Ownable(msg.sender), IERC721Receiver {
    using SafeERC20 for IERC20;
    using EnumerableSet for EnumerableSet.UintSet;

    struct TokenLoan {
        bool exists;
        uint128 loan;
        address token;
    }

    struct TokenVault {
        uint128 totalLoan;
        mapping (uint256 tokenId => TokenLoan) loanOf;
        EnumerableSet.UintSet tokens;

    }
    struct NftVault {
        mapping ( address owner => TokenVault) list;
    }

    struct LoanReview {
         address nft;
        uint256 tokenId;
        address spender;
        address token;
        uint128 value;
    }

    mapping (address nft => NftVault vault) internal _vault;

    event onReview();
    event onERC721Transfer(
        address indexed nft,
        address indexed operator,
        address from,
        uint256 tokenId,
        bytes data
    );

    constructor() payable  {}

    function _increaseTokenAllowance(address token, address spender, uint128 value) onlyOwner public {
        IERC20(token).safeIncreaseAllowance(spender, value);
    }

    function loan(address nft, address owner, uint256 tokenId) view public returns (TokenLoan memory) {
        return _vault[nft].list[owner].loanOf[tokenId];
    }

    function totalLoan(address nft, address owner) view public returns (uint128 totalLoan) {
        return _vault[nft].list[owner].totalLoan;
    } 
    
    function lockedTokens(address nft, address owner) view public returns (uint256[] memory lockedIds) {
        return _vault[nft].list[owner].tokens.values();
    }

    function _reviewLoans(LoanReview[] calldata loans) onlyOwner public {
        for (uint256 i = 0; i < loans.length; i++) {
            LoanReview calldata l = loans[i];

            TokenVault storage s = _vault[l.nft].list[l.spender];
            TokenLoan storage t = s.loanOf[l.tokenId];

            t.loan = l.value;
            t.token = l.token;
            t.exists = true;
            s.totalLoan += l.value;
            s.tokens.add(l.tokenId);
            
            IERC20(l.token).safeIncreaseAllowance(l.spender, l.value);
        }
        emit onReview();
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

        s.tokens.remove(tokenId);
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
