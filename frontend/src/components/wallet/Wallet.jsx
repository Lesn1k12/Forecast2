import { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';


const Wallet = ({children}) => {
    const network = WalletAdapterNetwork.Devnet;

    const endpoint = useMemo(()=>{
        if(network === WalletAdapterNetwork.Devnet){
            return 'https://soft-palpable-snow.solana-devnet.quiknode.pro/f5bb65fc43b357724cfc02ea37c0c27b953c3426/'
        }
        return clusterApiUrl(network);
    },[network]);

    const wallets = useMemo(()=> [new PhantomWalletAdapter()],[network]);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default Wallet