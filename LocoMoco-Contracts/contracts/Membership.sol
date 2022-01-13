// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Membership is ERC721, ERC721URIStorage, Ownable {

    uint public currNumMembers;
    uint public maxMembers;
    uint public membershipPrice;

    address public businessOwner;
    string ipfsLink;
    mapping (address => bool) members;
    
    constructor(string memory newIpfsLink, uint maxAllowedMembers, address ownerAddr) ERC721("membership", "MBSHP") {
      currNumMembers = 0;
      maxMembers = maxAllowedMembers;
      membershipPrice = 1 wei;
      businessOwner = ownerAddr;
      ipfsLink = newIpfsLink;
    }

    function canBuy () public view returns (bool) {
      return currNumMembers < maxMembers;
    }

    function isMember () public view returns (bool) {
      return balanceOf(msg.sender) > 0;
    }

    function obtainMembership () public payable returns (bool) {
      require(isMember() == false, "You Are Already a Member!");      // require that the msg.sender is not already a member
      require(msg.value == membershipPrice, "Invalid Ether amount sent");
      require(canBuy() == true, "Max Number of Allowed Members!");

      payable(businessOwner).transfer(msg.value); // FIX: transfer money
      _safeMint(msg.sender, currNumMembers + 1);
      
      currNumMembers += 1; // increment num members
      members[msg.sender] = true; // add msg.sender(aka new Member to members mapping)
      return true;
    }

    // check if the msg.sender is an supporter of the store contract
    function isOwner() public returns (bool) {
      return members[msg.sender];
    }


     
    function baseURI() public view returns (string memory) {
        return ipfsLink;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
      require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
      return ipfsLink;  // return the baseURI for our scope
    }
}