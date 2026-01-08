import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import EditPage from './pages/EditPage';
import { AuthProvider } from './context/AuthContext';
import AuthDevSwitcher from './components/dev/AuthDevSwitcher';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <AuthProvider>
      <div className="App min-h-screen bg-gray-900">


        <div className="flex flex-grow justify-center items-center min-h-screen w-full">
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/edit" element={<EditPage />} />
            <Route path="/error" element={<ErrorPage/>} />
          </Routes>
        </div>
        
      </div>
      <AuthDevSwitcher/>
    </AuthProvider>
  );
}

export default App;