import React, { useState } from 'react';
import Sidebar from '../components/SideBar';
import Transaction from '@/components/transactions/Transaction';
import Dashboard from '@/components/Dashboard';

export default function DashboardPage() {
  const [active, setActive] = useState(1);

  const displayData = () => {
    switch(active){
      case 1:
        return <Dashboard />
      case 2:
        return <Transaction />
      default: 
        return <Dashboard />
    }
  }

  return (
    
    <div className='grid grid-cols-4 gap-4 h-screen '>
      <div className='col-span-1'>
        <Sidebar active={active} setActive={setActive}/>
      </div> 

      <div className='my-10 col-span-3'>
        <main>
          {displayData()}
        </main>
      </div> 
    </div>
    
  );
}