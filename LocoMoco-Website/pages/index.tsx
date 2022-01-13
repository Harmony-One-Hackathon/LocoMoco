import React, { useState } from "react";

import NavBar from "../components/NavBar";
import Landing from "../components/Landing";
import InformationSection from "../components/InformationSection";

export default function Home() {
  // Accounts
  const [account, setAccount] = useState("");

  return (
    <div>
      <NavBar account={account} setAccount={setAccount} />
      <Landing />
      <InformationSection />
    </div>
  );
}
