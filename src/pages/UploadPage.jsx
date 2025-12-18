import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSearchParams, redirect, useNavigate } from 'react-router-dom';
import UploadArea from '../components/pdf/UploadArea';
import { setLoading, resetPdfState } from '../store/pdfSlice';
import { useAuth } from '../hooks/useAuth';
import { canPerformAction } from '../utils/permissions';

const SimpleButton = ({ children, onClick, disabled, className }) => (
    <button 
        onClick={onClick} 
        disabled={disabled} 
        style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', fontWeight: '500', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.7 : 1, backgroundColor: disabled ? '#ccc' : (className.includes('bg-red') ? '#EF4444' : '#4F46E5'), color: 'white', marginTop: '10px', marginLeft: '10px' }}
        className={className}
    >
        {children}
    </button>
);


const UploadPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pdfFile, isLoading } = useSelector(state => state.pdf);
  const { role } = useAuth();

  useEffect(()=> {
    if (!canPerformAction(role, "upload")) {
      const params = createSearchParams({
        action: "upload",
        url: "/"
      });
      navigate(`/error?${params.toString()}`);
    }
  }, [role, navigate]);

  const handleGenerateMarkdown = () => {
    if (!pdfFile || isLoading) return;
    dispatch(setLoading(true));
    console.log(`Début de la génération IA pour : ${pdfFile.name}`);
    setTimeout(() => {
      dispatch(setLoading(false));
      navigate('/edit'); 
    }, 3000); 
  };
  
  const handleViewPdf = () => {
      if (pdfFile) {
          navigate('/edit');
      }
  };
  
  return (
  
    <div className="max-w-xl p-6 bg-white shadow-xl rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">1. Téléchargement et Traitement du PDF</h1>
      
      <UploadArea />
      
      {pdfFile && (
        <div className="mt-6 p-4 border border-green-200 bg-green-50 rounded-md">
          <p className="font-semibold text-green-700">Fichier sélectionné : {pdfFile.name}</p>
          
          <div className="flex justify-start space-x-4 mt-4">
            <SimpleButton 
              onClick={handleViewPdf}
              disabled={isLoading}
              className="bg-indigo-500" 
            >
              Voir PDF / Éditer
            </SimpleButton>

         
            <SimpleButton 
              onClick={handleGenerateMarkdown}
              disabled={isLoading}
              className="bg-purple-600" 
            >
              {isLoading ? "Traitement en cours ..." : "Lancer la génération IA"}
            </SimpleButton>

           
            <SimpleButton 
              onClick={() => dispatch(resetPdfState())}
              disabled={isLoading}
              className="bg-red-500" 
            >
              Annuler
            </SimpleButton>

          </div>
        </div>
      )}

      {isLoading && <p className="text-center text-indigo-600 mt-4">En attente de la réponse IA...</p>}
    </div>
  );
};

export default UploadPage;