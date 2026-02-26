import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';

const VARIANT_CONFIG = {
    success: {
        icon: CheckCircle,
        iconClass: 'text-green-600',
        circleBg: 'bg-green-50 dark:bg-green-900/30',
        accentColor: 'bg-green-500',
        confirmClass: 'bg-green-600 hover:bg-green-500 text-white',
        title: 'Succès',
    },
    error: {
        icon: XCircle,
        iconClass: 'text-red-500',
        circleBg: 'bg-red-50 dark:bg-red-900/30',
        accentColor: 'bg-red-500',
        confirmClass: 'bg-red-600 hover:bg-red-500 text-white',
        title: 'Erreur',
    },
    warning: {
        icon: AlertTriangle,
        iconClass: 'text-yellow-600',
        circleBg: 'bg-yellow-50 dark:bg-yellow-900/30',
        accentColor: 'bg-[#FFD700]',
        confirmClass: 'bg-[#FFD700] hover:bg-[#FFE44D] text-gray-900 font-semibold',
        title: 'Attention',
    },
    info: {
        icon: Info,
        iconClass: 'text-blue-500',
        circleBg: 'bg-blue-50 dark:bg-blue-900/30',
        accentColor: 'bg-blue-500',
        confirmClass: 'bg-blue-600 hover:bg-blue-500 text-white',
        title: 'Information',
    },
    confirm: {
        icon: AlertCircle,
        iconClass: 'text-yellow-600',
        circleBg: 'bg-yellow-50 dark:bg-yellow-900/30',
        accentColor: 'bg-[#FFD700]',
        confirmClass: 'bg-[#FFD700] hover:bg-[#FFE44D] text-gray-900 font-semibold',
        title: 'Confirmation',
    },
};

const AppModal = ({ type, message, variant = 'info', onClose, onConfirm }) => {
    const [visible, setVisible] = useState(false);

    // Trigger enter animation after mount
    useEffect(() => {
        const t = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(t);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 250);
    };

    const handleConfirm = () => {
        setVisible(false);
        setTimeout(onConfirm, 250);
    };

    const config = type === 'confirm'
        ? VARIANT_CONFIG.confirm
        : (VARIANT_CONFIG[variant] || VARIANT_CONFIG.info);

    const Icon = config.icon;

    return createPortal(
        /* Backdrop */
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-250 ${visible ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent'}`}
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
            {/* Card — matches ErrorPage style */}
            <div
                className={`relative w-full max-w-md bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 text-center
                    transition-all duration-250
                    ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                    <X size={16} />
                </button>

                {/* Centered icon circle — same size as ErrorPage (w-16 h-16) */}
                <div className={`w-16 h-16 ${config.circleBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <Icon size={32} className={config.iconClass} />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {config.title}
                </h2>

                {/* Message */}
                <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                    {message}
                </p>

                {/* Actions */}
                <div className={`flex gap-3 ${type === 'confirm' ? 'justify-center' : ''}`}>
                    {type === 'confirm' && (
                        <button
                            onClick={handleClose}
                            className="flex-1 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                        >
                            Annuler
                        </button>
                    )}
                    <button
                        onClick={type === 'confirm' ? handleConfirm : handleClose}
                        className={`flex-1 inline-flex items-center justify-center px-6 py-3 text-sm rounded-xl transition-all duration-200 ${config.confirmClass}`}
                    >
                        {type === 'confirm' ? 'Confirmer' : 'OK'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AppModal;
