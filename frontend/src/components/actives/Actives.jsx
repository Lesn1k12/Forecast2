import React, { useState, useEffect } from "react";
import { ContextProvider, useGlobalContext } from "../../context/GlobalContext";
import AssetAnalytics from "./AssetAnalytics";
import CreateAssets from "./CreateAssets";
import UpdateAsset from "./UpdateAsset";
import DeleteAsset from "./DeleteAsset";
import moment from "moment";
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Actives() {
  const {deleteAsset, editAsset, getLastAsset, getAssetHistory, getAllAssets, allAssets, setError, error } = useGlobalContext();

  useEffect(() => {
    getAllAssets();
    console.log("активи", allAssets);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row">
          <CardTitle>Actives</CardTitle>
          <CreateAssets />
        </CardHeader>
        <CardContent></CardContent>
      </Card>
      <Card>
        <Table>
          <TableCaption>A list of your assets.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Last date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Increase</TableHead>
              <TableHead>Analitics</TableHead>
              <TableHead>Edit</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {allAssets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="font-medium">{asset.name}</TableCell>
              <TableCell>{asset.date}</TableCell>
              <TableCell>{asset.category}</TableCell>
              <TableCell>{asset.price_change}%</TableCell>
              <TableCell><AssetAnalytics id={asset.id} /></TableCell>
              <TableCell><UpdateAsset id={asset.id} /></TableCell>
              <TableCell className="text-right">{asset.current_price}$</TableCell>
              <TableHead><DeleteAsset id={asset.id}/></TableHead>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}