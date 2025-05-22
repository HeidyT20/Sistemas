import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Document from '../Document';
import Pagination from '../Pagination';
import './Download.css';
import { FaSignOutAlt} from "react-icons/fa";

const Download = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [documentos, setDocumentos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 15;

  const filtros = location.state || {};
  const { propietario, fechaInicio, fechaFinal } = filtros;

  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
        const body = {
          propietario,
          fechaInicio,
          fechaFinal
        };

        const response = await fetch('http://localhost:3001/api/consultar-documentos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        const data = await response.json();
        console.log('Documentos recibidos:', data);
        setDocumentos(data);
      } catch (error) {
        console.error('Error al obtener documentos:', error);
      }
    };

    // Ejecutar solo si todos los filtros están presentes
    if (propietario && fechaInicio && fechaFinal) {
      fetchDocumentos();
    }
  }, [propietario, fechaInicio, fechaFinal]);

  const documentosPaginados = documentos.slice(
    (paginaActual - 1) * porPagina,
    paginaActual * porPagina
  );

  const handleDescargarTodos = () => {
  documentosPaginados.forEach(doc => {
    if (doc.url_pdf) {
      const archivos = doc.url_pdf.split(';');
      archivos.forEach(url => {
        const link = document.createElement('a');
        link.href = `http://localhost:3001${url}`;
        link.download = '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  });
};


  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/');
  };

  return (
    <div className='Downloadcontainer'>
      <div className="Downloadp-4">
        <h2>Descarga de Documentos Digitalizados - Sección A</h2>

        {fechaInicio && fechaFinal && (
          <p>
            Mostrando resultados para <strong>{propietario || 'Todos'}</strong> del <strong>{fechaInicio}</strong> al <strong>{fechaFinal}</strong>
          </p>
        )}

        {documentos.length > 0 ? (
          <>
            <Document documentos={documentosPaginados} />

            <Pagination
              total={documentos.length}
              porPagina={porPagina}
              paginaActual={paginaActual}
              setPaginaActual={setPaginaActual}
            />

            <button onClick={handleDescargarTodos} style={{ marginTop: '1rem' }}>
              Descargar todo
            </button>
          </>
        ) : (
          <p>No se encontraron documentos para el rango de fechas seleccionado.</p>
        )}

        <button className="Logout" onClick={handleLogout}> <FaSignOutAlt /> </button>
      </div>
    </div>
  );
};

export default Download;
