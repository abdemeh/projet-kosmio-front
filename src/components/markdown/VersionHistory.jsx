import React, { useEffect, useState } from 'react';
import { History, RotateCcw, Eye, GitCompare } from 'lucide-react';
import { useMarkdownApi } from '../../hooks/useMarkdownApi';
import { jsonToMarkdown } from '../../utils/jsonToMarkdown';

const VersionHistory = ({ id, onSelectVersion }) => {
    const [versions, setVersions] = useState([]);
    const { getHistoryById } = useMarkdownApi();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getHistoryById(id);
                setVersions(data);
            } catch (err) {
                console.error(err);
            }
        };
        if (id) fetchData();
    }, [id, getHistoryById]);

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-4 h-full transition-colors duration-300">
            {/* Title */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                <History size={16} className="text-gray-400 dark:text-gray-500" />
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Historique des versions
                </h3>
            </div>

            {versions.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-6">Pas d'ancienne version.</p>
            ) : (
                <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
                    {versions.map((v, index) => (
                        <div
                            key={v.id || index}
                            className="p-3 border border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            {/* Version date */}
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                {new Date(v.metadata.last_update).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </p>

                            {/* Action buttons */}
                            <div className="flex flex-col gap-1.5">
                                {/* Voir — grey ghost */}
                                <button
                                    onClick={() => onSelectVersion(jsonToMarkdown(v), 'view')}
                                    className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                                >
                                    <Eye size={13} className="flex-shrink-0" />
                                    Voir
                                </button>

                                {/* Diff — yellow hover */}
                                <button
                                    onClick={() => onSelectVersion(jsonToMarkdown(v), 'diff')}
                                    className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-[#FFD700] hover:text-gray-900 transition-all duration-200"
                                >
                                    <GitCompare size={13} className="flex-shrink-0" />
                                    Diff
                                </button>

                                {/* Restaurer — green ghost */}
                                <button
                                    onClick={() => {
                                        if (window.confirm('Restaurer cette version ?')) {
                                            onSelectVersion(jsonToMarkdown(v), 'edit');
                                        }
                                    }}
                                    className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                                >
                                    <RotateCcw size={13} className="flex-shrink-0" />
                                    Restaurer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VersionHistory;