// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract KnowledgeCardNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Cost in platform tokens to mint an NFT
    uint256 public constant MINTING_COST = 50;
    
    // Weekly minting limit per user
    uint256 public constant WEEKLY_MINT_LIMIT = 3;
    
    // Royalty percentage (5%)
    uint256 public constant ROYALTY_PERCENTAGE = 500; // 5% = 500 basis points
    
    // Mapping from token ID to metadata
    struct CardMetadata {
        string title;
        string content;
        address author;
        uint256 correctCount;
        string[] mediaUrls;
        uint256 createdAt;
    }
    
    mapping(uint256 => CardMetadata) public cards;
    
    // Mapping to track weekly mints per user
    mapping(address => mapping(uint256 => uint256)) public weeklyMints;
    
    // Events
    event CardMinted(
        uint256 indexed tokenId,
        address indexed author,
        string title,
        uint256 correctCount
    );
    
    event RoyaltyPaid(
        uint256 indexed tokenId,
        address indexed author,
        address indexed buyer,
        uint256 amount
    );
    
    constructor() ERC721("KnowledgeCard", "KNOW") {}
    
    /**
     * @dev Mint a new knowledge card NFT
     * @param recipient Address to receive the NFT
     * @param metadata Card metadata
     * @param tokenURI IPFS URI containing the card's metadata
     */
    function mintCard(
        address recipient,
        CardMetadata memory metadata,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        require(
            weeklyMints[recipient][block.timestamp / 1 weeks] < WEEKLY_MINT_LIMIT,
            "Weekly minting limit reached"
        );
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        // Store metadata
        cards[newTokenId] = metadata;
        
        // Update weekly mints
        weeklyMints[recipient][block.timestamp / 1 weeks]++;
        
        emit CardMinted(
            newTokenId,
            metadata.author,
            metadata.title,
            metadata.correctCount
        );
        
        return newTokenId;
    }
    
    /**
     * @dev Calculate royalty for a sale
     * @param tokenId The NFT being sold
     * @param salePrice The sale price
     */
    function getRoyaltyInfo(uint256 tokenId, uint256 salePrice)
        public
        view
        returns (address receiver, uint256 royaltyAmount)
    {
        CardMetadata memory metadata = cards[tokenId];
        require(metadata.author != address(0), "Token does not exist");
        
        uint256 royalty = (salePrice * ROYALTY_PERCENTAGE) / 10000; // Convert basis points to percentage
        return (metadata.author, royalty);
    }
    
    /**
     * @dev Get metadata for a token
     * @param tokenId The NFT token ID
     */
    function getCardMetadata(uint256 tokenId)
        public
        view
        returns (CardMetadata memory)
    {
        require(_exists(tokenId), "Token does not exist");
        return cards[tokenId];
    }
    
    /**
     * @dev Override transfer to handle royalties
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        // Only handle royalties for sales (not minting or burning)
        if (from != address(0) && to != address(0)) {
            (address author, uint256 royalty) = getRoyaltyInfo(tokenId, MINTING_COST);
            emit RoyaltyPaid(tokenId, author, to, royalty);
        }
    }
}
