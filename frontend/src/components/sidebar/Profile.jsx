import React from "react";
import { useGlobalContext } from "../../context/GlobalContext";

function Profile() {
  const { getUser } = useGlobalContext();
  return (
    <div className="grid grid-rows-2 p-2">
      <span className="font-semibold">name</span>
      <span className="text-xs text-gray-600">mail</span>
    </div>
  );
}

export default Profile;
