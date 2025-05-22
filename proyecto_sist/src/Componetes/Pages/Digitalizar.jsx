import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Digitalizar.css';
import { FaSignOutAlt} from "react-icons/fa";

function Digitalizar() {
  const [formData, setFormData] = useState({
    campo1: '',
    campo2: '',
    campo3: '',
    campo4: '',
  });

  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'text' ? value.toUpperCase() : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleClear = () => {
    setFormData({
      campo1: '',
      campo2: '',
      campo3: '',
      campo4: '',
    });
    setFiles([]);
    setError('');
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const allArePDF = selectedFiles.every(file => file.type === 'application/pdf');

    if (!allArePDF) {
      setError('Solo se permiten archivos PDF.');
      return;
    }

    const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 5 * 1024 * 1024) {
      setError('El tamaño total de los archivos no debe superar 5MB.');
      return;
    }

    setFiles(selectedFiles);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.campo1 || !formData.campo2 || !formData.campo3 || !formData.campo4) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('campo1', formData.campo1);
    formDataToSend.append('campo2', formData.campo2);
    formDataToSend.append('campo3', formData.campo3);
    formDataToSend.append('campo4', formData.campo4);

    files.forEach(file => formDataToSend.append('files', file));

    try {
      const response = await fetch('http://localhost:3001/api/documentos', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

      const result = await response.json(); // Cambiado a json()
    console.log('Respuesta del servidor:', result);
    alert(result.message || 'Documento guardado exitosamente');
    handleClear();
  } catch (err) {
    console.error('Error en la solicitud:', err);
    setError(err.message || 'Error al enviar el formulario.');
  }
};

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/');
  };

  return (
    <div className="Digitalizarcontainer">
      <div style={{ maxWidth: 600, margin: 'auto', fontFamily: 'Arial' }}>
        <h2>Digitalización de Documento</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Número de Documento:
            <input
              type="text"
              name="campo1"
              value={formData.campo1}
              onChange={handleChange}
              required
            />
          </label><br /><br />

          <label>
            Fecha de Elaboración del Documento:
            <input
              type="date"
              name="campo2"
              value={formData.campo2}
              onChange={handleChange}
              required
            />
          </label><br /><br />

          <label>
            Fecha de Ingreso al Sistema:
            <input
              type="date"
              name="campo3"
              value={formData.campo3}
              onChange={handleChange}
              required
            />
          </label><br /><br />

          <label>
            Propietario del Documento:
            <input
              type="text"
              name="campo4"
              value={formData.campo4}
              onChange={handleChange}
              required
            />
          </label><br /><br />

          <label>
            Adjuntar documentos (PDF, máx 5MB total):
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileChange}
            />
          </label>

          <p style={{ color: 'red' }}>
            Esta operación no tiene retorno, usted registrará el documento en este momento.
          </p>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          {files.length > 0 && (
            <div>
              <strong>Archivos adjuntos:</strong>
              <ul>
                {files.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}

          <button type="button" onClick={handleClear}>Limpiar</button>{' '}
          <button type="submit">Cargar Documento</button>{' '}
          <button className="Logout" onClick={handleLogout}> <FaSignOutAlt /> </button>
        </form>
      </div>
    </div>
  );
}

export default Digitalizar;