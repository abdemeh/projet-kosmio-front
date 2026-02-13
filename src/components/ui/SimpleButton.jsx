import React from 'react';

const SimpleButton = ({ children, onClick, disabled, className, icon: Icon }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`
            flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
        `}
    >
        {Icon && <Icon size={16} />}
        {children}
    </button>
);

export default SimpleButton;
