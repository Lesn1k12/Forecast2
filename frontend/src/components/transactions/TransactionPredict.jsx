import React, { useEffect, useState } from "react";

import { useGlobalContext } from "../../context/GlobalContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function TransactionPredict() {
  const { getPredict, predict, error, setError } = useGlobalContext();
  const [data, setData] = useState([]);

  useEffect(() => {
    getPredict();
    console.log("fdsadf", predict);
    setData(predict);
  }, []);

  
  console.log(data);
  return (
    <Card className="w-full mb-4 h-[50%]" style={{ width: "100%" }}>
      <CardHeader>
        <div>Transaction Predict</div>
      </CardHeader>
      <CardContent className="px-4">
        <div className="w-full">
          <ResponsiveContainer width="100%" height={210}>
            <LineChart width={500} height={200} data={predict}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default TransactionPredict;
