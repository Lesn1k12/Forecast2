import { useContext, createContext, useState } from 'react'
import { GrMenu } from "react-icons/gr";
import { Link } from 'react-router-dom';

import { LiaChartAreaSolid } from "react-icons/lia";

  const menuItems = [
    { id: 1, icon: <LiaChartAreaSolid />, title: 'Dashboard', link: '/dashboard' },
    { id: 2, icon: <LiaChartAreaSolid />, title: 'Transaction', link: '/transaction' },
  ];

export default function Sidebar({ active, setActive }) {
  const [expanded, setExpanded] = useState(true)
  

  return (
    <aside className="h-screen p-10">
      <nav
        className={`h-full flex flex-col bg-white border-r shadow-lg rounded-2xl overflow-hidden transition-all duration-300 ease-in-out ${
          expanded ? 'w-full' : 'w-20'
        }`}
      >
        <div className="p-4 pb-2 flex justify-between items-center">
          <span className={`overflow-hidden transition-all ${
              expanded ? 'w-32 opacity-90' : 'w-0'
            }`}>
              <h1>projekt</h1>
            </span>
            
          
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className=" rounded-lg  hover:bg-gray-100"
          >
          
          <GrMenu />
          
          </button>
        </div>

        
          <div>
            <ul>     
              {menuItems.map((item) => {
                    return <li
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={active === item.id ? 'active': ''}
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </li>
                })}     
            </ul>
          </div>
       

        <div className="flex flex-col flex-grow justify-end p-3 rounded-lg ">
          
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">name</h4>
              <span className="text-xs text-gray-600">mail</span>
            </div>
            
          </div>
        </div>
      </nav>
    </aside>
  )
}