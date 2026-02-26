import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import { createSearchParams, useNavigate, useParams } from 'react-router-dom';
import { canPerformAction } from '../utils/permissions';
import MarkdownToolbar from '../components/markdown/MarkdownToolbar';
import MarkdownEditor from '../components/markdown/MarkdownEditor';
import MarkdownVisualizer from '../components/markdown/MarkdownVisualizer';
import { ArrowLeft, FileText } from 'lucide-react';
import { markdownToJSON } from "../utils/markdownToJson";
import { useMarkdownApi } from '../hooks/useMarkdownApi';
import { setMarkdown } from '../store/pdfSlice';
import { useModal } from '../context/ModalContext';

const EditPage = () => {
    const { id: paramId } = useParams();

    const { pdfFile, markdown, id: storeId } = useSelector(state => state.pdf);


    const currentId = paramId || storeId;

    const { role } = useAuth();
    const navigate = useNavigate();
    const [isEditMod, setIsEditMode] = useState(false);
    const [status, setStatus] = useState('Brouillon');
    const [isSaving, setIsSaving] = useState(false);


    const [content, setContent] = useState(markdown || "");

    const { update, loading, error } = useMarkdownApi();
    const [isAddImage, setIsAddImage] = useState(false);
    const dispatch = useDispatch();
    const { showAlert } = useModal();

    useEffect(() => {
        if (!canPerformAction(role, "update")) {
            const params = createSearchParams({
                action: "update",
                url: "/edit"
            });
            navigate(`/error?${params.toString()}`);
        }
    }, [role, navigate]);

    const handleToggleAddImage = () => setIsAddImage(prev => !prev)
    const handleToggleEdit = () => setIsEditMode(prev => !prev);

    const handleSave = async () => {
        console.log(currentId);
        if (!content || !currentId) {
            console.log("ID ou Contenu manquant");
            return;
        };
        const markdownData = markdownToJSON(content);

        try {
            setIsSaving(true);
            const result = await update(currentId, markdownData);
            console.log("Update réussi :", result);
            dispatch(setMarkdown(content))
            showAlert('Mise à jour réussie !', 'success');
        } catch (err) {
            console.error('Erreur lors de la mise à jour :', err);
            showAlert(err.message || 'Erreur lors de la mise à jour', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleValidate = () => {
        setStatus('Validé');
    }

    const pdfUrl = useMemo(() => {
        if (pdfFile) {
            return URL.createObjectURL(pdfFile);
        }
        return null;
    }, [pdfFile]);


    if (!pdfFile && !content && !paramId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-full mb-6">
                    <FileText size={48} className="text-gray-300 dark:text-gray-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Aucun document chargé</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">Veuillez sélectionner un fichier PDF ou une solution existante.</p>
                <button
                    onClick={() => navigate('/upload')}
                    className="px-6 py-3 bg-primary text-gray-900 font-medium rounded-lg hover:bg-primary-light transition-colors shadow-sm hover:shadow-md"
                >
                    Retour à l'accueil
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            {pdfFile?.name || "Édition Solution"}
                            <span className="px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-normal border border-yellow-200 dark:border-yellow-800">
                                {status}
                            </span>
                        </h2>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 gap-6 min-h-0 ">
                {/* Colonne PDF ou Placeholder si pas de PDF */}
                <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Document Original</h3>
                    </div>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 overflow-hidden relative flex items-center justify-center">
                        {pdfUrl ? (
                            <iframe
                                src={pdfUrl}
                                width="100%"
                                height="100%"
                                title={`Aperçu`}
                                className="border-none w-full h-full"
                            >
                                Votre navigateur ne supporte pas l'affichage des PDF.
                            </iframe>
                        ) : (
                            <p className="text-gray-400 dark:text-gray-500 text-sm p-4 text-center">
                                Document PDF non disponible <br /> (Mode édition texte seul)
                            </p>
                        )}
                    </div>
                </div>

                {/* Colonne Markdown */}
                <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-2 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 z-10">
                        <MarkdownToolbar
                            isEditing={isEditMod}
                            isAddImage={isAddImage}
                            onToggleEdit={handleToggleEdit}
                            onToggleAddImage={handleToggleAddImage}
                            onSave={handleSave}
                            onValidate={handleValidate}
                            status={status}
                            isSaving={isSaving}
                        />
                    </div>

                    <div className="flex-1 overflow-auto bg-white dark:bg-gray-900">
                        {!isEditMod ? (
                            <div className="p-6 prose prose-sm dark:prose-invert max-w-none">
                                <MarkdownVisualizer content={content}></MarkdownVisualizer>
                            </div>
                        ) : (
                            <MarkdownEditor content={content} onChange={setContent}></MarkdownEditor>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPage;