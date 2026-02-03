import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PDFPage from './PDFPage'; 
import { useAuth } from '../hooks/useAuth';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { canPerformAction } from '../utils/permissions';

const EditPage = () => {
  const { pdfFile, markdown } = useSelector(state => state.pdf);
  const {role} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!canPerformAction(role, "update")) {
        const params = createSearchParams({
            action: "update",
            url: "/edit"
        });
        navigate(`/error?${params.toString()}`);
    }
  }, [role, navigate]);
  
  // 1. Gérer la création de l'URL ici (dans le conteneur)
  const pdfUrl = useMemo(() => {
    if (pdfFile) {
      return URL.createObjectURL(pdfFile);
    }
    return null;
  }, [pdfFile]);
  
  if (!pdfFile) {
        return (
            <div className="max-w-7xl mx-auto p-8">
                <p className="text-gray-600">Erreur lors de la génération ou pas de PDF</p>
                <button 
                    onClick={() => navigate('/upload')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Uploader un PDF
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-8 bg-white shadow-xl rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Aperçu du PDF : {pdfFile.name}
            </h2>
            
            <div className="flex space-x-8">
                {/* Colonne PDF */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold mb-2">Aperçu PDF</h3>
                    <div className="border border-gray-400 rounded-md overflow-hidden shadow-lg">
                        <iframe 
                            src={pdfUrl} 
                            width="100%" 
                            height="800px"
                            title={`Aperçu de ${pdfFile.name}`}
                            className="border-none"
                        >
                            Votre navigateur ne supporte pas l'affichage des PDF.
                        </iframe>
                    </div>
                </div>

                {/* Colonne Markdown */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold mb-2">
                        Markdown Généré
                    </h3>
                    <textarea 
                        value={markdown || "Génération du markdown en cours..."}
                        readOnly
                        className="bg-gray-100 p-4 h-[800px] border rounded-md w-full font-mono text-sm text-gray-800 resize-none"
                        placeholder="Le markdown apparaîtra ici après la génération"
                    />
                </div>
            </div>
        </div>
    );
};

export default EditPage;