import {useState} from 'react'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
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


function CreateAssets() {
    const { createAsset, setError, error } =useGlobalContext();

    const [inputState, setInputState] = useState({
        name: '',
        price: '',
        date: '',
        category: ''
      });
    
      const { name, price, date, category} = inputState;
    
      const handleInput = (name) => (e) => {
        setInputState({ ...inputState, [name]: e.target.value });
        setError("");
      };
    
      const handleSubmit = e => {
        e.preventDefault();
        createAsset({ ...inputState });
        setInputState({
          name: '',
          price: '',
          date: '',
          category: '',
        });
      };
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline">add new active</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>New active:</DialogTitle>
            <DialogDescription>
                Add information about your active
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                Title
                </Label>
                <Input 
                name="name"
                id="name" 
                defaultValue="name" 
                className="col-span-3"
                value={name}
                onChange={handleInput('name')}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cost" className="text-right">
                Cost
                </Label>
                <Input
                name="price"
                id="price"
                defaultValue="price"
                className="col-span-3"
                value={price}
                onChange={handleInput("price")}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cost" className="text-right">
                    Category
                </Label>
                <Select
                  onValueChange={(value) =>
                    setInputState((prev) => ({
                      ...prev,
                      category: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue
                      required
                      value={category}
                      name="category"
                      id="category"
                      onChange={handleInput("category")}
                      placeholder="category"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="f">finances</SelectItem>
                    <SelectItem value="c">crupto</SelectItem>
                    <SelectItem value="i">immovability</SelectItem>
                    <SelectItem value="t">technique</SelectItem>
                    <SelectItem value="ip">intellectual property</SelectItem>
                    <SelectItem value="pp">physical property</SelectItem>
                    <SelectItem value="inv">investmensts</SelectItem>
                    <SelectItem value="o">other</SelectItem>
                  </SelectContent>
                </Select>
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
                <Button type="button" variant="secondary" onClick={handleSubmit} >
                Save changes
                </Button>
            </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default CreateAssets