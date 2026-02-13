// Sélecteur Solution / Secteur

import React from 'react';

const FicheTypeSelector = ({ currentType, onTypeChange }) => {
    return (
        <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-xl w-fit mx-auto mb-8">
            <button
                onClick={() => onTypeChange('solution')}
                className={`flex items-center px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentType === 'solution'
                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                    }`}
            >
                Solution
            </button>

            <button
                onClick={() => onTypeChange('sector')}
                className={`flex items-center px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentType === 'sector'
                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                    }`}
            >
                Secteur
            </button>
        </div>
    );
};

export default FicheTypeSelector;