import React, { useContext, useState } from "react"
import authService from './auth/AuthService';
import axios from 'axios'

const BASE_URL = "http://localhost:8000/";

const GlobalContext = React.createContext()

export const ContextProvider = ({children}) => {

    const [token, setToken] = useState(null);
    const [expenses, setExpenses] = useState([])
    const [incomes, setIncomes] = useState([])
    const [transaction, setTransaction] = useState([])
    const [error, setError] = useState(null)


    const addTransaction = async (transaction) => {
        try {
            const token = authService.getTokenFromLocalStorage();

            const response = await axios.post(`${BASE_URL}users/post_transaction`, transaction, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            // console.log(response)            
            if (response && response.data) {
                // Дії, якщо відповідь успішна
                // console.log("Success:", response.data);
            } else {
                console.error("Invalid response:", response);
            }

            getTransaction();
        } catch (error) {
            console.error("Error:", error);
            console.log("Full error object:", error);
            setError(error.response?.data?.message || "Something went wrong");
        }
    }


    const getTransaction = async () => {
        try {
          const token = authService.getTokenFromLocalStorage();
          const response = await axios.get(`${BASE_URL}users/get_transactions`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
      
          console.log("danni:", response);
      
          // Перевірити, чи отримано відповідь з успіхом
          if (response && response.data) {
            // console.log("Success:", response.data);
            // Додаємо отримані дані до стану або робимо інші дії з ними
            const transactions = response.data;

            const expenses = transactions.filter(transaction => transaction.amount < 0);
            const incomes = transactions.filter(transaction => transaction.amount > 0);

            setExpenses(expenses);
            setIncomes(incomes);

            // console.log("дохід:",incomes)
            // console.log("витрати:",expenses)

          } else {
            console.error("Invalid response:", response);
          }
        } catch (error) {
          console.error("Error:", error);
          console.log("Full error object:", error);
          setError(error.response?.data?.message || "Something went wrong");
        }
    }

    const sendMail = () => {
      try {
          const token = authService.getTokenFromLocalStorage();
          const response = axios.get(`http://127.0.0.1:8000/users/total_mail/`, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
      } catch (error) {
          console.error("Error:", error);
      }
    }

  return (
    <GlobalContext.Provider value={{
          addTransaction,
          getTransaction,
          incomes,
          // deleteIncome,
          // expenses,
          // totalIncome,
          // totalExpenses,
          // totalBalance,
          // transactionHistory,
          error,
          setError,
          sendMail
      }}>
          {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () =>{
  return useContext(GlobalContext)
}


