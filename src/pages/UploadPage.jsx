import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSearchParams, useNavigate } from 'react-router-dom';
import UploadArea from '../components/pdf/UploadArea';
import { setId, setLoading, resetPdfState, setGeneratedJson, setMarkdown, setType } from '../store/pdfSlice';
import { useAuth } from '../hooks/useAuth';
import { canPerformAction } from '../utils/permissions';
import { useMarkdownApi } from '../hooks/useMarkdownApi';
import { jsonToMarkdown } from '../utils/jsonToMarkdown';
import FicheTypeSelector from '../components/markdown/FicheTypeSelector';
import { FileText, Eye, Wand2, Trash2, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const SimpleButton = ({ children, onClick, disabled, className, icon: Icon }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
            flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
        `}
  >
    {Icon && <Icon size={16} />}
    {children}
  </button>
);


const UploadPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { pdfFile, type } = useSelector(state => state.pdf);
  const { role } = useAuth();
  const { loading: apiLoading, generateInfo } = useMarkdownApi('solution');

  useEffect(() => {
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
      dispatch(setId(result.id));
      navigate('/edit');
    } catch (err) {
      console.error("Erreur lors de la génération IA :", err);
      alert(err.message || "Erreur lors de la génération IA");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleType = (newType) => {
    dispatch(setType(newType))
    console.log(type);
  }

  const handleViewPdf = () => {
    if (pdfFile) {
      navigate('/edit');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-2">Nouveau Document</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Importez un PDF pour extraire et structurer les données automatiquement.</p>
        </div>

        <FicheTypeSelector currentType={type} onTypeChange={handleType} />

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800">
          <UploadArea />

          {pdfFile && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-4 p-4 border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl mb-6">
                <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 flex items-center justify-center shadow-sm">
                  <FileText className="text-primary-dark" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{pdfFile.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <SimpleButton
                  onClick={handleViewPdf}
                  disabled={apiLoading}
                  className="text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 w-full sm:w-auto min-w-[140px] rounded-full"
                  icon={Eye}
                >
                  Voir PDF
                </SimpleButton>

                <SimpleButton
                  onClick={handleGenerateMarkdown}
                  disabled={apiLoading}
                  className="bg-[#FFD700] text-gray-900 font-bold hover:bg-[#E6C200] w-full sm:w-auto min-w-[200px] rounded-full transition-colors duration-200"
                  icon={apiLoading ? Loader2 : Wand2}
                >
                  {apiLoading ? "Traitement en cours..." : "Génération IA"}
                </SimpleButton>

                <SimpleButton
                  onClick={() => dispatch(resetPdfState())}
                  disabled={apiLoading}
                  className="text-gray-900 dark:text-gray-100 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full sm:w-auto rounded-full"
                  icon={Trash2}
                >
                  Annuler
                </SimpleButton>
              </div>
            </div>
          )}

          {apiLoading && (
            <div className="mt-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-full max-w-xs bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-primary animate-progress"></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Analyse du document en cours...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;