import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalContext";
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

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function TransactionChart() {
  const { getTransaction, incomes, expenses, error, setError } =
    useGlobalContext();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    getTransaction();
  }, []);

  useEffect(() => {
    const combinedData = [
      ...incomes.map((income) => ({
        time: income.time,
        amount: income.amount,
        type: "income",
      })),
      ...expenses.map((expense) => ({
        time: expense.time,
        amount: expense.amount,
        type: "expense",
      })),
    ];

    combinedData.sort((a, b) => new Date(a.time) - new Date(b.time));

    setChartData(combinedData);
  }, [incomes, expenses]);

  return (
    <Card className="w-full mb-5 h-[50%] pb-0" style={{ width: "100%" }}>
      <CardHeader>
        <div>Transaction Chart</div>
      </CardHeader>
      <CardContent className="pb-0">
          <ResponsiveContainer width="100%" height={210}>
            <LineChart
              width={500}
              height={200}
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                connectNulls
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </LineChart>
          </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default TransactionChart;
