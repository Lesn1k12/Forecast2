import React from 'react'
import { useGlobalContext } from "../../context/GlobalContext";

const SendAnalitics = () => {
    const { sendMail } = useGlobalContext();

    return (
        <button className="fustify-content-center" onClick={sendMail}>Send Analitics</button>
    )
}

export default SendAnalitics