import React, { useEffect } from "react";

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

  useEffect(() => {
    getPredict();
    console.log("предікт", predict);
  }, []);

  const data = [
    predict
  ];

  return (
    <Card className="w-full mb-4 h-[50%]" style={{ width: "100%" }}>
      <CardHeader>
        <div>Transaction Predict</div>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              width={500}
              height={200}
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                connectNulls
                type="monotone"
                dataKey="uv"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default TransactionPredict;
