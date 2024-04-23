import {React, useEffect, useState} from "react";
import Wallet from "./Wallet"; 
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { toast } from 'react-toastify'
import '@solana/wallet-adapter-react-ui/styles.css'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {useNavigate} from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";

  

function WalletComponent() {
    const { connect } = useWallet();
    const navigate = useNavigate();
    const [walletConnected, setWalletConnected] = useState(false);

    useEffect(() => {
        if(connect && !walletConnected) {
            setWalletConnected(true);
            navigate('/dashboard');
            toast.success("Wallet Connected!");
        }
    }, [connect, navigate, walletConnected]);
        
    return (
        <Wallet>
            <div className="h-screen display: flex justify-center place-content: center">
                <Card className="w-[350px] rounded-2xl my-auto">
                    <CardHeader>
                        <CardTitle>Just Connect Your Wallet!</CardTitle>
                        <CardDescription>Phantome</CardDescription>
                    </CardHeader>
                    <CardContent className="display: flex justify-center place-content: center">
                        <WalletMultiButton />
                    </CardContent>
                </Card>
            </div>
        </Wallet>
    )
}

export default WalletComponent;