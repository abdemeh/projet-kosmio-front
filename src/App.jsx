import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import EditPage from './pages/EditPage';
import { AuthProvider } from './context/AuthContext';
import ErrorPage from './pages/ErrorPage';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<UploadPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/edit" element={<EditPage />} />
          <Route path="/error" element={<ErrorPage />} />
          {/* Placeholder routes for nav items */}
          <Route path="/solution" element={<div className="text-center py-20 text-gray-500">Test Solution</div>} />
          <Route path="/secteur" element={<div className="text-center py-20 text-gray-500">Test Secteur</div>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;