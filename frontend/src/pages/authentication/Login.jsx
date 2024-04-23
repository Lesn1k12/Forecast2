import {useEffect, useState} from 'react'
import { Link, useNavigate } from "react-router-dom"
import { login, reset, getUserInfo } from '../../context/auth/AuthSlice'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import WalletComponent from '@/components/wallet/WalletComponent'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"



function Login() {
  const [formData, setFormData] = useState({
    "username": "",
    "password": "",
})

  const { username, password } = formData

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const item = {title: 'Wallet', link: '/walletcomponent'}

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const {name, value } = e.target;

    setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value
    }));
    console.log("Form Data:", formData);
  }

  const handleSubmit = () =>{
    const formData = {
        username,
        password,
    }
    dispatch(login(formData))
  }

  useEffect(() => {
    if (isError) {
        toast.error(message)
    }
    if (isSuccess || user) {
      navigate('/walletcomponent')
      toast.success("Welcome to your account!")
    }

    dispatch(reset())
    dispatch(getUserInfo())

}, [isError, isSuccess, user, navigate, dispatch])


  return (
    <div className="">
      <Card className="w-[350px] rounded-2xl my-auto">
        <CardHeader>
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>login</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name"></Label>
                <Input 
                  className=" focus:border-blue-400"
                  id="username" 
                  type="username" 
                  placeholder="username" 
                  name = "username"
                  value={username}
                  onChange={handleChange}/>
                <Input 
                  className=" focus:border-blue-400"
                  id="password" 
                  type="text" 
                  placeholder="password" 
                  name = "password"
                  value={password}
                  onChange={handleChange}
                  required/>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button className="shadow-sm active:bg-blue-300 rounded-xl" onClick={handleSubmit}>Login</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login