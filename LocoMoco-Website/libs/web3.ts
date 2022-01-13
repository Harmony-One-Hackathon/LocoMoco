import Web3 from "web3";
import FactoryABI from "../abi/factoryABI.json";
import MembershipABI from "../abi/membershipABI.json";

const web3 = new Web3(Web3.givenProvider || "ws://127.0.0.1:7545");

const factoryAddress = "0x1f4cb9f61281210c472C455C60B7B77D88cF4F39";
// @ts-ignore
const factoryContract = new web3.eth.Contract(FactoryABI, factoryAddress);

export { web3, factoryAddress, factoryContract, FactoryABI, MembershipABI };
