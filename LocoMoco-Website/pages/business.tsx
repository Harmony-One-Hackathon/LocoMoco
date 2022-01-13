import React, { useEffect, useRef, useState } from "react";
import Web3 from "web3";

import ipfs from "../ipfs";
import { web3, factoryContract } from "../libs/web3";

import NavBar from "../components/NavBar";

import styles from "../styles/Business.module.css";

export default function Business() {
  const inputFile = useRef(null);

  const [imageBuffer, setImageBuffer] = useState<Buffer>(null);
  const [title, setTitle] = useState("");
  const [bannerURL, setBannerURL] = useState("");
  const [description, setDescription] = useState("");
  const [moneyGoal, setMoneyGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [chainID, setChainID] = useState<number>();
  const [complete, setComplete] = useState(false);

  // Accounts
  const [account, setAccount] = useState("");

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

  const uploadImage = () => {
    if (inputFile) {
      inputFile.current.click();
    }
  };

  const onImageUpload = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setBannerURL(objectURL);
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
        // @ts-ignore
        setImageBuffer(Buffer.from(reader.result, "utf-8"));
      };
    }
  };

  const onCreate = async () => {
    // first upload the image to ipfs and recieve the hash
    setLoading(true);
    await ipfs.files.add(imageBuffer, (error, imageResults) => {
      if (error) {
        console.error(error);
        return;
      }

      // create a new json file to upload to ipfs
      const json = JSON.stringify({
        title,
        description,
        image: `https://ipfs.io/ipfs/${imageResults[0].hash}`,
      });

      ipfs.files.add(Buffer.from(json), async (error, result) => {
        if (error) {
          console.error(error);
          return;
        }

        // create new instance of contract and interact with it
        await factoryContract.methods
          .deployMembershipContract(
            `https://ipfs.io/ipfs/${result[0].hash}`,
            Math.floor(parseInt(moneyGoal) / 10)
          )
          .send({ from: account });
        setLoading(false);
        setComplete(true);
        return;
      });

      return;
    });
  };

  return (
    <div>
      <NavBar account={account} setAccount={setAccount} />
      <div className={styles.container}>
        <h1 className={styles.title}>Cutomize your business page!</h1>
        <p className={styles.subtitle}>
          Get more supporters by creating a strong profile on LocoMoco.
        </p>
        <div className={styles.preview}>
          <div
            className={styles.backgroundPreview}
            onClick={() => uploadImage()}
            style={{
              backgroundImage: `url(${bannerURL})`,
            }}
          >
            <input
              type="file"
              id="file"
              ref={inputFile}
              style={{ display: "none" }}
              onChange={(e) => onImageUpload(e)}
            />
            <input
              className={styles.inputPreview}
              placeholder="Placeholder"
              value={title}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={styles.textContainer}>
            <p className={styles.previewTitle}>who we are</p>
            <input
              className={styles.descriptionPreview}
              placeholder="Placeholder"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className={styles.previewTitle}>how much to raise?</p>
            <input
              className={styles.descriptionPreview}
              placeholder="$10000"
              value={moneyGoal}
              onChange={(e) => setMoneyGoal(e.target.value)}
            />
          </div>
        </div>
        <div
          className={styles.button}
          onClick={() => onCreate()}
          style={{
            opacity: loading || chainID !== 1666700000 ? "0.7" : "1",
            pointerEvents: loading || chainID !== 1666700000 ? "none" : "auto",
          }}
        >
          Complete Profile
        </div>
        {complete && <div className={styles.complete}>Complete!</div>}
      </div>
    </div>
  );
}
