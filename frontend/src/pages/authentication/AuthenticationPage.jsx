import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";
import WalletComponent from "../../components/wallet/WalletComponent";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"

function AuthenticationPage() {
    const [active, setActive] = useState(1)

    const items = [
        {id: 1, title: 'Register', link: '/register'},
        {id: 2, title: 'Login', link: '/login'},
        {id: 3, title: 'Wallet', link: '/walletcomponent'},
    ]

    const displayItems = () => {
        switch(active){
            case 1:
                return <Register />
            case 2:
                return <Login />
            case 3:
                return <WalletComponent />
            default: 
                return <Register />
        }
    }

    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <div className="">
                <Button className="mr-2 shadow-sm active:bg-blue-300 rounded-xl border-2 border-black" onClick={() => setActive(2)}>Login</Button>
                <Button className="ml-2 shadow-sm active:bg-blue-300 rounded-xl border-2 border-black" onClick={() => setActive(1)}>Register</Button>
            </div>
            <div className="">
                {displayItems()}
            </div>
        </div>
    );
}

export default AuthenticationPage;