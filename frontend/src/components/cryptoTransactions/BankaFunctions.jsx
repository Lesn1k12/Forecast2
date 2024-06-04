import {
    Transaction,
    TransactionInstruction,
    SystemProgram,
    Keypair,
    PublicKey,
    Connection,
    PUBLIC_KEY_LENGTH,
  } from '@solana/web3.js';
import { BN } from "bn.js";
import { Buffer } from 'buffer';
import * as anchor from '@project-serum/anchor'
import idl from "../../../../backend/sukasuka/target/idl/sukasuka.json";
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';


const PROGRAM_ID = new PublicKey(idl.metadata.address);

const connect = new Connection('https://api.devnet.solana.com', 'confirmed');

export const createMoneyBox = async (connection, wallet, programId, name, amount) => {
  try {
    // Генеруємо нову пару ключів для MoneyBox
    const moneyBox = Keypair.generate();
    console.log("Generated MoneyBox PublicKey:", moneyBox.publicKey.toString());

    // Створюємо інструкцію
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: moneyBox.publicKey, isSigner: true, isWritable: true },
        { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: new PublicKey(programId),
      data: Buffer.from(Uint8Array.of(0, ...new BN(amount).toArray("le", 8))),
    });
    console.log("Created Instruction:", instruction);

    // Створюємо транзакцію і додаємо інструкцію
    const transaction = new Transaction().add(instruction);
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    console.log("Created Transaction:", transaction);

    // Частково підписуємо транзакцію з ключовою парою MoneyBox
    transaction.partialSign(moneyBox);
    console.log("Transaction partially signed by MoneyBox");

    // Підписуємо транзакцію з гаманцем
    const signedTransaction = await wallet.signTransaction(transaction);
    console.log("Transaction signed by wallet");

    // Додаємо підпис від moneyBox до підписаного гаманцем транзакції
    signedTransaction.partialSign(moneyBox);
    console.log("Transaction fully signed");

    // Симуляція транзакції для діагностики
    const simulateResult = await connection.simulateTransaction(signedTransaction);
    console.log("Simulation Result:", simulateResult);

    if (simulateResult.value.err) {
      throw new Error(`Transaction simulation failed: ${JSON.stringify(simulateResult.value.err)}`);
    }

    // Серіалізуємо транзакцію і відправляємо її
    const rawTransaction = signedTransaction.serialize();
    console.log("Serialized Transaction:", rawTransaction.toString('base64'));

    // Відправляємо сирий транзакцію
    const signature = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: false,
      preflightCommitment: 'processed'
    });
    console.log("Transaction Signature:", signature);

    // Підтверджуємо транзакцію
    const confirmation = await connection.confirmTransaction(signature, 'processed');
    console.log("Transaction confirmation:", confirmation);

    // Перевірка підтвердження транзакції
    if (confirmation.value.err) {
      throw new Error(`Transaction confirmation failed: ${JSON.stringify(confirmation.value.err)}`);
    }
    console.log("Transaction confirmed");

    return moneyBox;
  } catch (error) {
    console.error("Error occurred while creating MoneyBox:", error);
    throw error;
  }
};

// export const createMoneyBox = async (wallet, programId, name, amount) => {
//   const { connection } = useConnection()
//   const { publicKey } = useWallet()
//   const anchorWallet = useAnchorWallet()

//   const program = useMemo(() => {
//     if (anchorWallet) {
//         const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions())
//         return new anchor.Program(Idl, PROGRAM_ID, provider)
//     }
// }, [connection, anchorWallet])

//   if (program &&  publicKey ){
//     try{
//       const [moneyBox, _] = await findProgramAddressSync([Buffer.from(utf8.encode("moneyBox"))], program.programId)
//       const instruction = program.instruction.create(new BN(amount), {
//         accounts: {
//           moneyBox: moneyBox,
//           user: publicKey,
//           systemProgram: SystemProgram.programId
//         }
//       })
//       await program.rpc.create(new BN(amount), {
//         accounts: {
//           moneyBox: moneyBox,
//           user: publicKey,
//           systemProgram: SystemProgram.programId
//         }
//       })
//       console.log("MoneyBox created successfully")
//       return moneyBox
//     }catch (error){
//       console.log("Error occurred while creating MoneyBox:", error)
//     }
//   }


// }

export const donateToMoneyBox = async (
  connection,
  wallet,
  programId,
  moneyBoxPublicKey,
  amount
) => {
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: moneyBoxPublicKey, isSigner: false, isWritable: true },
      { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: programId,
    data: Buffer.from(Uint8Array.of(1, ...amount.toArray("le", 8))),
  });

  const transaction = new Transaction().add(instruction);
  const signature = await wallet.sendTransaction(transaction, connection);

  await connection.confirmTransaction(signature, "processed");
};

