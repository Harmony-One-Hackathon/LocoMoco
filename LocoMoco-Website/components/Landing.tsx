import Image from "next/image";
import Link from "next/link";

import styles from "../styles/Landing.module.css";

const Landing = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h1 className={styles.title}>
          support local businesses, one nft at a time.
        </h1>
        <p className={styles.subtitle}>
          Creating membership passes and perks with the Harmony One blockchain.{" "}
        </p>
        <div className={styles.buttonContainer}>
          <div className={styles.button}>
            <Link href="/business">I am a Business</Link>
          </div>
          <div className={styles.button}>
            <Link href="/explore">I am a Supporter</Link>
          </div>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <Image
          src="/landing.png"
          alt="Picture of the author"
          width={500}
          height={640}
        />
        <div className={styles.toolTip}>
          <div className={styles.toolTipText}>
            Currently Servicing
            <br />
            John's Pizza Hut
          </div>
          <div className={styles.arrow}>{">"}</div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
