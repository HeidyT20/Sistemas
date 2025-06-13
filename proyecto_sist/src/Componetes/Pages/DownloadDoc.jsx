import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DownloadDocs.css';
import { FaSignOutAlt} from "react-icons/fa";

function DownloadDoc() {
  const navigate = useNavigate();
  const [propietarios, setPropietarios] = useState([]);
  const [propietario, setPropietario] = useState('Todos');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');

  useEffect(() => {
  const fetchPropietarios = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/propietarios');
      const data = await response.json();
      console.log('Propietarios recibidos:', data); 
      setPropietarios(['Todos', ...data]);
    } catch (error) {
      console.error('Error al obtener propietarios:', error);
    }
  };
  fetchPropietarios();
}, []);

  const handleConsultar = (e) => {
    e.preventDefault();
    
    if (!propietario || !fechaInicio || !fechaFinal) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Pasar los parámetros a la ruta /download
    navigate('/download', {
      state: {
        propietario,
        fechaInicio,
        fechaFinal
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/');
  };

  return (
    <div className='Downcontainer'>
      <h2>Descarga de Documentos Digitalizados</h2>
      <form onSubmit={handleConsultar}>
        <div className='Downselect'>
          <label>Propietario:</label>
          <select className='Downborder p'
            value={propietario}
            onChange={(e) => setPropietario(e.target.value)}
            required>
            {propietarios.map((p, i) => (
             <option key={i} value={p}>
                {p}
            </option>
            ))}
          </select>
        </div>
        <div className='Downselect'>
          <label>Fecha de Inicio:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            required
          />

          <label>Fecha Final:</label>
          <input
            type="date"
            value={fechaFinal}
            onChange={(e) => setFechaFinal(e.target.value)}
            required
          />
        </div>
        <button className="button" type="submit">Consultar</button>
        <button className="Logout" onClick={handleLogout}> <FaSignOutAlt /> </button>
      </form>
    </div>
  );
}

export default DownloadDoc;