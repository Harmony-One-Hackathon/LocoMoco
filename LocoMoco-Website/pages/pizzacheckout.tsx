import React, { useEffect, useState } from "react";
import Image from "next/image";

import NavBar from "../components/NavBar";
import { web3, factoryContract, MembershipABI } from "../libs/web3";
import styles from "../styles/PizzaCheckout.module.css";

type Metadata = {
  title: string;
  description: string;
  image: string;
};

const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
const truncateEthAddress = function (address: string) {
  var match = String(address).match(truncateRegex);
  if (!match) return address;
  return match[1] + "\u2026" + match[2];
};

export default function PizzaCheckout() {
  // Accounts
  const [account, setAccount] = useState("");
  const [allMetadata, setAllMetadata] = useState<Metadata[]>([]);
  const [chainID, setChainID] = useState<number>();
  const [member, setMember] = useState(false);

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
              if (json.title === "John's Pizza Hut") setMember(true);
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

  const sendTransaction = async () => {
    const tx = await web3.eth.sendTransaction({
      from: account,
      to: "0x6712Aadd410cF68190A6CdaC54f83436B7FaAae2",
      value: member ? 4 * 1e18 : 5 * 1e18,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.walletButton}>
        {account !== ""
          ? chainID === 1666700000
            ? truncateEthAddress(account)
            : "Wrong Network"
          : "Connect Wallet"}
      </div>
      <div className={styles.checkoutContainer}>
        <h1 className={styles.title}>Checkout Your Pizza?</h1>
        <p className={styles.description}>
          Ingredients:
          <br />
          tomato sauce, mozzarella cheese, cocktail shrimps, salmon, mussels,
          lemon, parsley.
        </p>
        <div className={styles.buttonContainer}>
          <h2 className={styles.pricing}>
            <span
              style={{
                textDecoration: member ? "line-through" : "none",
                color: member ? "red" : "white",
              }}
            >
              5
            </span>{" "}
            {member && 4} ONE
          </h2>
          <div className={styles.button} onClick={() => sendTransaction()}>
            Pay Now
          </div>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <Image
          src="/pizzacheckout.png"
          alt="How does LocoMoco work?"
          width={600}
          height={720}
        />
      </div>
    </div>
  );
}
