import { useEffect, useState } from "react";
import React from "react";

import Link from "next/link";

import styles from "../styles/NavBar.module.css";
import { serviceAccountFromShorthand } from "firebase-functions/lib/common/encoding";
import { web3 } from "../libs/web3";

const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
const truncateEthAddress = function (address: string) {
  var match = String(address).match(truncateRegex);
  if (!match) return address;
  return match[1] + "\u2026" + match[2];
};

const NavBar = ({ account, setAccount }) => {
  // state
  const [chainID, setChainID] = useState<number>();

  const connect = function async() {
    // connect our page to the wallet
    //@ts-ignore
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts: string[]) => {
        if (accounts.length) {
          setAccount(accounts[0]);
        }
      });
  };

  useEffect(() => {
    //@ts-ignore
    window.ethereum.request({ method: "eth_accounts" }).then((acc) => {
      setAccount(acc[0]);
    });

    //@ts-ignore
    window.ethereum.on("accountsChanged", function (acc) {
      setAccount(acc[0]);
    });

    web3.eth.getChainId().then((chainId) => {
      setChainID(chainId);
    });
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">LOCOMOCO</Link>
      </div>
      <div className={styles.buttonContainer}>
        <div className={styles.navItem}>
          <Link href="/explore">Explore</Link>
        </div>
        <div className={styles.navItem}>
          <Link href="/memberships">My Memberships</Link>
        </div>
        <div className={styles.button} onClick={connect}>
          {account !== ""
            ? chainID === 1666700000
              ? truncateEthAddress(account)
                ? truncateEthAddress(account)
                : "Connect Wallet"
              : "Wrong Network"
            : "Connect Wallet"}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
