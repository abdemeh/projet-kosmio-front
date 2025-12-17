import React, { useEffect } from 'react';


const PDFPage = ({ pdfUrl }) => {

    
    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    if (!pdfUrl) {
        return <div className="text-center text-gray-500">Chargement du PDF...</div>;
    }

    return (
        <div className="border border-gray-400 rounded-md overflow-hidden shadow-lg h-[800px]">
            <iframe 
                src={pdfUrl} 
                width="100%" 
                height="100%" 
                title="Aperçu du Fichier PDF"
                className="border-none"
            >
                Votre navigateur ne supporte pas l'affichage des PDF via iframe.
            </iframe>
        </div>
    );
};

export default PDFPage;