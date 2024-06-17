import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import EventComponent from "./Event";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGlobalContext } from "@/context/GlobalContext";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

const MyCalendar = () => {
  const { fetchEvents, addEvent } = useGlobalContext();
  const [myEventsList, setMyEventsList] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
  });

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

  useEffect(() => {
    const getEvents = async () => {
      try {
        const events = await fetchEvents();
        const formattedEvents = events.map((event) => ({
          ...event,
          start: new Date(event.start_time),
          end: new Date(event.end_time),
        }));
        setMyEventsList(formattedEvents);
      } catch (error) {
        toast.error("Error fetching events.");
      }
    };

    getEvents();
  }, [fetchEvents]);

  const handleAddEvent = async () => {
    if (!newEvent.title.trim()) {
      toast.error("Event name cannot be empty.");
      return;
    }

    try {
      const addedEvent = await addEvent(newEvent);
      const formattedEvent = {
        ...addedEvent,
        start: new Date(addedEvent.start_time),
        end: new Date(addedEvent.end_time),
      };
      setMyEventsList((prevEvents) => [...prevEvents, formattedEvent]);
      setNewEvent({ title: "", start: new Date(), end: new Date() });
      toast.success("Event has been created.");
    } catch (error) {
      toast.error("Failed to create event.");
    }
  };

  const handleTitleChange = (e) => {
    setNewEvent({ ...newEvent, title: e.target.value });
  };

  const handleStartDateChange = (e) => {
    const date = new Date(e.target.value);
    setNewEvent({ ...newEvent, start: date });
  };

  const handleEndDateChange = (e) => {
    const date = new Date(e.target.value);
    setNewEvent({ ...newEvent, end: date });
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().substring(0, 16);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-5 flex-grow">
        <div>
          <div style={{ height: 760 }}>
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
            value={formatDateForInput(newEvent.start)}
            onChange={handleStartDateChange}
          />
          <Input
            type="datetime-local"
            value={formatDateForInput(newEvent.end)}
            onChange={handleEndDateChange}
          />
          <Button variant="secondary" onClick={handleAddEvent}>
            Add
          </Button>
        </div>
        <Toaster position="bottom-right" />
      </CardFooter>
    </Card>
  );
};

export default MyCalendar;
