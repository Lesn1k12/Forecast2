import { useEffect, useState, useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import BigNumber from "bignumber.js";

export const usePubkey = () => {
    const {connected, publicKey, sendTransaction } = useWallet();
    const[userAdress, setUserAdress] = useState("adress");
    const[amount, setAmount] = useState(0);

    const{ connection } = useConnection();



    useEffect(() => {
        if(connected) {
            setUserAdress(publicKey.toBase58());
        }
    }, [connected]);

    const makeTransaction = async (fromWallet, toWallet, amount, reference) => {
        const network = WalletAdapterNetwork.Devnet;
        const endpoint = useMemo(()=>{
            if(network === WalletAdapterNetwork.Devnet){
                return 'https://soft-palpable-snow.solana-devnet.quiknode.pro/f5bb65fc43b357724cfc02ea37c0c27b953c3426/'
            }
            return clusterApiUrl(network);
        },[network]);

        connection = new Connection(endpoint);

        const { blockhash } = await connection.getRecentBlockhash('finalized');

        const transaction = new Transaction().add({
            recentBlockhash: blockhash,
            feePayer: fromWallet.publicKey,
        });

        const transferInstruction = SystemProgram.transfer({
            fromPubkey: fromWallet.publicKey,
            toPubkey: toWallet,
            lamports: (amount * LAMPORTS_PER_SOL).toNumber(),
        });
        
    
        transferInstruction.keys.push({
            pubkey: reference,
            isSigner: false,
            isWritable: false,
        })

        transaction.add(transferInstruction);

        return transaction;
    }

    const doTransaction = async ({amount, receiver, transactionPurpose}) => {
        const fromWallet = publicKey
        const toWallet = new PublicKey(receiver);
        const bnAmount = new BigNumber(amount);
        const reference = Keypair.generate().publicKey;
        const transaction = await makeTransaction(fromWallet, toWallet, bnAmount, reference);

        const txnHash  = await sendTransaction(transaction, connection);
        console.log(txnHash)

    }

    return {connected, publicKey, userAdress, setUserAdress, doTransaction, amount, setAmount};
}