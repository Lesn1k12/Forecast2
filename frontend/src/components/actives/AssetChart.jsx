import React, { useEffect } from "react";
import { ContextProvider, useGlobalContext } from "../../context/GlobalContext";

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

function AssetChart({id}) {
  const { getAssetHistory, assetHistory, setError, error } = useGlobalContext();

  useEffect(() => {
    getAssetHistory(id);
    console.log("assetHistory", assetHistory);
  }
  , [id]);

  const data = assetHistory.map((item) => {
    return {
      name: item.timestamp,
      uv: item.price,
    };
  });

  return (
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
  );
}

export default AssetChart;
