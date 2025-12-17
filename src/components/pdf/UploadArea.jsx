import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { setPdfFile } from '../../store/pdfSlice'; 


const UploadArea = () => {
  const dispatch = useDispatch();
  
  const isLoading = useSelector(state => state.pdf.isLoading); 

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length === 1 && acceptedFiles[0].type === 'application/pdf') {
      dispatch(setPdfFile(acceptedFiles[0]));
    } else {
      dispatch(setPdfFile(null)); // Réinitialiser l'état
      alert("Veuillez sélectionner un seul fichier PDF.");
    }
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: isLoading, 
  });

  
  const baseClasses = "p-10 border-2 border-dashed rounded-lg text-center cursor-pointer";
  const activeClasses = isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400';
  const disabledClasses = isLoading ? 'opacity-60 cursor-not-allowed' : '';

  return (
    <div 
      {...getRootProps()} 
      className={`${baseClasses} ${activeClasses} ${disabledClasses}`}
    >
      <input {...getInputProps()} />
      <p className="mt-2 text-gray-600">
        {isDragActive 
          ? "Déposez le PDF maintenant..." 
          : "Glissez-déposez ou cliquez pour sélectionner un PDF"}
      </p>
    </div>
  );
};

export default UploadArea;