// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "./Membership.sol";

contract MembershipFactory {


  // keep track of Memberships contract addresses we make
  address [] public contracts;

  constructor() public {
  }

  function getContractCount()
  public
  returns (uint contractCount) {
    return contracts.length;
  }

  function getAllContracts () 
  public view 
  returns ( address [] memory ) {
    return contracts;
  }

  function deployMembershipContract(string memory businessInfoLink, uint maxMembers)
  public
  returns(address newContract)
  {
    Membership m = new Membership(businessInfoLink, maxMembers, msg.sender);
    contracts.push(address(m));

    return address(m);
  }
}

