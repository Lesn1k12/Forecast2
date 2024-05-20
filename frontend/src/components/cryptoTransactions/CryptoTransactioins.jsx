import {useState} from "react";
import { Button } from "@/components/ui/button";
import SendTransaction from "./SendTransaction";
import WalletComponent from "../wallet/WalletComponent";
import { usePubkey } from "@/hooks/usePubkey";
import Wallet from "../wallet/Wallet";

function CryptoTransactioins() {

  return (
    <Wallet>
      <div className="flex flex-col">
        <SendTransaction />
        <WalletComponent />
      </div>
    </Wallet>
  );
}

export default CryptoTransactioins;
