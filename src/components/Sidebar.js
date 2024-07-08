import React from 'react';
import { Link } from 'react-router-dom';
import './css/Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/Antena">Antena</Link></li>
        <li><Link to="/Satelites">Satélite</Link></li>
      </ul>

      {/* Texto "CEMCC" y logo */}
      <div className="sidebar-footer">
        <img src="/logo192.png" alt="Logo CEMCC" className="sidebar-logo" />
        <span className="sidebar-text">CEMCC</span>
      </div>
    </aside>
  );
}

export default Sidebar;
