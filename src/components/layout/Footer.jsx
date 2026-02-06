import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-400">
                    © 2026 <span className="font-bold text-gray-600">WikiCO2</span>.
                </div>
                <div className="flex space-x-6">
                    <a href="#" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Documentation</a>
                    <a href="#" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Support</a>
                    <a href="#" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Mentions Légales</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
