// Actions métier (valider, publier, modifier)
import React from 'react';
import { Save, CheckCircle, UploadCloud, Edit3, Eye, Paperclip, Clock } from 'lucide-react';
import { canPerformAction } from '../../utils/permissions';
import { useAuth } from '../../hooks/useAuth';
import DropDownAddImage from './DropDownAddImage';

const MarkdownToolbar = ({
    isEditing,
    isAddImage,
    onToggleEdit,
    onToggleAddImage,
    onSave,
    onValidate,
    status,
    isSaving,
    showHistory,
    onToggleHistory,
}) => {
    const { role } = useAuth();
    return (
        <div className="flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-3 mb-2 transition-colors duration-300">

            {/* Partie Gauche : Statut */}
            <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Statut
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${status === 'Validé' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' :
                    status === 'Brouillon' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' :
                        'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-700'
                    }`}>
                    {status || 'Nouveau'}
                </span>
            </div>

            {/* Partie Droite : Actions */}
            <div className="flex items-center gap-2">
                {/* Historique */}
                {onToggleHistory && (
                    <button
                        onClick={onToggleHistory}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${showHistory
                            ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
                            : 'text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 border-gray-200 dark:border-gray-700'
                            }`}
                    >
                        <Clock size={14} />
                        Historique
                    </button>
                )}

                <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                {/* Toggle Edit/View */}
                <button
                    onClick={onToggleEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg border border-gray-200 dark:border-gray-700 transition-all"
                >
                    {isEditing ? <><Eye size={14} /> Voir</> : <><Edit3 size={14} /> Éditer</>}
                </button>

                <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                {/*Toggle image uploader*/}
                <div className="relative">
                    {isEditing &&
                        <button
                            onClick={onToggleAddImage}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg border border-gray-200 dark:border-gray-700 transition-all"
                        >
                            <Paperclip size={14} /> Image
                        </button>
                    }

                    {isAddImage && (
                        <div className="absolute top-full left-0 mt-2 w-96 z-50">
                            <DropDownAddImage />
                        </div>
                    )}
                </div>

                {/* Sauvegarder (Brouillon) */}
                {canPerformAction(role, 'update') &&
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 hover:bg-gray-900 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm disabled:opacity-50 transition-all"
                    >
                        <Save size={14} />
                        {isSaving ? 'Enregistrement...' : 'Sauvegarder'}
                    </button>
                }
                {/* Valider / Publier */}
                {canPerformAction(role, "validate") &&
                    <button
                        onClick={onValidate}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-900 bg-primary hover:bg-primary-light rounded-lg shadow-sm transition-all"
                    >
                        {status === 'Validé' ? <UploadCloud size={14} /> : <CheckCircle size={14} />}
                        {status === 'Validé' ? 'Publier' : 'Valider'}
                    </button>
                }
            </div>
        </div>
    );
};

export default MarkdownToolbar;