import { useContext, useState } from 'react';
import { CalendarIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useGlobalContext } from "../../context/GlobalContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"


function Incomes() {
  const { addTransaction, error, setError } = useGlobalContext();
  const [inputState, setInputState] = useState({
    category: '',
    amount: '',
    time: '',
    title: '',
    description: '',
    currency: 'zl'
  });
  const [date, setDate] = useState()

  const { category, amount, time, title, description, currency } = inputState;


  const handleInput = name => e => {
    setInputState({ ...inputState, [name]: e.target.value });
    setError('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    addTransaction({ ...inputState });
    setInputState({
      category: '',
      amount: '',
      time: '',
      title: '',
      description: '',
      currency: 'zl'
    });
  };



  return (
    <div>
      <Card className="w-[350px] rounded-2xl my-auto">
        <CardHeader>
          <CardTitle>Incomes</CardTitle>
          <CardDescription>type your incomes</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name"></Label>
                <Input 
                  className=" focus:border-blue-400"
                  id="title" 
                  type="text" 
                  placeholder="title" 
                  name = "title"
                  value={title}
                  autoComplete="off"
                  onChange={handleInput('title')}/>
                <Input 
                  className=" focus:border-blue-400"
                  id="amount" 
                  type="text" 
                  placeholder="amount" 
                  name = "amount"
                  value={amount}
                  autoComplete="off"
                  onChange={handleInput('amount')}
                  required/>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue required value={category} name="category" id="category" onChange={handleInput('category')} placeholder='category'/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">salary</SelectItem>
                    <SelectItem value="freelancing">freelancing</SelectItem>
                    <SelectItem value="investments">investments</SelectItem>
                    <SelectItem value="stocks">stocks</SelectItem>
                    <SelectItem value="bitcoin">bitcoin</SelectItem>
                    <SelectItem value="bank">bank</SelectItem>
                    <SelectItem value="youtube">youtube</SelectItem>
                    <SelectItem value="other">other</SelectItem>
                  </SelectContent>
                </Select>
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
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Textarea 
                className="resize-none"
                placeholder="Type your message here."
                name = "description"
                value={description}
                autoComplete="off"
                onChange={handleInput('description')}
                require />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button className="shadow-sm active:bg-blue-300 rounded-xl" onClick={handleSubmit}>Add income</Button>
        </CardFooter>
      </Card>
      
    </div>
  );
}

export default Incomes;