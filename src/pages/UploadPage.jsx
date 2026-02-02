import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSearchParams, redirect, useNavigate } from 'react-router-dom';
import UploadArea from '../components/pdf/UploadArea';
import { setLoading, resetPdfState, setGeneratedJson, setMarkdown } from '../store/pdfSlice';
import { useAuth } from '../hooks/useAuth';
import { canPerformAction } from '../utils/permissions';
import { useMarkdownApi } from '../hooks/useMarkdownApi';
import { jsonToMarkdown } from '../utils/jsonToMarkdown';

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
  const { pdfFile } = useSelector(state => state.pdf);
  const { role } = useAuth();
  const {loading: apiLoading, error, generateInfo } = useMarkdownApi('solution');

  useEffect(()=> {
    if (!canPerformAction(role, "upload")) {
      const params = createSearchParams({
        action: "upload",
        url: "/"
      });
      navigate(`/error?${params.toString()}`);
    }
  }, [role, navigate]);

  const handleGenerateMarkdown = async () => {
    if (!pdfFile || apiLoading) return;
    dispatch(setLoading(true));
    try {
      console.log(`Début de la génération IA pour : ${pdfFile.name}`); 
      let result = await generateInfo(pdfFile);

      if (typeof result === "string") {
        result = JSON.parse(result);
      }

      dispatch(setGeneratedJson(result));
      dispatch(setMarkdown(jsonToMarkdown(result)));
      console.log("🔵 result:", result);
      console.log("🔵 typeof result:", typeof result);
      console.log("🔵 keys:", Object.keys(result));
      console.log("🔵 result.type:", result?.type);
      navigate('/edit');
    }catch (err) {
      console.error("Erreur lors de la génération IA :", err);
      alert(err.message || "Erreur lors de la génération IA");
    }finally{
      dispatch(setLoading(false));
    }
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
              disabled={apiLoading}
              className="bg-indigo-500" 
            >
              Voir PDF / Éditer
            </SimpleButton>

         
            <SimpleButton 
              onClick={handleGenerateMarkdown}
              disabled={apiLoading}
              className="bg-purple-600" 
            >
              {apiLoading ? "Traitement en cours ..." : "Lancer la génération IA"}
            </SimpleButton>

           
            <SimpleButton 
              onClick={() => dispatch(resetPdfState())}
              disabled={apiLoading}
              className="bg-red-500" 
            >
              Annuler
            </SimpleButton>

          </div>
        </div>
      )}

      {apiLoading && <p className="text-center text-indigo-600 mt-4">En attente de la réponse IA...</p>}
    </div>
  );
};

export default UploadPage;