import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FaChartLine, FaDollarSign, FaUsers, FaTasks } from 'react-icons/fa';



import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";


const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

const pieData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Dashboard() {

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {/* KPI Cards */}
      <Card className='shadow-lg rounded-lg p-4 flex items-center'>
        <FaDollarSign className="text-4xl text-green-500 mr-4" />
        <div>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>$12,345</CardDescription>
        </div>
      </Card>
      <Card className='shadow-lg rounded-lg p-4 flex items-center'>
        <FaUsers className="text-4xl text-blue-500 mr-4" />
        <div>
          <CardTitle>New Users</CardTitle>
          <CardDescription>1,234</CardDescription>
        </div>
      </Card>
      <Card className='shadow-lg rounded-lg p-4 flex items-center'>
        <FaTasks className="text-4xl text-purple-500 mr-4" />
        <div>
          <CardTitle>Tasks Completed</CardTitle>
          <CardDescription>567</CardDescription>
        </div>
      </Card>
      <Card className='shadow-lg rounded-lg p-4 flex items-center'>
        <FaChartLine className="text-4xl text-red-500 mr-4" />
        <div>
          <CardTitle>Conversion Rate</CardTitle>
          <CardDescription>12.34%</CardDescription>
        </div>
      </Card>

      {/* Line Chart */}
      <Card className='shadow-lg rounded-lg'>
        <CardHeader>
          <CardTitle>Line Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart width={300} height={200} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </CardContent>
      </Card>
      
      {/* Bar Chart */}
      <Card className='shadow-lg rounded-lg'>
        <CardHeader>
          <CardTitle>Bar Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart width={300} height={200} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#8884d8" />
            <Bar dataKey="uv" fill="#82ca9d" />
          </BarChart>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className='shadow-lg rounded-lg'>
        <CardHeader>
          <CardTitle>Pie Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart width={300} height={200}>
            <Pie
              data={pieData}
              cx={150}
              cy={100}
              innerRadius={40}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card className='shadow-lg rounded-lg'>
        <CardHeader>
          <CardTitle>Radar Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <RadarChart outerRadius={80} width={300} height={200} data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            <Radar name="pv" dataKey="pv" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Radar name="uv" dataKey="uv" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            <Legend />
          </RadarChart>
        </CardContent>
      </Card>

      {/* Progress Bar Example */}
      <Card className='shadow-lg rounded-lg col-span-1 md:col-span-2'>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='mb-4'>
            <p>Task Completion</p>
            <Progress value={75} />
          </div>
          <div className='mb-4'>
            <p>Project Progress</p>
            <Progress value={50} />
          </div>
          <div>
            <p>Revenue Target</p>
            <Progress value={60} />
          </div>
        </CardContent>
      </Card>

      {/* Table Example */}
      <Card className='shadow-lg rounded-lg col-span-1 md:col-span-2'>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2024-06-16</TableCell>
                <TableCell>#123456</TableCell>
                <TableCell>$150.00</TableCell>
                <TableCell>Completed</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-06-15</TableCell>
                <TableCell>#123457</TableCell>
                <TableCell>$200.00</TableCell>
                <TableCell>Pending</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-06-14</TableCell>
                <TableCell>#123458</TableCell>
                <TableCell>$50.00</TableCell>
                <TableCell>Failed</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      
    </div>
  );
}

export default Dashboard;
