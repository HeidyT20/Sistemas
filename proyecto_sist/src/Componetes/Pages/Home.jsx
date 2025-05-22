import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../Assets/logo.jpeg';
import './Home.css';
import { FaSignOutAlt} from "react-icons/fa";


const Home = () => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setOpcionSeleccionada(event.target.value);
  };

  const handleConsultar = () => {
    if (opcionSeleccionada === 'carga') {
      navigate('/digitalizar');
    } else if (opcionSeleccionada === 'descarga') {
      navigate('/downloadDoc');
    } else {
      alert('Por favor seleccione una opción válida.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth'); // Elimina la sesión
    navigate('/'); // Redirige al login
  };

  return (
    <div className="background">
      <div className="Homecontainer">
        <img src={logo} alt="Logo de la institución" className="Homelogo" />
        <h1 className="Hometitle">Documentos Digitalizados</h1>
        <select className="Homeselect" onChange={handleChange} value={opcionSeleccionada}>
          <option value="">Seleccione una opción</option>
          <option value="carga">Carga</option>
          <option value="descarga">Descarga</option>
        </select>
        <br />
        <button className="Homebutton" onClick={handleConsultar}>Consultar</button>
      </div>
      <button className="Logout" onClick={handleLogout}> <FaSignOutAlt /> </button>
    </div>
  );
};

export default Home;
