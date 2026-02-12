import VersionHistory from './VersionHistory';
// Prévisualisation markdown page par page
const [mode, setMode] = useState('edit'); // 'edit', 'view', 'diff'
const [type, setType] = useState('solution');
const [markdown, setMarkdown] = useState(initialMarkdown);
const [originalMarkdown, setOriginalMarkdown] = useState(initialMarkdown); // Pour le diff
const [showHistory, setShowHistory] = useState(false);


const handleSelectedVersion = (versionContent, targetMode) => {
        if (targetMode === 'diff') {
            setOriginalMarkdown(versionContent);
            setMode('diff');
        } else if (targetMode === 'edit') {
            setMarkdown(versionContent);
            setMode('edit');
        } else {
            setMarkdown(versionContent);
            setMode('view');
        }
    };


return (
    <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
                <FicheTypeSelector currentType={type} onTypeChange={handleTypeChange} />
                <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md border ${showHistory ? 'bg-blue-600 text-white' : 'bg-white'}`}
                >
                    <History size={18} /> {showHistory ? "Fermer l'historique" : "Historique"}
                </button>
            </div>

        <div className="flex gap-6">
            <div className={`${showHistory ? 'w-3/4' : 'w-full'} transition-all duration-300`}>
                <MarkdownToolbar
                   isEditing={mode === 'edit'}
                    onToggleEdit={() => setMode(mode === 'edit' ? 'view' : 'edit')}
                    onShowDiff={() => setMode('diff')}
                />


            <div className="mt-4"></div>
                {mode === 'edit' && (
                    <MarkdownEditor content={markdown} onChange={setMarkdown} />
                )}
                  
                {mode === 'view' && (
                    <MarkdownVisualizer content={markdown} />
                )}

                {mode === 'diff' && (
                    <MarkdownDiff oldCode={originalMarkdown} newCode={markdown} />
                )}
            </div>
        </div>

                {showHistory && (
                    <div className="w-1/4 animate-in slide-in-from-right duration-300">
                        <VersionHistory 
                            versions={MOCK_VERSIONS} 
                            onSelectVersion={handleSelectVersion}
                            currentMarkdown={markdown}
                        />
                    </div>
                )}
            </div>
);