import React, { useEffect } from "react";

import { useGlobalContext } from "../../context/GlobalContext";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

function History() {
  const { transactionHistory, error, setError } = useGlobalContext();

  const [...history] = transactionHistory();

  return (
    <div className="max-h-full h-[700x]">
      <ScrollArea className="max-h-screen  w-48 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">History</h4>
          {history.map((transaction, index) => (
            <div key={index} className="text-sm">
              {transaction.title} - {transaction.amount}$
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default History;

