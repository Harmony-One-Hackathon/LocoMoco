import React, { useEffect, useState } from "react";
import BN from "bn.js";
import NavBar from "../components/NavBar";
import { web3, factoryContract, MembershipABI } from "../libs/web3";
import styles from "../styles/Explore.module.css";

type Metadata = {
  address: string;
  title: string;
  description: string;
  image: string;
  currentSupply: number;
  totalSupply: number;
};

export default function Explore() {
  // Accounts
  const [account, setAccount] = useState("");
  const [allMetadata, setAllMetadata] = useState<Metadata[]>([]);
  const [chainID, setChainID] = useState<number>();
  const [loading, setLoading] = useState(false);

  const refreshInfo = async () => {
    const contracts = await factoryContract.methods.getAllContracts().call();
    // ["0x123123123", "0x123o98o91283"]

    let metadatas: Metadata[] = [];
    for (const c of contracts) {
      const membershipContract = new web3.eth.Contract(
        // @ts-ignore
        MembershipABI,
        c
      );

      // retrieve metadata
      const ipfsLink = await membershipContract.methods.baseURI().call();
      const resp = await fetch(ipfsLink);

      // retreive total supply
      const totalSupply = await membershipContract.methods.maxMembers().call();
      const currentSupply = await membershipContract.methods
        .currNumMembers()
        .call();

      const json: Metadata = await resp.json();
      metadatas.push({
        totalSupply: parseInt(totalSupply),
        currentSupply: parseInt(currentSupply),
        address: c,
        ...json,
      });

      // need to fetch the baseURL information
    }
    setAllMetadata(metadatas);
  };

  const getContractInfo = async () => {
    setLoading(true);
    const contracts = await factoryContract.methods.getAllContracts().call();
    // ["0x123123123", "0x123o98o91283"]

    let metadatas: Metadata[] = [];
    for (const c of contracts) {
      const membershipContract = new web3.eth.Contract(
        // @ts-ignore
        MembershipABI,
        c
      );

      // retrieve metadata
      const ipfsLink = await membershipContract.methods.baseURI().call();
      const resp = await fetch(ipfsLink);

      // retreive total supply
      const totalSupply = await membershipContract.methods.maxMembers().call();
      const currentSupply = await membershipContract.methods
        .currNumMembers()
        .call();

      const json: Metadata = await resp.json();
      metadatas.push({
        totalSupply: parseInt(totalSupply),
        currentSupply: parseInt(currentSupply),
        address: c,
        ...json,
      });

      // need to fetch the baseURL information
    }
    setAllMetadata(metadatas);
    setLoading(false);
  };

  const buy = async (contractAddress) => {
    // @ts-ignore
    const membershipContract = new web3.eth.Contract(
      // @ts-ignore
      MembershipABI,
      contractAddress
    );

    const gasPrice = new BN(await web3.eth.getGasPrice()).mul(new BN(1));
    const gasLimit = 6721900;
    if (account) {
      try {
        await membershipContract.methods
          .obtainMembership()
          .send({ from: account, value: 1, gasPrice, gasLimit });
        // update information
        refreshInfo();
      } catch (e) {
        alert(e);
      }
    }
  };

  useEffect(() => {
    //@ts-ignore
    window.ethereum.request({ method: "eth_accounts" }).then(async (acc) => {
      setAccount(acc[0]);
      console.log("my balance:", await web3.eth.getBalance(acc[0]));
    });

    //@ts-ignore
    window.ethereum.on("accountsChanged", async function (acc) {
      setAccount(acc[0]);
      console.log("my balance:", await web3.eth.getBalance(acc[0]));
    });

    // only run this function if we are on the correct chain
    web3.eth.getChainId().then((chainId) => {
      setChainID(chainId);
      if (chainId === 1666700000) getContractInfo();
    });
  }, []);

  return (
    <div>
      <NavBar account={account} setAccount={setAccount} />
      <h1 className={styles.header}>
        Current Memberships on Sale ({allMetadata.length})
      </h1>
      {chainID !== 1666700000 && (
        <h2 className={styles.warning}>
          To view all memberships, switch networks to the Harmony Testnet
        </h2>
      )}
      {loading && <h2 className={styles.warning}>Loading...</h2>}
      <div className={styles.container}>
        {allMetadata.map((metadata) => {
          return (
            <div className={styles.card}>
              <img src={metadata.image} className={styles.image}></img>
              <div className={styles.textContainer}>
                <h3 className={styles.title}>{metadata.title}</h3>
                <p className={styles.description}>{metadata.description}</p>
                <p>
                  {metadata.totalSupply - metadata.currentSupply} /{" "}
                  {metadata.totalSupply} left
                </p>
                <div className={styles.buttonContainer}>
                  <div
                    className={styles.button}
                    onClick={() => buy(metadata.address)}
                  >
                    Buy NFT
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
