import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useMarkdownApi } from '../hooks/useMarkdownApi';
import { jsonToMarkdown } from '../utils/jsonToMarkdown';
import { useAuth } from '../hooks/useAuth';
import { canPerformAction } from '../utils/permissions';
import { markdownToJSON } from '../utils/markdownToJson';
import MarkdownToolbar from '../components/markdown/MarkdownToolbar';
import MarkdownEditor from '../components/markdown/MarkdownEditor';
import MarkdownVisualizer from '../components/markdown/MarkdownVisualizer';
import MarkdownDiff from '../components/markdown/MarkdownDiff';
import VersionHistory from '../components/markdown/VersionHistory';

const MarkdownPage = () => {

    const {id} = useParams();
    const {update, getFileById, loading, error } = useMarkdownApi();
    const [json, setJson] = useState(null);
    const [md, setMd] = useState("");
    const { role } = useAuth();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Brouillon')

    const [isEditMod, setIsEditMod] = useState(false);
    const [isSaving, setIsSaving] = useState(false); 
    const [isAddImage, setIsAddImage] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [oldMarkdown, setOldMarkdown] = useState();
    const [mode, setMode] = useState("view");

    useEffect(() => {
        if (!canPerformAction(role, "update")) {
            const params = createSearchParams({
                action: "update",
                url: "/edit"
            });
            navigate(`/error?${params.toString()}`);
        }
    }, [role, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getFileById(id);
                setJson(data);
                setMd(jsonToMarkdown(data));
            } catch (err) {
                console.error(err);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleToggleHistory = () => {
        setShowHistory(prev => !prev);
    }

    const handleToggleAddImage = () => {
        setIsAddImage(prev => !prev);
    }
    const handleToggleEdit = () => {
        
        if (mode === "view"){
            setMode("edit");
            setIsEditMod(prev => !prev);
        } else if (mode === "edit"){
            setMode("view")
            setIsEditMod(prev => !prev);
        } else {
            setMode("view");
            setIsEditMod(false);
        }

    }
    const handleSave = async () => {
        console.log(id);
        if (!md || !id) {
            console.log("ID ou Contenu manquant");
            return;
        };

        const markdownData = markdownToJSON(md);

        try {
            setIsSaving(true);
            await update(id, markdownData);
            const freshData = await getFileById(id);
            setMd(jsonToMarkdown(freshData));
            alert("Mise à jour réussie !");
        }catch (err) {
            console.error("Erreur lors de la mise à jour :", err);
            alert(err.message || "Erreur lors de la mise à jour");
        } finally {
            setIsSaving(false);
        }
    }
    const handleValidate = () => {
        setStatus('Validé');
    }

    const handleselectMode = (versionContent, targetMode) => {
    switch (targetMode) {
        case 'diff':
            setOldMarkdown(versionContent); // ancienne version
            setMode('diff');
            break;

        case 'edit': // restaurer
            setMd(versionContent);
            setMode('edit');
            setIsEditMod(true);
            break;

        case 'view':
        default:
            setOldMarkdown(null);
            setMode('view');
            break;
    }
};




    return (
        <div className="container mx-auto p-4">
            <div className="flex gap-6">
                <div className={`${showHistory ? 'w-3/4' : 'w-full'} transition-all duration-300`}>
                    <MarkdownToolbar
                        isEditing={isEditMod}
                        onToggleEdit={handleToggleEdit}
                        isAddImage={isAddImage}
                        onToggleAddImage={handleToggleAddImage}
                        isSaving={isSaving}
                        onSave={handleSave}
                        onValidate={handleValidate}
                        status={status}
                    />
                    <div>
                        <button
                            onClick={handleToggleHistory}
                        >
                            Show History
                        </button>
                    </div>

                    <div></div>

                    <div className="mt-4"></div>
                        {mode === 'edit' && (
                            <MarkdownEditor content={md} onChange={setMd} />
                        )}
                        
                        {mode === 'view' && (
                            <MarkdownVisualizer content={md} />
                        )}

                        {mode === 'diff' && (
                            <MarkdownDiff 
                                oldCode={oldMarkdown} 
                                newCode={md} 
                            />
                        )}
                    </div>
                </div>

                    {showHistory && (
                        <div className="w-1/4 animate-in slide-in-from-right duration-300">
                            <VersionHistory 
                                onSelectVersion={handleselectMode}
                                id={id}
                            />
                        </div>
                    )}
        </div>
    );
}

export default MarkdownPage