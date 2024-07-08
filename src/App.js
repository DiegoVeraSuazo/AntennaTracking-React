import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Inicio from './pages/Inicio';
import Antena from './pages/AntenaControlPage';
import Satelite from './pages/SatelliteListPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="main-content">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/Antena" element={<Antena />} />
              <Route path="/Satelites" element={<Satelite />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
