import React from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { toast } from "sonner";

const EventComponent = ({ event }) => {
  const { deleteEvent } = useGlobalContext();

  const handleDelete = async () => {
    try {
      await deleteEvent(event.id);
      toast.success("Event has been deleted.");
    } catch (error) {
      toast.error("Failed to delete event.");
    }
  };

  return (
    <div>
      <span>{event.title}</span>
      <button onClick={handleDelete} style={{ marginLeft: '10px', color: 'red' }}>Delete</button>
    </div>
  );
};

export default EventComponent;
