import React from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';

const VARIANT_CONFIG = {
    success: {
        icon: CheckCircle,
        iconClass: 'text-green-500',
        bgClass: 'bg-green-50 dark:bg-green-900/20',
        borderClass: 'border-green-200 dark:border-green-800',
        confirmClass: 'bg-green-600 hover:bg-green-700 text-white',
        label: 'Succès',
    },
    error: {
        icon: XCircle,
        iconClass: 'text-red-500',
        bgClass: 'bg-red-50 dark:bg-red-900/20',
        borderClass: 'border-red-200 dark:border-red-800',
        confirmClass: 'bg-red-600 hover:bg-red-700 text-white',
        label: 'Erreur',
    },
    warning: {
        icon: AlertTriangle,
        iconClass: 'text-yellow-500',
        bgClass: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderClass: 'border-yellow-200 dark:border-yellow-800',
        confirmClass: 'bg-[#FFD700] hover:bg-[#FFE44D] text-gray-900',
        label: 'Attention',
    },
    info: {
        icon: Info,
        iconClass: 'text-blue-500',
        bgClass: 'bg-blue-50 dark:bg-blue-900/20',
        borderClass: 'border-blue-200 dark:border-blue-800',
        confirmClass: 'bg-blue-600 hover:bg-blue-700 text-white',
        label: 'Information',
    },
    confirm: {
        icon: AlertCircle,
        iconClass: 'text-yellow-500',
        bgClass: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderClass: 'border-yellow-200 dark:border-yellow-800',
        confirmClass: 'bg-[#FFD700] hover:bg-[#FFE44D] text-gray-900 font-semibold',
        label: 'Confirmation',
    },
};

const AppModal = ({ type, message, variant = 'info', onClose, onConfirm }) => {
    const config = type === 'confirm'
        ? VARIANT_CONFIG.confirm
        : (VARIANT_CONFIG[variant] || VARIANT_CONFIG.info);

    const Icon = config.icon;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Top accent bar */}
                <div className={`h-1 w-full ${type === 'confirm' || variant === 'warning' ? 'bg-[#FFD700]' : variant === 'success' ? 'bg-green-500' : variant === 'error' ? 'bg-red-500' : 'bg-blue-500'}`} />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                    <X size={16} />
                </button>

                <div className="p-6">
                    {/* Icon + title */}
                    <div className="flex items-start gap-4 mb-5">
                        <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${config.bgClass} border ${config.borderClass}`}>
                            <Icon size={22} className={config.iconClass} />
                        </div>
                        <div className="flex-1 pt-0.5">
                            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
                                {config.label}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {message}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        {type === 'confirm' && (
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200"
                            >
                                Annuler
                            </button>
                        )}
                        <button
                            onClick={type === 'confirm' ? onConfirm : onClose}
                            className={`px-5 py-2 text-sm rounded-full transition-all duration-200 ${config.confirmClass}`}
                        >
                            {type === 'confirm' ? 'Confirmer' : 'OK'}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AppModal;
