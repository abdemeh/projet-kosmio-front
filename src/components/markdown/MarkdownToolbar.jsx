// Actions métier (valider, publier, modifier)
import React from 'react';
import { Save, CheckCircle, UploadCloud, Edit3, Eye, Edit2 } from 'lucide-react';
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
    isSaving
}) => {
    const { role } = useAuth();
    return (
        <div className="flex items-center justify-between bg-white border-b border-gray-100 p-3 mb-2">

            {/* Partie Gauche : Statut */}
            <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Statut
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${status === 'Validé' ? 'bg-green-50 text-green-700 border-green-200' :
                        status === 'Brouillon' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                            'bg-gray-50 text-gray-600 border-gray-100'
                    }`}>
                    {status || 'Nouveau'}
                </span>
            </div>

            {/* Partie Droite : Actions */}
            <div className="flex items-center gap-2">
                {/* Toggle Edit/View */}
                <button
                    onClick={onToggleEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900 rounded-lg border border-gray-200 transition-all"
                >
                    {isEditing ? <><Eye size={14} /> Voir</> : <><Edit3 size={14} /> Éditer</>}
                </button>

                <div className="h-4 w-px bg-gray-200 mx-1"></div>

                {/*Toggle image uploader*/}
                <div className="relative"> 
                {isEditing && 
                    <button
                    onClick={onToggleAddImage}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900 rounded-lg border border-gray-200 transition-all"
                    >
                    <Edit2 size={14}/> Ajouter une image
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
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg shadow-sm disabled:opacity-50 transition-all"
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