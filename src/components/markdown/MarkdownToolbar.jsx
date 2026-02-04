    // Actions métier (valider, publier, modifier)
    import React from 'react';
    import { Save, CheckCircle, UploadCloud, Edit3, Eye } from 'lucide-react';
    import { canPerformAction } from '../../utils/permissions';
    import { useAuth } from '../../hooks/useAuth';

    const MarkdownToolbar = ({
                                isEditing,
                                onToggleEdit,
                                onSave,
                                onValidate,
                                status,
                                isSaving
                            }) => {
        const {role} = useAuth();                       
        return (
            <div className="sticky top-0 z-10 flex items-center justify-between bg-white border-b border-gray-200 p-4 shadow-sm mb-4">

                {/* Partie Gauche : Statut */}
                <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Statut :
            </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        status === 'Validé' ? 'bg-green-100 text-green-800' :
                            status === 'Brouillon' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                    }`}>
            {status || 'Nouveau'}
            </span>
                </div>

                {/* Partie Droite : Actions */}
                <div className="flex items-center gap-3">
                    {/* Toggle Edit/View */}
                    <button
                        onClick={onToggleEdit}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-300 transition-colors"
                    >
                        {isEditing ? <><Eye size={16}/> Voir</> : <><Edit3 size={16}/> Éditer</>}
                    </button>

                    <div className="h-6 w-px bg-gray-300 mx-2"></div>

                    {/* Sauvegarder (Brouillon) */}
                    {canPerformAction(role, 'update') &&
                        <button
                            onClick={onSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm disabled:opacity-50 transition-colors"
                            >
                            <Save size={16} />
                            {isSaving ? 'Enregistrement...' : 'Sauvegarder'}
                        </button>
                    }
                    {/* Valider / Publier */}
                    {canPerformAction(role, "validate") && 
                        <button
                            onClick={onValidate}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm transition-colors"
                        >
                            {status === 'Validé' ? <UploadCloud size={16} /> : <CheckCircle size={16} />}
                            {status === 'Validé' ? 'Publier' : 'Valider'}
                        </button>
                    }
                </div>
            </div>
        );
    };

    export default MarkdownToolbar;