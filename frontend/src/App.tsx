import { useState } from 'react'

import './App.css'

import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Perso from './pages/Perso/Perso'
import Navbar from './components/Navbar'


function App() {
  return (
        <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/perso" element={<Perso />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
