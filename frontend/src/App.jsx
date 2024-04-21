import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Register from './pages/authentication/Register'
import Login from './pages/authentication/Login'
import WalletPage from './pages/WalletPage'
import AuthenticationPage from './pages/authentication/AuthenticationPage'
import NotFoundPage from './pages/NotFoundPage'
import DashboardPage from './pages/DashboardPage'


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/authentication" element={<AuthenticationPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboardpage" element={<DashboardPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/not-found" element={<NotFoundPage />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
