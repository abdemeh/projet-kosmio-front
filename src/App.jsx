import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import EditPage from './pages/EditPage';

function App() {
  return (
    
    <div className="App min-h-screen bg-gray-900">


      <div className="flex flex-grow justify-center items-center min-h-screen w-full">
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/edit" element={<EditPage />} />
        </Routes>
      </div>

    </div>
  );
}

export default App;