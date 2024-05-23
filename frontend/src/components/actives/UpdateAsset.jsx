import { useState } from "react";
import { ContextProvider, useGlobalContext } from "../../context/GlobalContext";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../../lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

function UpdateAsset(id) {
  const { editAsset, setError, error } = useGlobalContext();

  const [inputState, setInputState] = useState({
    new_price: "",
    date: null,
  });

  const { new_price, date } = inputState;

  const handleInput = (field) => (e) => {
    setInputState({ ...inputState, [field]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!new_price || !date) {
      setError("Please fill out all fields");
      return;
    }

    editAsset(id.id, new_price, date);
    setInputState({
      new_price: "",
      date: null,
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Update active</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update active:</DialogTitle>
          <DialogDescription>add new data</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cost" className="text-right">
              Cost
            </Label>
            <Input
              name="new_price"
              id="new_price"
              defaultValue="new price"
              className="col-span-3"
              value={new_price}
              onChange={handleInput("new_price")}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Time
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  value="date"
                  selected={date}
                  onSelect={(newDate) => {
                    setInputState({ ...inputState, date: newDate });
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={handleSubmit}>
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateAsset;
