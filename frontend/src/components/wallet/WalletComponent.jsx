import Wallet from "./Wallet"; 
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
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
  

function WalletComponent() {
    return (
        <Wallet>
            <div className="h-screen display: flex justify-center place-content: center">
                <Card className="w-[350px] rounded-2xl my-auto">
                    <CardHeader>
                        <CardTitle>Just Connect Your Wallet!</CardTitle>
                        <CardDescription>Phanotme</CardDescription>
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