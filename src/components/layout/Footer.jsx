import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-8 mt-auto transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-400 dark:text-gray-500">
                    © 2026 <span className="font-bold text-gray-600 dark:text-gray-300">WikiCO2</span>.
                </div>
                <div className="flex space-x-6">
                    <a href="#" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Documentation</a>
                    <a href="#" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Support</a>
                    <a href="#" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Mentions Légales</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
