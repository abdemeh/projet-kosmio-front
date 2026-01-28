// Affichage en lecture seule d’un markdown

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownVisualizer = ({ content }) => {
    return (
        <div className="prose prose-sm max-w-none p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Personnalisation possible des éléments ici (ex: liens en bleu)
                    a: ({node, ...props}) => <a {...props} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" />,
                    table: ({node, ...props}) => <table {...props} className="min-w-full border-collapse border border-gray-300" />,
                    th: ({node, ...props}) => <th {...props} className="bg-gray-100 border border-gray-300 px-4 py-2" />,
                    td: ({node, ...props}) => <td {...props} className="border border-gray-300 px-4 py-2" />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownVisualizer;