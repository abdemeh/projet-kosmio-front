// Prévisualisation markdown page par page
const [mode, setMode] = useState('edit'); // 'edit', 'view', 'diff'
const [type, setType] = useState('solution');
const [markdown, setMarkdown] = useState(initialMarkdown);
const [originalMarkdown, setOriginalMarkdown] = useState(initialMarkdown); // Pour le diff

return (
    <div className="container mx-auto p-4">
        <FicheTypeSelector currentType={type} onTypeChange={handleTypeChange} />

        <MarkdownToolbar
            isEditing={mode === 'edit'}
            onToggleEdit={() => setMode(mode === 'edit' ? 'view' : 'edit')}
            // ...
        />

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
)