import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


function Dashboard() {
  return (
    <Card className='h-full'>
  <CardHeader>
    <CardTitle>
      <div className="text-sm xs:text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-xl p-5">
      привіт я ванька, лох ванька але може й не лох я хз
      </div>
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div>     
    <div className='rounded-xl xs:w-sm sm:w-md md:w-lg lg:w-xl xl:w-2xl 2xl:w-3xl p-5'>
      <img src="https://img.freepik.com/free-photo/fresh-yellow-daisy-single-flower-close-up-beauty-generated-by-ai_188544-15543.jpg?size=626&ext=jpg&ga=GA1.1.1546980028.1711065600&semt=ais"
      alt="" />
    </div>
    </div>
  </CardContent>
</Card>

    
  )
}

export default Dashboard