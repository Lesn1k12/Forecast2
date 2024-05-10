import React, { useState } from 'react';
import Dashboard from '../components/Dashboard.jsx';
import Sidebar from '@/components/SideBar.jsx';
import BottomNavBar from '@/components/BottomNavBar';
import Actives from '@/components/Actives';
import MyCalendar from '@/components/Calendar';
import Chat from '@/components/Chat.jsx';
// import Transaction from "@/components/transactions/Transaction.jsx";
// import CryptoTransactioins from "@/components/cryptoTransactions/CryptoTransactioins.jsx";
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
      case 5:
        return <Chat />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ContextProvider>
      <div className='gap-4 h-screen w-screen flex'>
        <div className='p-10'>
          <Sidebar active={active} setActive={setActive} />
          <BottomNavBar active={active} setActive={setActive} />
        </div> 

        <div className='flex-grow py-10 pr-10'>
          <main className="h-full">
            {displayData()}
          </main>
        </div> 
      </div>
    </ContextProvider>
  );
}
