// Édition d’un markdown (textarea +  + preview)

import { MilkdownProvider, useEditor } from '@milkdown/react';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm'; // Pour les tableaux !
import { nord } from '@milkdown/theme-nord';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { history } from '@milkdown/plugin-history';

// Composant interne qui initialise l'éditeur
const MilkdownEditorInternal = ({ content, onChange }) => {
    useEditor((root) => {
        return Editor.make()
            .config((ctx) => {
                ctx.set(rootCtx, root);
                // Définit la valeur initiale
                ctx.set(defaultValueCtx, content || "");

                // Écoute les changements
                ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
                    if (onChange && markdown !== prevMarkdown) {
                        onChange(markdown);
                    }
                });
            })
            .config(nord) // Thème
            .use(commonmark)
            .use(gfm) // Support des tableaux, task lists, etc.
            .use(history) // Undo/Redo
            .use(listener);
    }, [onChange]); // Attention: ne pas mettre 'content' ici pour éviter le re-render en boucle

    return <div className="milkdown-editor-container border border-gray-300 rounded-lg min-h-[calc(100vh-250px)] bg-white" />;};

// Wrapper avec le Provider
const MarkdownEditor = ({ content, onChange }) => {
    return (
        <div className="w-full prose prose-slate max-w-none">
            {/* Le key force le re-mount si le contenu initial change drastiquement (ex: changement de type de fiche) */}
            <MilkdownProvider key={content?.substring(0, 20)}>
                <MilkdownEditorInternal content={content} onChange={onChange} />
            </MilkdownProvider>
        </div>
    );
};

export default MarkdownEditor;