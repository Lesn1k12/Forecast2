import React, { useContext, useState } from "react";
import authService from "./auth/AuthService";
import axios from "axios";
import { set } from "date-fns";

const BASE_URL = "http://localhost:8000/";

const GlobalContext = React.createContext();

export const ContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState(null);
  const [lastAsset, setLastAsset] = useState([]);
  const [assetHistory, setAssetHistory] = useState([]);
  const [predict, setPredict] = useState([]);
  const [allAssets, setAllAssets] = useState([]);
  const [asset, setAsset] = useState([]);
  const [history, setHistory] = useState([]);
  const [AllUsers, setAllUsers] = useState([]);

  const addTransaction = async (transaction) => {
    try {
      const token = authService.getTokenFromLocalStorage();

      const response = await axios.post(
        `http://127.0.0.1:8000/users/post_transaction`,
        transaction,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
  };

  const getTransaction = async () => {
    try {
      const token = authService.getTokenFromLocalStorage();
      const response = await axios.get(`${BASE_URL}users/get_transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("danni:", response);

      // Перевірити, чи отримано відповідь з успіхом
      if (response && response.data) {
        // console.log("Success:", response.data);
        // Додаємо отримані дані до стану або робимо інші дії з ними
        const transactions = response.data;

        const expenses = transactions.filter(
          (transaction) => transaction.amount < 0
        );
        const incomes = transactions.filter(
          (transaction) => transaction.amount > 0
        );

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
  };

  //видалення транзакції
  const deleteTransaction = async (id) => {
    try {
      const token = authService.getTokenFromLocalStorage();
      const response = await axios.delete(
        `${BASE_URL}users/delete_transaction/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            id: id,
          },
        }
      );

      console.log("danni:", response);

      // Перевірити, чи отримано відповідь з успіхом
      if (response && response.data) {
        // Додаємо отримані дані до стану або робимо інші дії з ними
        const transaction = response.data;
        console.log("transaction:", transaction);
      } else {
        console.error("Invalid response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("Full error object:", error);
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  //рахування загального доходу
  const total = () => {
    let total = 0;
    incomes.forEach((income) => {
      total = total + income.amount;
    });

    return total;
  };

  //історія транзакцій
  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    history.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return history;
  };

  //отримання предикта
  const getPredict = async () => {
    try {
      const token = authService.getTokenFromLocalStorage();
      const response = await axios.get(
        `${BASE_URL}users/forecast_transaction`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("danni:", response);

      // Перевірити, чи отримано відповідь з успіхом
      if (response && response.data) {
        // Додаємо отримані дані до стану або робимо інші дії з ними
        const rawData = JSON.parse(response.data[0]);
        // Розпакувати дані
        const data = Object.keys(rawData.ds).map((key, index) => ({
          time: new Date(parseInt(rawData.ds[key])).toLocaleDateString(), // Час
          value: rawData.yhat[key], // Значення
        }));
        setPredict(data);
      } else {
        console.error("Invalid response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("Full error object:", error);
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  const sendMail = () => {
    try {
      const token = authService.getTokenFromLocalStorage();
      const response = axios.get(`http://127.0.0.1:8000/users/total_mail/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //отримання данних юзера
  const getUser = async () => {
    try {
      const token = authService.getTokenFromLocalStorage();
      const response = await axios.get(`${BASE_URL}users/get_userdata`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("danni:", response);

      // Перевірити, чи отримано відповідь з успіхом
      if (response && response.data) {
        // Додаємо отримані дані до стану або робимо інші дії з ними
        const userData = response.data;
        setUserData(userData);
        console.log("user:", userData);
      } else {
        console.error("Invalid response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("Full error object:", error);
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  //дістати всіх юзерів
  const getAllUsers = async () => {
    try {
      const token = authService.getTokenFromLocalStorage();
      const response = await axios.get(`${BASE_URL}users/get_all_users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("danni:", response);

      // Перевірити, чи отримано відповідь з успіхом
      if (response && response.data) {
        // Додаємо отримані дані до стану або робимо інші дії з ними
        const allLser = response.data;
        setAllUsers(allLser);
      } else {
        console.error("Invalid response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("Full error object:", error);
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  //створити актив
  const createAsset = async (asset) => {
    try {
      const token = authService.getTokenFromLocalStorage();
      const response = await axios.post(
        `${BASE_URL}users/create_actives`,
        asset,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data) {
        console.log("Success:", response.data);
      } else {
        console.error("Invalid response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("Full error object:", error);
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  //отримати актив
  const getAsset = async (id) => {
    try {
      const token = authService.getTokenFromLocalStorage();
      const response = await axios.get(`${BASE_URL}users/get_actives/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: id,
        },
      });

      if (response && response.data) {
        console.log("Success:", response.data);
        const asset = response.data;
        setAsset(asset);
      } else {
        console.error("Invalid response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("Full error object:", error);
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  //видалити актив
  const deleteAsset = async (id) => {
    try {
      const token = authService.getTokenFromLocalStorage();
      const response = await axios.delete(`${BASE_URL}users/delete_actives/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          id: id,
        },
      });

      if (response && response.data) {
        console.log("Success:", response.data);
      } else {
        console.error("Invalid response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("Full error object:", error);
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  //редагувати актив
  const editAsset = async (id, new_price, date) => {
    try {
      const token = authService.getTokenFromLocalStorage();
      const urlEditAsset = `${BASE_URL}users/update_actives/?id=${id}&new_price=${new_price}&date=${date.toISOString()}`;
      const response = await axios.put(urlEditAsset, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response && response.data) {
        console.log("Success:", response.data);
      } else {
        console.error("Invalid response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("Full error object:", error);
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  //отримати останній актив
  const getLastAsset = async (id) => {
    try {
      const token = authService.getTokenFromLocalStorage();
      const response = await axios.get(`${BASE_URL}users/get_actives`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: id,
        },
      });

      if (response && response.data) {
        console.log("Success:", response.data);
        const asset = response.data;
        setLastAsset(asset);
      } else {
        console.error("Invalid response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("Full error object:", error);
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  //отримати історію актива
  const getAssetHistory = async (id) => {
    try {
      const token = authService.getTokenFromLocalStorage();
      const urlGetAssetHistory = `${BASE_URL}users/get_price_history/?id=${id}`;
      const response = await axios.get(urlGetAssetHistory, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      if (response && response.data) {
        console.log("Success:", response.data);
        const history = response.data;
        setAssetHistory(history);
      } else {
        console.error("Invalid response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("Full error object:", error);
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  const getAllAssets = async () => {
    try {
      const token = authService.getTokenFromLocalStorage();
      const response = await axios.get(`${BASE_URL}users/get_all_actives/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("danni:", response);

      // Перевірити, чи отримано відповідь з успіхом
      if (response && response.data) {
        // Додаємо отримані дані до стану або робимо інші дії з ними
        const allassets = response.data;
        setAllAssets(allassets);
        console.log("assets:", allassets);
      } else {
        console.error("Invalid response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("Full error object:", error);
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        addTransaction,
        getTransaction,
        incomes,
        expenses,
        deleteTransaction,
        total,
        transactionHistory,
        error,
        setError,
        sendMail,
        getPredict,
        getUser,
        userData,
        createAsset,
        deleteAsset,
        editAsset,
        getLastAsset,
        lastAsset,
        getAssetHistory,
        assetHistory,
        getAllAssets,
        allAssets,
        predict,
        getAsset,
        asset,
        getAllUsers,
        AllUsers,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
