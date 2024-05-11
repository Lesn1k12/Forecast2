import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";
import WalletComponent from "../../components/wallet/WalletComponent";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function AuthenticationPage() {
    // const [active, setActive] = useState(1)

    // const items = [
    //     {id: 1, title: 'Register', link: '/register'},
    //     {id: 2, title: 'Login', link: '/login'},
    //     {id: 3, title: 'Wallet', link: '/walletcomponent'},
    // ]

    // const displayItems = () => {
    //     switch(active){
    //         case 1:
    //             return <Register />
    //         case 2:
    //             return <Login />
    //         case 3:
    //             return <WalletComponent />
    //         default: 
    //             return <Register />
    //     }
    // }

    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login" >Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login"><Login /></TabsContent>
                <TabsContent value="register"><Register /></TabsContent>
            </Tabs>
        </div>
    );
}

export default AuthenticationPage;