import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 selection:bg-primary selection:text-black transition-colors duration-300">
            <Header />
            <main className="flex-grow flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
