import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import moment from 'moment';
// import authService from '../../features/auth/authService';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default function Actives() {
  const [datas, setDatas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    object_name: '',
    second_price: '',
    second_date: '',
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const token = authService.getTokenFromLocalStorage();
        const response = await axios.get('http://127.0.0.1:8000/users/get_bobject/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
    
        setDatas(response.data);
      } catch (error) {
        console.error('Помилка отримання даних:', error);
      }
    };
  
    getData();
  }, []);

  const editProduct = (dataId) => {
    setEditingId(dataId);
    const editedItem = datas.find(item => item.id === dataId);
    setEditedProduct({
      id: editedItem.id,
      object_name: editedItem.object_name,
      second_price: editedItem.second_price,
      second_date: editedItem.second_date,
      proc: editedItem.proc,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedProduct({
      id: '',
      object_name: '',
      second_price: '',
      second_date: '',
    });
  };

  const updateProduct = async () => {
    try {
      const token = authService.getTokenFromLocalStorage();
      const currentDate = moment().format('YYYY-MM-DD HH:mm:ss.SSSSSS');
      const { id, second_date, second_price, ...rest } = editedProduct;
      const response = await axios.put(`http://127.0.0.1:8000/users/update_bobject/${id}`, { ...rest, second_date: currentDate, second_price }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const updatedData = datas.map(item => item.id === id ? response.data : item);
      setDatas(updatedData);
      setEditingId(null);
      setEditedProduct({
        id: '',
        object_name: '',
        second_price: '',
        second_date: '',
      });
    } catch (error) {
      console.error('Помилка оновлення даних: ', error);
    }
  };

  const post_data = async () => {
    try {
      const token = authService.getTokenFromLocalStorage();
      if (!editedProduct.object_name || !editedProduct.second_price) {
        console.error('Будь ласка, заповніть всі обов\'язкові поля.');
      } else {
        const currentDate = moment().format('YYYY-MM-DD HH:mm:ss.SSSSSS');
  
        const response = await axios.post('http://127.0.0.1:8000/users/create_bobject/', { object_name: editedProduct.object_name, second_price: editedProduct.second_price, first_date: currentDate }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        setDatas((prevDatas) => [...prevDatas, response.data]);
      }
  
      setEditedProduct({
        object_name: '',
        second_price: '',
        first_date: '',
        second_date: '',
      }); 
    } catch (error) {
      console.error('Помилка додавання даних: ', error);
    }
  };

  const delete_data = async (dataId) => {
    try {
      const token = authService.getTokenFromLocalStorage();
      await axios.delete(`http://127.0.0.1:8000/users/delete_bobject/${dataId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setDatas((prevDatas) => prevDatas.filter((datka) => datka.id !== dataId)); 
    } catch (error) {
      console.error('Помилка видалення даних: ', error);
    }
  };

  return (
    <Card>
  <CardHeader>
    
    
  </CardHeader>
  <CardContent>
  <div className="flex justify-center items-center h-90v w-65vw bg-white rounded-xl shadow-box">
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="flex flex-col max-w-md mx-auto gap-2">
          <input
            className="border rounded-md p-2"
            type="text"
            name="object_name"
            placeholder="Product name"
            value={editedProduct.object_name}
            onChange={(e) => setEditedProduct({ ...editedProduct, object_name: e.target.value })}
          />
          <input
            className="border rounded-md p-2"
            type="text"
            name="second_price"
            placeholder="Price"
            value={editedProduct.second_price}
            onChange={(e) => setEditedProduct({ ...editedProduct, second_price: e.target.value })}
          />
          
          {editingId ? (
            <>
              <button className="bg-white text-dark shadow-box rounded-md px-4 py-2" onClick={() => updateProduct(editingId)}>Update</button>
              <button className="bg-white text-dark shadow-box rounded-md px-4 py-2" onClick={cancelEdit}>Cancel</button>
            </>
          ) : (
            <button className="bg-white text-dark shadow-box rounded-md p-2" onClick={post_data}>
              
            </button>
          )}
        </div>
        <table className="w-full">
          <thead className="">
            <tr>
              <th className="">Product name</th>
              <th className="">increase</th>
              <th className="">Price</th>
              <th className="">Date</th>
            </tr>
          </thead>
          <tbody className="">
            {datas.map((datka) => (
              <React.Fragment key={datka.id}>
                <tr>
                  <td className="">{datka.object_name}</td>
                  <td className="">{datka.proc}%</td>
                  <td className="">{datka.second_price}$</td>
                  <td className="">{moment(datka.first_date).format('DD-MM-YYYY')}</td>
                  <td>
                    <button className="bg-white text-dark shadow-box rounded-md p-2" onClick={() => editProduct(datka.id)}>
                      
                    </button>
                  </td>
                  <td>
                    <button className="bg-white text-dark shadow-box rounded-md p-2" onClick={() => delete_data(datka.id)}>
                      
                    </button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>   
      </div>  
    </div>
  </CardContent>
</Card>

    
  );
}
