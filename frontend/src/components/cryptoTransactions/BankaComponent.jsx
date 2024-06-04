import React, { useState, useEffect, useMemo } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";
import {
  createMoneyBox,
  donateToMoneyBox,
  withdrawFromMoneyBox,
} from "./BankaFunctions";
import idl from "../../../../backend/sukasuka/target/idl/sukasuka.json";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

import { Card, CardContent } from "../ui/card";
import { Button } from "@/components/ui/button";

import Wallet from "../wallet/Wallet";

const programId = new PublicKey(idl.metadata.address);

function BankaComponent() {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [moneyBox, setMoneyBox] = useState(null);

  const walletInstance = useMemo(() => new PhantomWalletAdapter(), []);

  const handleCreate = async () => {
    console.log("Creating MoneyBox...");
    if (!connection || !publicKey || !signTransaction) {
      console.error("Connection або wallet не визначено");
      return;
    }
    console.log(
      "Creating MoneyBox...:",
      "connection:",
      connection,
      "wallet:",
      { publicKey, signTransaction },
      "program:",
      programId
    );
    try {
      const newMoneyBox = await createMoneyBox(
        connection,
        { publicKey, signTransaction },
        programId,
        "My MoneyBox",
        2000000000
      );
      setMoneyBox(newMoneyBox);
    } catch (error) {
      console.error("Виникла помилка при створенні MoneyBox", error);
    }
  };

  const handleDonate = async () => {
    if (!moneyBox || !connection || !wallet) {
      console.error("MoneyBox, connection, або wallet не визначено");
      return;
    }
    const amount = new BN(10000000);
    await donateToMoneyBox(
      connection,
      { publicKey, signTransaction },
      programId,
      moneyBox.publicKey,
      amount
    );
  };

  const handleWithdraw = async () => {
    if (!moneyBox || !connection || !wallet) {
      console.error("MoneyBox, connection, або wallet не визначено");
      return;
    }
    const amount = new BN(100000);
    await withdrawFromMoneyBox(
      connection,
      { publicKey, signTransaction },
      programId,
      moneyBox.publicKey,
      amount
    );
  };

  useEffect(() => {
    const connectWallet = async () => {
      try {
        await walletInstance.connect();
        console.log("Wallet connected:", walletInstance);

        const connection = new Connection("https://api.devnet.solana.com");
        console.log("Connection established:", connection);

        setConnection(connection);
        setWallet(walletInstance);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    };

    connectWallet();
  }, [walletInstance]);

  return (
    <Wallet>
      <Card>
        <CardContent className="flex flex-col">
          <Button onClick={handleCreate} className="m-2">
            Create MoneyBox
          </Button>
          <Button onClick={handleDonate} disabled={!moneyBox} className="m-2">
            Donate to MoneyBox
          </Button>
          <Button onClick={handleWithdraw} disabled={!moneyBox} className="m-2">
            Withdraw from MoneyBox
          </Button>
        </CardContent>
      </Card>
    </Wallet>
  );
}

export default BankaComponent;
