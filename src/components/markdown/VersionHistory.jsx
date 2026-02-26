import React, { useEffect, useState } from 'react';
import { History, RotateCcw, Eye } from 'lucide-react';
import { useMarkdownApi } from '../../hooks/useMarkdownApi';
import { jsonToMarkdown } from '../../utils/jsonToMarkdown';

const VersionHistory = ({ id, onSelectVersion }) => {
    const [versions, setVersions] = useState([])
    const {getHistoryById} = useMarkdownApi();
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
    console.log(versions);

    if (versions.length === 0) return (<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 h-full"><p className="flex items-center gap-2 mb-4 text-blue-600 font-semibold">Pas d'ancienne version !</p></div>);
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 h-full">
            <div className="flex items-center gap-2 mb-4 text-blue-600 font-semibold">
                <History size={20} />
                <h3>Historique des versions</h3>
            </div>
            
            <div className="space-y-3 overflow-y-auto max-h-[600px]">
                {versions.map((v, index) => (
                
                    <div 
                        key={v.id || index} 
                        className="group p-3 border rounded-md hover:bg-slate-50 transition-colors border-slate-200"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-sm font-medium text-slate-900">
                                    Version du {new Date(v.metadata.last_update).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => onSelectVersion(jsonToMarkdown(v), 'view')}
                                className="flex items-center gap-1 text-xs bg-white border border-slate-300 px-2 py-1 rounded hover:bg-slate-100"
                            >
                                <Eye size={14} /> Voir
                            </button>
                            <button
                                onClick={() => onSelectVersion(jsonToMarkdown(v), 'diff')}
                                className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-100"
                            >
                                <History size={14} /> Diff
                            </button>
                            <button
                                onClick={() => {
                                    if(window.confirm("Restaurer cette version ?")) {
                                        onSelectVersion(jsonToMarkdown(v), 'edit');
                                    }
                                }}
                                className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded hover:bg-green-100"
                            >
                                <RotateCcw size={14} /> Restaurer
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VersionHistory;