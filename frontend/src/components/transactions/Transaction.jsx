import {React, useState} from 'react'
import Expenses from './Expenses'
import Incomes from './Incomes'
import History from './History'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { ContextProvider, useGlobalContext } from '../../context/GlobalContext';

function Transaction() {
  const [active, setActive] = useState(1)

  const items = [
    {id: 1, title: 'incomes', link: '/incomes'},
    {id: 1, title: 'expenses', link: '/expenses'}
  ]

  const displayItems = () => {
    switch(active){
      case 1:
        return <Incomes />
      case 2:
        return <Expenses />
      default: 
        return <Incomes />
    }
  }

  return (
    <ContextProvider>
      <div className='flex flex-row'>
          <div className="">
            <div className="">
              <Button className="" onClick={() => setActive(1)}>Incomes</Button>
              <Button className="" onClick={() => setActive(2)}>Expenses</Button>
            </div>
            <div className="">
              {displayItems()}
            </div>
          </div>
          <div className="">
            <History />
          </div>
      </div>
    </ContextProvider>
  )
}

export default Transaction