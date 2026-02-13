import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import EditPage from './pages/EditPage';
import { AuthProvider } from './context/AuthContext';
import ErrorPage from './pages/ErrorPage';
import MainLayout from './layouts/MainLayout';
import Solution from './pages/Solution';
import Sector from './pages/Sector';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<UploadPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/edit" element={<EditPage />} />
            <Route path="/error" element={<ErrorPage />} />
            {/* Placeholder routes for nav items */}
            <Route path="/solution" element={<Solution />} />
            <Route path="/secteur" element={<Sector />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;