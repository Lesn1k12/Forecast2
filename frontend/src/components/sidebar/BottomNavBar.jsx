import { useState } from 'react';
import { GrHome, GrUser, GrMenu } from 'react-icons/gr';
import { LiaChartAreaSolid } from "react-icons/lia";


const menuItems = [
  { id: 1, icon: <LiaChartAreaSolid />, title: 'Dashboard', link: '/Dashboard' },
]

export default function BottomNavBar({ active, setActive }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleMenuItemClick = (itemId) => {
    setActive(itemId); 
    toggleMenu(); 
  };

  

  return (
    <div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 xs:flex-row sm:flex-row md:flex-row lg:hidden xl:hidden 2xl:hidden 3xl:hidden z-50">
        <div className="flex flex-col items-center">
          <GrHome className="text-xl text-gray-500" />
          <span className="text-xs text-gray-500">Home</span>
        </div>
        <div className="flex flex-col items-center">
          <GrUser className="text-xl text-gray-500" />
          <span className="text-xs text-gray-500">Profile</span>
        </div>
        <div className="flex flex-col items-center">
        <button onClick={toggleMenu} >
        <GrMenu className="text-xl text-gray-500"/>
        <span className="text-xs text-gray-500">Menu</span>
        </button>
      </div>

        
        
      </nav>

      
      {menuVisible && (
        <aside className="fixed inset-0 bg-white border-t border-gray-200 shadow-lg p-4 z-40">
        
        <ul>     
              {menuItems.map((item) => {
                  return <li
                      key={item.id}
                      onClick={() => handleMenuItemClick(item.id)}
                      className={active === item.id ? 'active': ''}>
                      
                  {item.icon}
                  <span>{item.title}</span>
                
                  </li>
              })}      
            </ul>
        </aside>
      )}
    </div>
  );
}
