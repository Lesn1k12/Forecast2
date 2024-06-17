import React, { useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { RiContactsBook2Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";


const SidebarContact = ({ handleReceiverChange }) => {
  const [expanded, setExpanded] = useState(false);
  const { allUsers } = useGlobalContext();

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="relative">
      {!expanded && (
        <Button
          variant="ghost"
          onClick={toggleExpanded}
          className="absolute top-8 right-12 z-50 rounded-lg p-2 hover:bg-gray-200"
        >
          <RiContactsBook2Line size={20} />
        </Button>
      )}
      {expanded && (
        <Card className="fixed p-5 top-16 right-4 z-40 shadow-lg bg-white border border-gray-300 rounded-lg">
          <CardContent className="p-0">
            <div className="flex justify-between items-center p-4 border-b border-gray-300">
              <h1 className="font-semibold text-lg">Select Receiver</h1>
              <Button
                variant="ghost"
                onClick={toggleExpanded}
                className="absolute top-1 right-1 rounded-lg p-2 hover:bg-gray-200"
              >
                <RiContactsBook2Line size={20} />
              </Button>
            </div>
            <ScrollArea className="h-72 overflow-y-auto">
              <div className="p-4">
                {allUsers.map(user => (
                  <div key={user.id}>
                    <div
                      onClick={() => {
                        handleReceiverChange({ target: { value: user.id } });
                        setExpanded(false);
                      }}
                      className="flex items-center p-2 mb-2 rounded-lg cursor-pointer hover:bg-gray-100"
                    >
                      <span className="truncate">{user.username}</span>
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SidebarContact;
