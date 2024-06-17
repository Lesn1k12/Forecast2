import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

import Profile from "./Profile";
import { ContextProvider, useGlobalContext } from "@/context/GlobalContext";
import Wallet from "../wallet/Wallet";

import { RxDashboard, RxCalendar, RxHamburgerMenu, RxChatBubble } from "react-icons/rx";
import { CiMoneyBill, CiBitcoin, CiLogout } from "react-icons/ci";
import { GrTransaction, GrMoney } from "react-icons/gr";


import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const menuItems = [
  {
    id: 1,
    icon: <RxDashboard style={{ width: "24px", height: "24px" }} />,
    title: "Dashboard",
    link: "/Dashboard",
  },
  {
    id: 2,
    icon: <GrMoney style={{ width: "24px", height: "24px" }} />,
    title: "Actives",
    link: "/Actives",
  },
  {
    id: 3,
    icon: <RxCalendar style={{ width: "24px", height: "24px" }} />,
    title: "Calendar",
    link: "/Calendar",
  },
  {
    id: 4,
    icon: <RxChatBubble style={{ width: "24px", height: "24px" }} />,
    title: "Chat",
    link: "/Chat",
  },
  {
    id: 5,
    icon: <GrTransaction style={{ width: "24px", height: "24px" }} />,
    title: "Transactions",
    link: "/Transactions",
  },
  {
    id: 6,
    icon: <CiBitcoin style={{ width: "24px", height: "24px" }} />,
    title: "Crypto Transactions",
    link: "/CryptoTransactions",
  },
];

export default function Sidebar({ active, setActive }) {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const activeItem = menuItems.find((item) => item.link === path);
    if (activeItem) {
      setActive(activeItem.id);
    }
  }, [location.pathname, setActive]);

  const handleLogout = () => {
    console.log("Logged out");
  };

  return (
    <ContextProvider>
      <Card className="relative h-full flex flex-col justify-between xs:w-xs sm:w-sm md:w-md lg:w-lg xl:w-xl 2xl:w-2xl 3xl:w-3xl hidden lg:block xl:block 2xl:block 3xl:block">
        <CardContent className="p-0">
          <nav className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? "" : ""}`}>
            <CardTitle>
              <div className="p-4 pb-2 flex justify-between items-center">
                <span className={`overflow-hidden transition-all ${expanded ? "w-44 opacity-90" : "w-0"}`}>
                  <h1 className="font-semibold">Forecast</h1>
                </span>
                <button onClick={() => setExpanded((curr) => !curr)} className="rounded-lg hover:bg-gray-100 ml-auto">
                  <RxHamburgerMenu />
                </button>
              </div>
            </CardTitle>
            <div className={`flex flex-col justify-between items-center overflow-hidden transition-all ${expanded ? "w-52" : "w-14"}`}>
              <ul className="p-2 w-full">
                {menuItems.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    className={`flex items-center p-2 rounded-lg ${active === item.id ? "bg-indigo-300 text-white" : "hover:bg-gray-100"} cursor-pointer`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span className={`transition-all duration-300 ${expanded ? "opacity-100" : "opacity-0"} whitespace-nowrap`}>{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </CardContent>
        <CardFooter className={`flex justify-between items-center absolute bottom-0 p-0 rounded-lg overflow-hidden transition-all ${expanded ? "w-52" : "w-14"}`}>
          <Wallet>
            <Profile />
          </Wallet>
          <Button variant="ghost" onClick={handleLogout} className="mt-1">
            <Link to="/authentication">
              <CiLogout size={24} />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </ContextProvider>
  );
}
