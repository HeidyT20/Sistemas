import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Componetes/Login/Login';
import Home from './Componetes/Pages/Home';
import Digitalizar from './Componetes/Pages/Digitalizar';
import ProtectedRoute from './Componetes/ProtectedRoute.jsx';
import Download from './Componetes/Pages/Download';
import DownloadDoc from './Componetes/Pages/DownloadDoc.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" element={<Login />} 
        />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/digitalizar" 
          element={
            <ProtectedRoute>
              <Digitalizar />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/download" 
          element={
            <ProtectedRoute>
              <Download />
            </ProtectedRoute>
          } 
        />   
        <Route 
          path="/downloadDoc" 
          element={
            <ProtectedRoute>
              <DownloadDoc />
            </ProtectedRoute>
          } 
        /> 

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

