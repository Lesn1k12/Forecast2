import { Button } from "@/components/ui/button";
import { ContextProvider, useGlobalContext } from "../../context/GlobalContext";
import React from 'react'

function DeleteAsset({id}) {
    const {deleteAsset} = useGlobalContext();

  return (
    <Button variant="outline" onClick={() => deleteAsset(id)}>Delete</Button>
  )
}

export default DeleteAsset