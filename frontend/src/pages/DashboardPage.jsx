import React, { useState } from "react";
import Dashboard from "../components/dashboard/Dashboard.jsx";
import Sidebar from "@/components/sidebar/Sidebar.jsx";
import BottomNavBar from "@/components/sidebar/BottomNavBar";
import Actives from "@/components/actives/Actives.jsx";
import MyCalendar from "@/components/calendar/Calendar.jsx";
import Transaction from "@/components/transactions/Transaction.jsx";
import CryptoTransactioins from "@/components/cryptoTransactions/CryptoTransactioins.jsx";
import { ContextProvider, useGlobalContext } from '../context/GlobalContext';

export default function DashboardPage() {
  const [active, setActive] = useState(1);

  const displayData = () => {
    switch (active) {
      case 1:
        return <Dashboard />;
      case 2:
        return <Actives />;
      case 3:
        return <MyCalendar />;
      case 4:
        return <Transaction />;
      case 5:
        return <CryptoTransactioins />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ContextProvider>
      <div className=" gap-4 h-screen w-screen flex">
        <div className="p-10">
          <Sidebar active={active} setActive={setActive} />
          <BottomNavBar active={active} setActive={setActive} />
        </div>

        <div className="max-h-screen h-screen w-full py-10 pr-10 overflow-x-hidden">
          <main>{displayData()}</main>
        </div>
      </div>
    </ContextProvider>
  );
}
