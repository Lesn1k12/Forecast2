import { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalContext";
import Wallet from "../wallet/Wallet";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePubkey } from "@/hooks/usePubkey";

function Profile() {
  const { userData, getUser } = useGlobalContext();
  const { connected, publicKey } = useWallet();
  const { userAdress } = usePubkey();
  const [publkey, setPublkey] = useState("not connected!");

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    setPublkey(userAdress)
  }, [userAdress]);

  return (
      <div className="grid grid-rows-2 p-2 w-[75%]">
        <span className="font-semibold truncate">{userData.username}</span>
        <span className="text-xs text-gray-600 truncate">{userData.email}</span>
        <span className="text-xs text-gray-600 truncate">{publkey}</span>
      </div>
  );
}

export default Profile;
