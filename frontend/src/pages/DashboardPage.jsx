import React, { useState } from 'react';

import Dashboard from '../components/Dashboard.jsx';
import Sidebar from '@/components/Sidebar';
import BottomNavBar from '@/components/BottomNavBar';
import Actives from '@/components/Actives';
import MyCalendar from '@/components/Calendar';


export default function DashboardPage() {
  const [active, setActive] = useState(1);

  const displayData = () => {
    switch(active){
      case 1:
        return <Dashboard />
      case 2:
        return <Actives />
      case 3:
        return <MyCalendar />
      default: 
        return <Dashboard />
    }
  }

  return (
    
    <div className=' gap-4 h-screen w-screen flex'>
      <div className='p-10'>
      <Sidebar active={active} setActive={setActive} />
      <BottomNavBar active={active} setActive={setActive} />
      </div> 

      <div className='h-full w-full py-10 pr-10'>
        <main>
          {displayData()}
        </main>
      </div> 
    </div>
    
  );
}
