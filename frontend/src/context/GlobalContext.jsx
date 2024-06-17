import React, { useContext, useState, useCallback } from "react";
import authService from "./auth/AuthService";
import axios from "axios";
import { set } from "date-fns";

const BASE_URL = "http://localhost:8080/";

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
  const [allUsers, setAllUsers] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [chats, setChats] = useState([]);
  const [dateEvent, setDateEvent] = useState([]);


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
      const response = await axios.get(`${BASE_URL}users/get_transaction`, {
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
  const getUser = useCallback(async () => {
  try {
    const token = authService.getTokenFromLocalStorage();
    const response = await axios.get(`${BASE_URL}users/get_userdata`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Перевірити, чи отримано відповідь з успіхом
    if (response && response.data) {
      // Додаємо отримані дані до стану або робимо інші дії з ними
      const userData = response.data;
      if (userData.id) {
        setUserData(userData);
      } else {
        console.error("Invalid userData:", userData);
      }
    } else {
      console.error("Invalid response:", response);
    }
  } catch (error) {
    console.error("Error:", error);
    console.log("Full error object:", error);
    setError(error.response?.data?.message || "Something went wrong");
  }
});

  //дістати всіх юзерів
  const getAllUsers = useCallback(async () => {
    try {
      const token = authService.getTokenFromLocalStorage();
      const response = await axios.get(`${BASE_URL}users/get_all_users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("danni:", response);

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
  });

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
        const delAssetUrl = `${BASE_URL}users/delete_actives/?id=${id}`;
        const response = await axios.delete(delAssetUrl, {
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


        // отримання історії чату

        const loadMessages = async (chatId, page, pageSize) => {
          setLoading(true);
          try {
            const token = authService.getTokenFromLocalStorage();
            const response = await axios.get(`${BASE_URL}users/chat/${chatId}/messages/`, {
              params: { page, page_size: pageSize },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const message = response.data.messages;
            const nextPageExists = response.data.next_page_exists;
            setChatHistory(prevHistory => [...prevHistory, ...message]);
            setPage((prevPage) => prevPage + 1);
            return { messages: message, next_page_exists: nextPageExists };
          } catch (error) {
            console.error('Error fetching chat history:', error);
          } finally {
            setLoading(false);
          }
        };
        

      // отримання всіх чатів

      const getChats = async () => {
        try {
            const token = authService.getTokenFromLocalStorage();
            const response = await axios.get(`${BASE_URL}users/get_chats`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }); 
            setChats(response.data); // Ensure to return the data
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.error('No chats found:', error.response.data);
            } else {
                console.error('Error fetching chats:', error);
            }
            return []; // Return an empty array or handle error accordingly
        }
    };
    


// -------------Events--------------


const fetchEvents = async () => {
  try {
    const token = authService.getTokenFromLocalStorage();
    const response = await axios.get(`${BASE_URL}users/get_events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

const addEvent = async (event) => {
  try {
    const token = authService.getTokenFromLocalStorage();
    const response = await axios.post(`${BASE_URL}users/create_event`, {
      ...event,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      ...response.data,
      start: new Date(response.data.start),
      end: new Date(response.data.end),
    };
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};



const deleteEvent = async (id) => {
  try {
    const token = authService.getTokenFromLocalStorage();
    const response = await axios.delete(`${BASE_URL}users/delete_event/?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        }); 
  return response.data
} catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};


const updateEvent = async (eventId, updatedFields) => {
  try {
    const token = authService.getTokenFromLocalStorage();
    const response = await axios.patch(`${BASE_URL}users/patch_event${eventId}/`, updatedFields, {
      headers: {
          Authorization: `Bearer ${token}`,
      },
  }); 
    return response.data
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
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
        allUsers,
        loadMessages,
        getChats,
        chatHistory,
        setChatHistory,
        chats,
        loading,
        page,
        fetchEvents,
        addEvent,
        deleteEvent,
        updateEvent,
        dateEvent,
        setDateEvent,
        
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
