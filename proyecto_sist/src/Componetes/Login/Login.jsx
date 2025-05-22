import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que recargue la página

    if (username === 'admin' && password === '1234') {
        localStorage.setItem('auth', 'true'); 
      navigate('/home'); // Redirige al componente Home
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className='Wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>Documentitos</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder='Usuario'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <FaUser className='icon' />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder='Contraseña'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className='icon' />
        </div>
        <div className="remember-forgot">
          <label><input type="checkbox" />Recordar Usuario</label>
          <a href="#">¿Olvidó su contraseña?</a>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
