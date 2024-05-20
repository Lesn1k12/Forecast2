import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePubkey } from "@/hooks/usePubkey";
import { set } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
];

// function SendTransaction() {
//   const {
//     amount,
//     setAmount,
//     receiver,
//     setReceiver,
//     transactionPurpose,
//     setTransactionPurpose,
//     doTransaction,
//   } = usePubkey();

//   const onAmountInput = (e) => {
//     e.preventDefault();
//     const newAmount = e.target.value;

//     setAmount(newAmount);

//     const input = document.querySelector("input#amount");
//     input.style.width = newAmount.length + "ch";
//   };

//   const onPay = async () => {
//     doTransaction({ amount, receiver, transactionPurpose });

//     setAmount(0);
//     setReceiver("");
//     setTransactionPurpose("");
//   };

//   return (
//     <>
//       <div className="relative flex flex-col items-center justify-center space-y-8">
//         <div className="flex items-center justify-center text-center text-7xl font-semibold text-[#00d54f]">
//           <input
//             className="w-12 outline-none"
//             id="amount"
//             name="amount"
//             type="number"
//             value={amount}
//             onChange={onAmountInput}
//             min={0}
//           />
//           <label htmlFor="amount">SOL</label>
//         </div>

//         <div className="flex w-full flex-col space-y-2">
//           <div className="flex rounded-lg border border-gray-200 p-4">
//             <label className="text-gray-300" htmlFor="receiver">
//               To:
//             </label>
//             <input
//               className="w-full pl-2 font-medium text-gray-600 placeholder-gray-300 outline-none"
//               id="receiver"
//               name="receiver"
//               type="text"
//               placeholder="Name, $Cashtag, SMS, Email"
//               value={receiver}
//               onChange={(e) => setReceiver(e.target.value)}
//             />
//           </div>

//           <div className="flex rounded-lg border border-gray-200 p-4">
//             <label className="text-gray-300" htmlFor="transactionPurpose">
//               For:
//             </label>
//             <input
//               className="w-full pl-2 font-medium text-gray-600 placeholder-gray-300 outline-none"
//               id="transactionPurpose"
//               name="transactionPurpose"
//               type="text"
//               placeholder="Dinner, Rent, etc."
//               value={transactionPurpose}
//               onChange={(e) => setTransactionPurpose(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="flex w-full space-x-1">
//           <button
//             onClick={onPay}
//             className="w-full rounded-lg bg-[#00d54f] py-3 px-12 text-white hover:bg-opacity-70"
//           >
//             Pay
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

function SendTransaction() {
  const {
    amount,
    setAmount,
    receiver,
    setReceiver,
    transactionPurpose,
    setTransactionPurpose,
    doTransaction,
  } = usePubkey();
  
  function onClikk (adjustment){
    setAmount(Math.max(0, Math.min(400, amount + adjustment)));
  }

  const onAmountInput = (e) => {
    e.preventDefault();
    const newAmount = e.target.value;

    setAmount(newAmount);

    const input = document.querySelector("input#amount");
    input.style.width = newAmount.length + "ch";
  };

  const onPay = async () => {
    doTransaction({ amount, receiver, transactionPurpose });

    setAmount(0);
    setReceiver("");
    setTransactionPurpose("");
  };
  return (
    <div className="flex flex-col">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">Crypto Transaction</h1>
        </CardHeader>
        <CardContent>
          <Label htmlFor="receiver">To:</Label>
          <Input
            className="w-full pl-2 font-medium text-gray-600 placeholder-gray-300 outline-none"
            id="receiver"
            name="receiver"
            type="text"
            placeholder="Name, $Cashtag, SMS, Email"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
          <Label>For:</Label>
          <Input
            className="w-full pl-2 font-medium text-gray-600 placeholder-gray-300 outline-none"
            id="transactionPurpose"
            name="transactionPurpose"
            type="text"
            placeholder="Dinner, Rent, etc."
            value={transactionPurpose}
            onChange={(e) => setTransactionPurpose(e.target.value)}
          />
          <Label htmlFor="amount">Amount:</Label>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Set amount</Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Type amount</DrawerTitle>
                  <DrawerDescription>
                    Set, how many you want to sent.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-full"
                      onClick={() => onClikk(-1)}
                      disabled={amount <= 1}
                    >
                      <Minus className="h-4 w-4" />
                      <span className="sr-only">Decrease</span>
                    </Button>
                    <div className="flex-1 text-center">
                      <div className="text-7xl font-bold tracking-tighter">
                        {amount}
                      </div>
                      <div className="text-[0.70rem] uppercase text-muted-foreground">
                        Solana
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-full"
                      onClick={() => onClikk(1)}
                      disabled={amount >= 400}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Increase</span>
                    </Button>
                  </div>
                  <div className="mt-3 h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data}>
                        <Bar
                          dataKey="goal"
                          style={{
                            fill: "hsl(var(--foreground))",
                            opacity: 0.9,
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <DrawerFooter>
                  <Button>Submit</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </CardContent>
        <CardFooter>
          <Button
            onClick={onPay}
            className="w-full rounded-lg py-3 px-12 text-white hover:bg-opacity-70"
          >
            Pay
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SendTransaction;
