import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import EventComponent from "./Event"; 
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"


import axios from "axios";

import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";


const now = new Date();

const MyCalendar = () => {
  const [myEventsList, setMyEventsList] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
  });

  


  

  // axios.get('')
  // .then(response => {
  //   console.log(response.data);
  // })
  // .catch(error => {
  //   console.error('There was an error!', error);
  // });


  // axios.post('', newEvent)
  // .then(response => {
  //   console.log('Event created successfully:', response.data);
  // })
  // .catch(error => {
  //   console.error('There was an error!', error);
  // });

  const localizer = momentLocalizer(moment);

  const eventStyle = (event, start, end, isSelected) => {
    var bgColor = event.hexColor ? "#fff" : "#000";
    var style = {
      backgroundColor: bgColor,
      borderRadius: "5px",
      opacity: 1,
      color: "white",
      border: "0px",
      display: "block",
    };
    return {
      style: style,
    };
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) {
      toast.error("Event name cannot be empty.");
      return;
    }
  
    const newEventCopy = { ...newEvent };
    
    const updatedEvents = [...myEventsList, newEventCopy];
    setMyEventsList(updatedEvents);
    
    setNewEvent({ title: "", start: new Date(), end: new Date() });
    toast.success("Event has been created.");
  };
  
  
  
  

  const handleTitleChange = (e) => {
    setNewEvent({ ...newEvent, title: e.target.value });
  };

  const handleStartDateChange = (dateString) => {
    const date = new Date(dateString);
    setNewEvent({ ...newEvent, start: new Date(date.getTime() - date.getTimezoneOffset() * 60000) });
  };
  
  const handleEndDateChange = (dateString) => {
    const date = new Date(dateString);
    setNewEvent({ ...newEvent, end: new Date(date.getTime() - date.getTimezoneOffset() * 60000) });
  };
  
  
  return (
    <Card className=''>
      <CardContent className="p-5">
        <div className="">
          <div style={{ height: 765 }}>
            <Calendar
              localizer={localizer}
              events={myEventsList}
              startAccessor="start"
              endAccessor="end"
              eventPropGetter={eventStyle}
              components={{
                event: (props) => <EventComponent event={props.event} />, 
              }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-5">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Event name"
              value={newEvent.title}
              onChange={handleTitleChange}
            />
            <Input
              type="datetime-local"
              value={newEvent.start.toISOString().substring(0, 16)} 
              onChange={(e) => handleStartDateChange(new Date(e.target.value))}
            />
            <Input
              type="datetime-local"
              value={newEvent.end.toISOString().substring(0, 16)} 
              onChange={(e) => handleEndDateChange(new Date(e.target.value))}
            />
            <Button variant="secondary" onClick={handleAddEvent}>Add</Button>    
          </div>
        <Toaster position="bottom-right" />
        </CardFooter>
    </Card>
  );
};

export default MyCalendar;