export const withdrawFromMoneyBox = async (
  connection,
  wallet,
  programId,
  moneyBoxPublicKey,
  amount
) => {
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: moneyBoxPublicKey, isSigner: false, isWritable: true },
      { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
    ],
    programId: programId,
    data: Buffer.from(Uint8Array.of(2, ...amount.toArray("le", 8))),
  });

  const transaction = new Transaction().add(instruction);
  const signature = await wallet.sendTransaction(transaction, connection);
  await connection.confirmTransaction(signature, "processed");
};

// import {
//   Connection,
//   PublicKey,
//   Transaction,
//   TransactionInstruction,
//   SystemProgram,
//   Keypair,
// } from '@solana/web3.js';
// import bs58 from 'bs58';
// import { BN } from "bn.js";

// // Підключення до Devnet


// // Ваша програма ID (ідентифікатор програми)
// const programId = new PublicKey('BBWxojjkikdbGWPQThCDSC7tHP5AYc6GMPcsNRPvzAjP');

// // Адреси програм системи
// const SYSTEM_PROGRAM_ID = SystemProgram.programId;

// // Одержання публічного ключа користувача з wallet (наприклад, Phantom)
// const getProvider = async () => {
//   if ("solana" in window) {
//     await window.solana.connect();
//     const provider = window.solana;
//     return provider;
//   } else {
//     console.error("Solana object not found! Get a Phantom Wallet");
//   }
// };

// export const createMoneyBox = async (name, goal) => {
//   const provider = await getProvider();
//   const user = provider.publicKey;

//   // Генерація нового облікового запису MoneyBox
//   const moneyBox = Keypair.generate();

//   const createIx = new TransactionInstruction({
//     keys: [
//       { pubkey: moneyBox.publicKey, isSigner: true, isWritable: true },
//       { pubkey: user, isSigner: true, isWritable: false },
//       { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
//     ],
//     programId,
//     data: Buffer.from(Uint8Array.of(0, ...new TextEncoder().encode(name), ...new BN(goal).toArray('le', 8))),
//   });

//   const transaction = new Transaction().add(
//     SystemProgram.createAccount({
//       fromPubkey: user,
//       newAccountPubkey: moneyBox.publicKey,
//       lamports: await connection.getMinimumBalanceForRentExemption(1024 * 5),
//       space: 1024 * 5,
//       programId,
//     }),
//     createIx
//   );

//   transaction.feePayer = user;
//   transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
//   transaction.sign(moneyBox);

//   const signedTransaction = await provider.signTransaction(transaction);
//   const signature = await connection.sendRawTransaction(signedTransaction.serialize());
//   await connection.confirmTransaction(signature, 'confirmed');

//   return moneyBox.publicKey.toString();
// };

// export const donateToMoneyBox = async (moneyBoxPubkey, amount) => {
//   const provider = await getProvider();
//   const donater = provider.publicKey;

//   const donateIx = new TransactionInstruction({
//     keys: [
//       { pubkey: new PublicKey(moneyBoxPubkey), isSigner: false, isWritable: true },
//       { pubkey: donater, isSigner: true, isWritable: true },
//       { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
//     ],
//     programId,
//     data: Buffer.from(Uint8Array.of(1, ...new BN(amount).toArray('le', 8))),
//   });

//   const transaction = new Transaction().add(donateIx);

//   transaction.feePayer = donater;
//   transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

//   const signedTransaction = await provider.signTransaction(transaction);
//   const signature = await connection.sendRawTransaction(signedTransaction.serialize());
//   await connection.confirmTransaction(signature, 'confirmed');

//   return signature;
// };

// export const withdrawFromMoneyBox = async (moneyBoxPubkey, amount) => {
//   const provider = await getProvider();
//   const reciver = provider.publicKey;

//   const withdrawIx = new TransactionInstruction({
//     keys: [
//       { pubkey: new PublicKey(moneyBoxPubkey), isSigner: false, isWritable: true },
//       { pubkey: reciver, isSigner: true, isWritable: true },
//     ],
//     programId,
//     data: Buffer.from(Uint8Array.of(2, ...new BN(amount).toArray('le', 8))),
//   });

//   const transaction = new Transaction().add(withdrawIx);

//   transaction.feePayer = reciver;
//   transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

//   const signedTransaction = await provider.signTransaction(transaction);
//   const signature = await connection.sendRawTransaction(signedTransaction.serialize());
//   await connection.confirmTransaction(signature, 'confirmed');

//   return signature;
// };


