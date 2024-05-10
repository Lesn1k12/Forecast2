import {React, useState} from 'react'
import { Link } from 'react-router-dom'

import Expenses from './Expenses'
import Incomes from './Incomes'
import History from './History'
import TransactionChart from './TransactionChart'
import TransactionPredict from './TransactionPredict'

import { ContextProvider, useGlobalContext } from '../../context/GlobalContext';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SendAnalitics from './SendAnalitics';
import { Button } from "@/components/ui/button";

function Transaction() {
  return (
    <ContextProvider>
      <div className="flex flex-row gap-4">
        <div className="flex-col w-[350px]">
          <Tabs defaultValue="incomes" className="w-[350px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="incomes" >Incomes</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>
            <TabsContent value="incomes"><Incomes /></TabsContent>
            <TabsContent value="expenses"><Expenses /></TabsContent>
          </Tabs>
          <Button className="w-[350px] mt-3"><SendAnalitics /></Button>
        </div>
        <div className="flex-col w-auto">
          <History />
        </div>
        <div className="flex-col w-full gap-4">
          <TransactionChart />
          <TransactionPredict />
        </div>
      </div>
    </ContextProvider>
  )
}

export default Transaction