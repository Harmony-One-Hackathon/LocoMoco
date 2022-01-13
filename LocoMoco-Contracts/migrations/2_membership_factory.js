const MembershipFactory = artifacts.require("MembershipFactory");

module.exports = function (deployer) {
  deployer.deploy(MembershipFactory);
};

// const Membership = artifacts.require("Membership");
// const MembershipFactory = artifacts.require("MembershipFactory");

// module.exports = function (deployer) {
//   deployer.deploy(Membership).then(() => deployer.deploy(MembershipFactory, Membership.address));
// };
