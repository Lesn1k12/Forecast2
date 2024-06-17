import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useGlobalContext } from '@/context/GlobalContext';
import SidebarContact from './SidebarContact';

const BASE_URL = "ws://localhost:8000/ws/chat/";

export default function Chat() {
  const [realtimeMessages, setRealtimeMessages] = useState([]);
  const [receiverId, setReceiverId] = useState('');
  const { getUser, getAllUsers, userData, allUsers, loadMessages, chatHistory, setChatHistory, getChats, page, setPage, chats, setChats, nextPageExists, } = useGlobalContext();
  const socketRef = useRef(null);
  const chatContainerRef = useRef(null);
  const sentinelRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatsLoaded, setChatsLoaded] = useState(false);
  const [chatId, setChatId] = useState('');
  const [message, setMessage] = useState({
    text: '',
    user: '',
    receiver_id: '',
  });

  useEffect(() => {
    if (!userData.id) {
      getUser();
      getAllUsers();
    } else {
      setMessage(prevMessage => ({
        ...prevMessage,
        user: userData.id
      }));
      getChats().then(() => {
        setChatsLoaded(true);
      });
    }
  }, [userData.id]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const scroll20MessagesBack = () => {
    if (chatContainerRef.current) {
      const messageHeight = 56; 
      const scrollHeightToGoBack = 20 * messageHeight; 
      chatContainerRef.current.scrollTop -= scrollHeightToGoBack;
    }
  };
  

  useEffect(() => {
    if (userData.id && receiverId && chatsLoaded && chatId) {
      loadMessages(chatId, page, 20).then((chatHistory) => {
        if (Array.isArray(chatHistory)) {
          setChatHistory(chatHistory);
          scrollToBottom();
        } else {
          console.error("History is not an array:", chatHistory);
        }
      });
  
      // Close previous connection before creating a new one
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
  
      socketRef.current = new WebSocket(`${BASE_URL}?user=${userData.id}&receiver_id=${receiverId}`);
  
      socketRef.current.onopen = () => {
        console.log("WebSocket connection established");
        setConnected(true);
        scrollToBottom();
      };
      socketRef.current.onmessage = (event) => {
        const receivedMessage = JSON.parse(event.data);
        console.log("Received message:", receivedMessage);
  
        if (receivedMessage.text && receivedMessage.user && receivedMessage.receiver_id) {
          // Check if the received message is for the current user or from the current user
          if (
              receivedMessage.receiver_id === userData.id || receivedMessage.user === userData.id
          ) {
            setRealtimeMessages(prevMessages => [...prevMessages, receivedMessage]);
            scrollToBottom();
          } else {
            console.error("Received message does not match receiver_id or user:", receivedMessage);
          }
        } else {
          console.error("Received message does not have the expected format:", receivedMessage);
        }
      };
  
      socketRef.current.onclose = () => {
        console.log("WebSocket connection closed");
      };
    }
  }, [userData.id, receiverId, chatsLoaded, chatId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setLoading(true);   
          loadMoreMessages();
        }
      },
      {
        root: chatContainerRef.current,
        threshold: 1.0
      }
    );
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }
    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [loading]);

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMessage(prevMessage => ({
      ...prevMessage,
      [name]: value,
    }));
    scrollToBottom();
  };

  const handleSendClick = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const newMessage = {
        ...message,
        user: userData.id, // Ensure user id is sent
        receiver_id: Number(receiverId), // Ensure receiver_id is a number
        isCurrentUser: true,
      };

      console.log("Sending message:", newMessage);

      setMessage({
        text: '',
      });
      scrollToBottom();
      socketRef.current.send(JSON.stringify(newMessage));
    } else {
      console.error('WebSocket connection not yet established.');
    }
  };
  

  const handleReceiverChange = (e) => {
    const newReceiverId = e.target.value;
    setReceiverId(newReceiverId);
  
    // Find the chat that includes both userData.id and newReceiverId
    const chat = chats.find(chat => {
      return (chat.user0 === userData.id && chat.user1 === newReceiverId) ||
             (chat.user0 === newReceiverId && chat.user1 === userData.id);
    });
  
    if (chat) {
      setChatId(chat.chat_id);
    } else {
      console.error('Chat not found for users:', userData.id, newReceiverId);
    }
  
    // Update message receiver_id
    setMessage(prevMessage => ({
      ...prevMessage,
      receiver_id: newReceiverId
    }));
  };



  const loadMoreMessages = () => {
    if (!nextPageExists) {
      return; // Don't load more messages if nextPageExists is false
    }
  
    const nextPage = page + 1;
    loadMessages(chatId, nextPage, 20).then((response) => {
      if (Array.isArray(response.messages)) {
        setChatHistory((prevMessages) => [...response.messages, ...prevMessages]); // Append new messages to the beginning of the array
        setPage(nextPage);
        setLoading(false);
        nextPageExists(response.next_page_exists); // Update nextPageExists
      } else {
        console.error("Failed to load more messages:", response);
        setLoading(false);
      }
    });
  };
  

  const groupMessagesByDate = (messages) => {
    const grouped = [];
    let currentDate = null;
    
    messages.forEach(msg => {
      const messageDate = moment(msg.time).format('YYYY-MM-DD');
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        grouped.push({
          date: msg.time,
          messages: [msg]
        });
      } else {
        grouped[grouped.length - 1].messages.push(msg);
      }
    });
    
    return grouped;
  };

  const displayMessages = () => {
    const chatH = chatHistory.slice().reverse();
    const allMessages = [...chatH, ...realtimeMessages];
    const groupedMessages = groupMessagesByDate(allMessages);

    return (
      <>
        {groupedMessages.map((group, index) => (
          <div key={index}>
            <div className="text-center mb-2">{moment(group.date).format('MMMM Do, YYYY')}</div>
            {group.messages.map((msg, idx) => {
              const isCurrentUser = Number(msg.sender || msg.user) === Number(userData.id);
              return (
                <div key={idx} className={`flex mb-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-lg p-2 shadow ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-white text-black'}`} style={{maxWidth: '80%'}}>
                    {msg.text}
                    <div className="text-gray-500 text-xs text-right">{moment(msg.time).format('HH:mm')}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </>
    );
  };

  return (
    <Card className="h-full flex flex-col relative">
      <SidebarContact handleReceiverChange={handleReceiverChange} />
      <CardContent className="h-full flex flex-col p-6">
        <div className="flex-1 overflow-y-scroll rounded-lg bg-gray-100 px-4 mb-2" ref={chatContainerRef}>
        <div ref={sentinelRef}></div>
          {displayMessages()}
        </div>
        <div className="bg-gray-100 rounded-lg px-4 py-2 mt-2">
          <div className="flex items-center">
            <Input
                type="text"
                name="text"
                value={message.text}
                onChange={handleInputChange}
                placeholder="Type your message"
            />
            <Button variant="secondary" onClick={handleSendClick}>Send</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
