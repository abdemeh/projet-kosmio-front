// Édition d'un markdown (textarea + preview)
import { MilkdownProvider } from '@milkdown/react';
import { Milkdown, useEditor } from '@milkdown/react';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { nord } from '@milkdown/theme-nord';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { history } from '@milkdown/plugin-history';

// Composant interne qui initialise l'éditeur
const MilkdownEditorInternal = ({ content, onChange }) => {
  const { get } = useEditor((root) => 
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, content || "");
        
        ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
          if (onChange && markdown !== prevMarkdown) {
            onChange(markdown);
          }
        });
      })
      .config(nord)
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(listener)
  );

  return (
    <div className="border border-gray-300 rounded-lg min-h-[calc(100vh-250px)] bg-white p-4">
      <Milkdown />
    </div>
  );
};

// Wrapper avec le Provider
const MarkdownEditor = ({ content, onChange }) => {
  return (
    <div className="w-full prose prose-slate max-w-none">
      <MilkdownProvider>
        <MilkdownEditorInternal content={content} onChange={onChange} />
      </MilkdownProvider>
    </div>
  );
};

export default MarkdownEditor;