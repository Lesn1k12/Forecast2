import { useEffect, useState} from 'react'
import { toast } from 'react-toastify'
import { login, reset, getUserInfo } from '../../context/auth/AuthSlice'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
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


function Register() {
  const[formData, setFormData] = useState({
    "userusername": "",
    "email": "",
    "password": "",
  })

  const {username, email, password } = formData

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const {username, email, password} = e.target;

    setFormData((perv) => ({
      ...perv,
      [e.target.name]: e.target.value
    }))
    console.log("Form Data:", formData)
  }

  const handleSubmit = () => {
    const formData = {
      username,
      email,
      password,
    }
    dispatch(login(formData))
  }

  useEffect(() => {
    if (isError) {
        toast.error(message)
    }
    if (isSuccess || user) {
        navigate("/dashboard")
    }

    dispatch(reset())
    dispatch(getUserInfo())

}, [isError, isSuccess, user, navigate, dispatch])

  return (
      <div className="">
        <Card className="w-[350px] rounded-2xl my-auto">
          <CardHeader>
            <CardTitle>Hey!</CardTitle>
            <CardDescription>register</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name"></Label>
                  <Input 
                    className="focus:border-blue-400"
                    id="name" 
                    type="email" 
                    placeholder="name" 
                    name = "username"
                    value={username}
                    onChange={handleChange}/>
                  <Input 
                    className="focus:border-blue-400"
                    id="email" 
                    type="email" 
                    placeholder="email" 
                    name = "email"
                    value={email}
                    onChange={handleChange}/>
                  <Input
                    className="focus:border-blue-400" 
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
            <Button className="shadow-sm active:bg-blue-300 rounded-xl" onClick={handleSubmit}>register</Button>
          </CardFooter>
        </Card>
      </div>
    )
}

export default Register