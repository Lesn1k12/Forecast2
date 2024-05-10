import { useState } from 'react'

import Profile from "./Profile";
import { ContextProvider, useGlobalContext } from '@/context/GlobalContext';

import { CiLogout } from "react-icons/ci"
import { RxDashboard, RxCalendar, RxHamburgerMenu } from "react-icons/rx";
import { CiMoneyBill } from "react-icons/ci";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from './ui/button';

const menuItems = [
  { 
    id: 1,
    icon: <RxDashboard style={{ width: "24px", height: "24px" }} />,
    title: 'Dashboard',
    link: '/Dashboard' 
  },
  { 
    id: 2,
    icon: <CiMoneyBill style={{ width: "24px", height: "24px" }} />,
    title: 'Actives',
    link: '/Actives'
  },
  { 
    id: 3,
    icon: <RxCalendar style={{ width: "24px", height: "24px" }} />,
    title: 'Calendar', 
    link: '/Calendar' 
  },
  { 
    id: 4, 
    icon: <RxCalendar style={{ width: "24px", height: "24px" }} />, 
    title: 'Chat', 
    link: '/Chat' 
  },
  {
    id: 5,
    icon: <RxCalendar style={{ width: "24px", height: "24px" }} />,
    title: "Transactions",
    link: "/Transactions",
  },
  {
    id: 6,
    icon: <RxCalendar style={{ width: "24px", height: "24px" }} />,
    title: "Crypto Transactions",
    link: "/CryptoTransactions",
  },
]

export default function Sidebar({ active, setActive }) {
  const [expanded, setExpanded] = useState(true)

  const handleLogout = () => {
    // Виконати дії для виходу зі сеансу, наприклад, видалити токен аутентифікації
    // Перенаправлення на сторінку входу або іншу сторінку
    console.log("Logged out");
  };

  return (
    <ContextProvider>
      <Card className="relative h-full flex flex-col justify-between xs:w-xs sm:w-sm md:w-md lg:w-lg xl:w-xl 2xl:w-2xl 3xl:w-3xl hidden lg:block xl:block 2xl:block 3xl:block">
        <CardContent className="p-0">
          <nav
            className={` overflow-hidden transition-all duration-300 ease-in-out  ${expanded ? '' : ''
              }`}
          >
            <CardTitle>
              <div className="p-4 pb-2 flex justify-between items-center">
                <span 
                  className={`overflow-hidden transition-all ${
                    expanded ? 'w-44 opacity-90' : 'w-0'
                  }`}
                >
                  <h1 className='font-semibold'>projekt</h1>
                </span>
                <button
                  onClick={() => setExpanded((curr) => !curr)}
                  className=" rounded-lg hover:bg-gray-100 ml-auto"
                >
                  <RxHamburgerMenu />
                </button>
              </div>
            </CardTitle>
            <div 
              className={`
              flex justify-between items-center
              overflow-hidden transition-all  ${expanded ? 'w-52 ml-3' : 'w-0'}
              `}
            >
              <ul className='p-2 '>
                {menuItems.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    className={`p-1 rounded-lg hover:bg-gray-100 ${
                      active === item.id 
                      ? 'active cursor-pointer' 
                      : 'cursor-pointer'
                    }`}
                  >
                    <span className='flex items-center'>
                      <span className='mr-2'>{item.icon}</span>
                      <span>{item.title}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </CardContent>
        
        <CardFooter 
        className={`flex justify-between absolute bottom-0 p-0 rounded-lg overflow-hidden transition-all ${
          expanded ? 'w-52 ml-3' : 'w-0'
          } `}
        >
          <Profile />
          <Button variant="ghost" onClick={handleLogout} className="ml-auto">
            <a href="/authentication">
              <CiLogout size={24} />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </ContextProvider>
  )
}