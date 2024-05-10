import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleMessageSend = () => {
    if (newMessage.trim() === "") return;
    const message = { text: newMessage, sender: "me" }; // Assuming sender is "me" for the messages I send
    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleMessageSend();
    }
  };

  return (
    <Card className='h-full flex flex-col'>
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex justify-end mb-4 ${message.sender === "me" ? "items-end" : "items-start"}`}
            >
              <div
                className={`bg-${message.sender === "me" ? "blue-500" : "gray-200"} text-white rounded-lg p-2`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex items-center">
        <Input
          type="text"
          placeholder="Напишіть повідомлення..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full border-t border-gray-200 px-4 py-2 focus:outline-none"
        />
        <button
          onClick={handleMessageSend}
          className="bg-blue-500 text-white rounded-lg p-2 ml-4"
        >
          Надіслати
        </button>
        {/* Додайте кнопку для скидання фотографій */}
        <label className="cursor-pointer ml-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <input type="file" className="hidden" />
        </label>
      </CardFooter>
    </Card>
  );
}
