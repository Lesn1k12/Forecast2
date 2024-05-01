import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Register from './pages/authentication/Register'
import Login from './pages/authentication/Login'
import WalletPage from './pages/WalletPage'
import WalletComponent from './components/wallet/WalletComponent'
import AuthenticationPage from './pages/authentication/AuthenticationPage'
import NotFoundPage from './pages/NotFoundPage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'

import Transaction from './components/transactions/Transaction'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/authentication" element={<AuthenticationPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/transactions" element={<Transaction />} />
          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="/walletcomponent" element={<WalletComponent />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
