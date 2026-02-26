import React, { createContext, useContext, useState, useCallback } from 'react';
import AppModal from '../components/ui/AppModal';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState(null);

    // Simple alert: showAlert(message, type = 'info' | 'success' | 'error' | 'warning')
    const showAlert = useCallback((message, type = 'info') => {
        setModal({ type: 'alert', message, variant: type });
    }, []);

    // Confirm dialog: showConfirm(message, onConfirm)
    const showConfirm = useCallback((message, onConfirm) => {
        setModal({ type: 'confirm', message, onConfirm });
    }, []);

    const close = useCallback(() => setModal(null), []);

    const handleConfirm = useCallback(() => {
        if (modal?.onConfirm) modal.onConfirm();
        close();
    }, [modal, close]);

    return (
        <ModalContext.Provider value={{ showAlert, showConfirm }}>
            {children}
            {modal && (
                <AppModal
                    type={modal.type}
                    message={modal.message}
                    variant={modal.variant}
                    onClose={close}
                    onConfirm={handleConfirm}
                />
            )}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
