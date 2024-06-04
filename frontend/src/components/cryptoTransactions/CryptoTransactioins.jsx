import { useState } from "react";
import { Button } from "@/components/ui/button";
import SendTransaction from "./SendTransaction";
import WalletComponent from "../wallet/WalletComponent";
import { usePubkey } from "@/hooks/usePubkey";
import Wallet from "../wallet/Wallet";
import BankaComponent from "./BankaComponent";

function CryptoTransactioins() {
  return (

      <Wallet>
        <BankaComponent />
      </Wallet>

    //   <div className="flex flex-col">
    //     <SendTransaction />
    //     <WalletComponent />
    //   </div>
  );
}

export default CryptoTransactioins;
