import React, { useEffect, useState } from "react";
import BN from "bn.js";
import NavBar from "../components/NavBar";
import { web3, factoryContract, MembershipABI } from "../libs/web3";
import styles from "../styles/Memberships.module.css";

type Metadata = {
  title: string;
  description: string;
  image: string;
};

export default function Memberships() {
  // Accounts
  const [account, setAccount] = useState("");
  const [allMetadata, setAllMetadata] = useState<Metadata[]>([]);
  const [chainID, setChainID] = useState<number>();

  useEffect(() => {
    // get current account
    (async () => {
      const chainid = await web3.eth.getChainId();
      setChainID(chainid);
      // if the chain is supported
      if (chainid === 1666700000) {
        //@ts-ignore
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        const acc = accounts[0];
        setAccount(acc);

        // get all delpoyed contracts
        const contracts = await factoryContract.methods
          .getAllContracts()
          .call();

        if (acc) {
          let metadatas = [];
          for (const c of contracts) {
            const membershipContract = new web3.eth.Contract(
              // @ts-ignore
              MembershipABI,
              c
            );
            const isMember =
              (await membershipContract.methods.balanceOf(acc).call()) > 0;
            if (isMember) {
              const ipfsLink = await membershipContract.methods
                .baseURI()
                .call();
              const resp = await fetch(ipfsLink);
              const json: Metadata = await resp.json();
              metadatas.push(json);
            }
          }
          setAllMetadata(metadatas);
        }
      }
    })();

    //@ts-ignore
    window.ethereum.on("accountsChanged", async function (acc) {
      setAccount(acc[0]);
    });
  }, []);

  return (
    <div>
      <NavBar account={account} setAccount={setAccount} />
      <h1 className={styles.header}>Your Memberships ({allMetadata.length})</h1>
      {chainID !== 1666700000 && (
        <h2 className={styles.warning}>
          To view your assets, switch networks to the Harmony Testnet
        </h2>
      )}
      <div className={styles.container}>
        {allMetadata.map((metadata) => {
          return (
            <div className={styles.card}>
              <img src={metadata.image} className={styles.image}></img>
              <div className={styles.textContainer}>
                <h3 className={styles.title}>{metadata.title}</h3>
                <p className={styles.description}>{metadata.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
