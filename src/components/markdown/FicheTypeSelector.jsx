// Sélecteur Solution / Secteur

import React from 'react';
import { Factory, Lightbulb } from 'lucide-react';

const FicheTypeSelector = ({ currentType, onTypeChange }) => {
    return (
        <div className="flex items-center space-x-4 bg-gray-100 p-1 rounded-lg w-fit">
            <button
                onClick={() => onTypeChange('solution')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    currentType === 'solution'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <Lightbulb className="w-4 h-4 mr-2" />
                Solution
            </button>

            <button
                onClick={() => onTypeChange('secteur')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    currentType === 'secteur'
                        ? 'bg-white text-emerald-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <Factory className="w-4 h-4 mr-2" />
                Secteur
            </button>
        </div>
    );
};

export default FicheTypeSelector;