import Image from "next/image";

import styles from "../styles/InformationSection.module.css";

const InformationSection = () => {
  return (
    <div className={styles.container}>
      <h2>How does it work?</h2>
      <Image
        src="/how.png"
        alt="How does LocoMoco work?"
        width={900}
        height={200}
      />
    </div>
  );
};

export default InformationSection;
