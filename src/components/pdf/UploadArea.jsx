import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { setPdfFile } from '../../store/pdfSlice';
import { UploadCloud } from 'lucide-react';
import { useModal } from '../../context/ModalContext';

const UploadArea = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.pdf.isLoading);
  const { showAlert } = useModal();

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length === 1 && acceptedFiles[0].type === 'application/pdf') {
      dispatch(setPdfFile(acceptedFiles[0]));
    } else {
      dispatch(setPdfFile(null));
      showAlert('Veuillez sélectionner un seul fichier PDF.', 'warning');
    }
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: isLoading,
  });

  const baseClasses = "relative group w-full h-64 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 ease-in-out cursor-pointer overflow-hidden";
  const activeClasses = isDragActive
    ? 'border-primary bg-primary/5 scale-[0.99]'
    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-soft';
  const disabledClasses = isLoading ? 'opacity-60 cursor-not-allowed' : '';

  return (
    <div
      {...getRootProps()}
      className={`${baseClasses} ${activeClasses} ${disabledClasses}`}
    >
      <input {...getInputProps()} />

      <div className="z-10 flex flex-col items-center text-center p-6 space-y-4">
        <div className={`p-4 rounded-full transition-colors duration-200 ${isDragActive ? 'bg-primary/20' : 'bg-white dark:bg-gray-700 shadow-sm'}`}>
          <UploadCloud size={32} className={`transition-colors duration-200 ${isDragActive ? 'text-primary-dark' : 'text-gray-400 dark:text-gray-300 group-hover:text-primary'}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {isDragActive ? "Lâchez le fichier !" : "Cliquez ou glissez un PDF"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">PDF jusqu'à 10MB accepté</p>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;