import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PDFPage from './PDFPage'; 

const EditPage = () => {
  const pdfFile = useSelector(state => state.pdf.pdfFile);
  
  // 1. Gérer la création de l'URL ici (dans le conteneur)
  const pdfUrl = useMemo(() => {
    if (pdfFile) {
      return URL.createObjectURL(pdfFile);
    }
    return null;
  }, [pdfFile]);
  
  if (!pdfFile) {
    // ... (affichage d'erreur si pas de fichier)
  }

 return (
    // Augmentons la largeur max du conteneur principal pour mieux voir les deux colonnes
    <div className="max-w-7xl mx-auto p-8 bg-white shadow-xl rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Aperçu du PDF : {pdfFile.name}</h2>
      
      {/* Container Flex pour côte à côte : flex-1 assure que chaque colonne prend la moitié */}
      <div className="flex space-x-8">
        
        {/* Colonne 1 : Aperçu PDF */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold mb-2">Aperçu PDF</h3>
          <div className="border border-gray-400 rounded-md overflow-hidden shadow-lg">
             {/* CORRECTIF CRUCIAL : 
                1. Mettre width="100%" et height="800px" sur l'iframe pour remplir le div parent.
                2. S'assurer que le navigateur affiche la barre de défilement du PDF lui-même.
             */}
            <iframe 
              src={pdfUrl} 
              width="100%" 
              height="800px" // Hauteur fixe pour éviter le débordement
              title={`Aperçu de ${pdfFile.name}`}
              className="border-none"
              // Ajout potentiel : permet au navigateur de déterminer le mode d'affichage
              // type="application/pdf"
            >
              Votre navigateur ne supporte pas l'affichage des PDF via iframe.
            </iframe>
          </div>
        </div>

        {/* Colonne 2 : Zone d'Édition Markdown (Futur composant) */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold mb-2">Zone d'Édition Markdown</h3>
          <div className="bg-gray-100 p-4 h-[800px] border border-dashed rounded-md flex items-center justify-center text-gray-500">
              Contenu Markdown généré par l'IA ici...
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditPage;