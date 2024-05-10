import React, { useEffect, useState } from "react";

import AssetChart from "./AssetChart";
import { ContextProvider, useGlobalContext } from "../../context/GlobalContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";


function AssetAnalytics({ id }) {
    const { getAsset, asset, setError, error } = useGlobalContext();
    console.log("id:", id);
    const [open, setOpen] = useState(0)

    useEffect(() => {    
      getAsset(id);
    }, [
      open, id
    ]);

   
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() =>{ setOpen(1), console.log(open)}} >analytic</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{asset.name} :name</DialogTitle>
          <DialogDescription>
            {asset.current_price} :price
          </DialogDescription>
        </DialogHeader>
        <AssetChart />
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={() => {setOpen(), console.log(open)}}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AssetAnalytics;
