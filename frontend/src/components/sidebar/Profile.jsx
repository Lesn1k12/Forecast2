import {useEffect} from "react";
import { useGlobalContext } from "../../context/GlobalContext";

function Profile() {
  const { userData, getUser } = useGlobalContext();

  useEffect(() =>{
    getUser()
  }, []);

  return (
    <div className="grid grid-rows-2 p-2">
      <span className="font-semibold">{userData.username}</span>
      <span className="text-xs text-gray-600">{userData.email}</span>
      <span className="text-xs text-gray-600">{userData.public_key}</span>
    </div>
  );
}

export default Profile;
