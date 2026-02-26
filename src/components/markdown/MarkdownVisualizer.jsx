import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownVisualizer = ({ content }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 py-4 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#FFD700]-500 via-yellow-500 to-[#FFD700]-500"></div>

        <div className="p-12">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  {...props}
                  className="text-4xl font-bold text-slate-900 mb-3 mt-0 tracking-tight text-left"
                />
              ),

              h2: ({ node, children, ...props }) => (
                <div className="mt-16 mb-8 first:mt-0">
                  <h2
                    {...props}
                    className="text-2xl font-semibold text-slate-800 mb-4 flex items-center gap-3 pb-3 border-b border-slate-200 text-left"
                  >
                    {children}
                  </h2>
                </div>
              ),

              h3: ({ node, ...props }) => (
                <h3
                  {...props}
                  className="text-xl font-semibold text-slate-700 mt-10 mb-4 text-left"
                />
              ),

              p: ({ node, ...props }) => (
                <p
                  {...props}
                  className="text-slate-600 leading-7 mb-5 text-[15px] text-justify hyphens-auto"
                />
              ),

              strong: ({ node, ...props }) => (
                <strong
                  {...props}
                  className="font-semibold text-slate-900"
                />
              ),

              ul: ({ node, ...props }) => (
                <ul
                  {...props}
                  className="space-y-2.5 mb-6 ml-1"
                />
              ),

              ol: ({ node, ...props }) => (
                <ol
                  {...props}
                  className="space-y-2.5 mb-6 ml-1"
                />
              ),

              li: ({ node, children, ...props }) => (
                <li
                  {...props}
                  className="text-slate-600 text-[15px] leading-7 pl-2 relative before:absolute before:left-[-16px] before:text-slate-400 text-justify hyphens-auto"
                >
                  {children}
                </li>
              ),

              a: ({ node, ...props }) => (
                <a
                  {...props}
                  className="text-blue-600 hover:text-blue-700 underline decoration-blue-300 hover:decoration-blue-500 underline-offset-2 transition-all duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),

              table: ({ node, ...props }) => (
                <div className="overflow-x-auto mb-8 mt-6 rounded-lg border border-slate-200">
                  <table
                    {...props}
                    className="min-w-full divide-y divide-slate-200"
                  />
                </div>
              ),

              thead: ({ node, ...props }) => (
                <thead
                  {...props}
                  className="bg-slate-50"
                />
              ),

              th: ({ node, ...props }) => (
                <th
                  {...props}
                  className="px-6 py-3.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider"
                />
              ),

              td: ({ node, ...props }) => (
                <td
                  {...props}
                  className="px-6 py-4 text-[15px] text-slate-600 border-t border-slate-100 text-justify"
                />
              ),

              tr: ({ node, ...props }) => (
                <tr
                  {...props}
                  className="hover:bg-slate-50/50 transition-colors duration-150"
                />
              ),

              hr: ({ node, ...props }) => (
                <hr
                  {...props}
                  className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"
                />
              ),

              code: ({ node, inline, ...props }) =>
                inline ? (
                  <code
                    {...props}
                    className="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded font-mono text-[13px] font-medium"
                  />
                ) : (
                  <code
                    {...props}
                    className="block bg-slate-50 border border-slate-200 p-5 rounded-lg text-[13px] font-mono overflow-x-auto my-5 text-slate-700 text-left"
                  />
                ),

              blockquote: ({ node, ...props }) => (
                <blockquote
                  {...props}
                  className="border-l-4 border-blue-500 bg-blue-50/50 pl-6 pr-4 py-4 my-6 rounded-r-lg italic text-slate-700 text-justify hyphens-auto"
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MarkdownVisualizer;