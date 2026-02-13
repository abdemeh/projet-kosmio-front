import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, ChevronDown, LogOut, Settings, Shield, Hexagon, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ThemeContext } from '../../context/ThemeContext';
import { useContext } from 'react';

const Header = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const { role, loginAs, logout } = useAuth();

    const navItems = [
        { name: 'Accueil', path: '/' },
        { name: 'Solution', path: '/solution' },
        { name: 'Secteur', path: '/secteur' },
    ];

    const userRoles = [
        { name: 'Admin', icon: Shield, id: 'admin' },
        { name: 'Superadmin', icon: Hexagon, id: 'super_admin' },
        { name: 'ExpertCO2', icon: Settings, id: 'expert_co2' },
        { name: 'Utilisateur', icon: User, id: 'utilisateur' }
    ];

    const handleRoleChange = (roleId) => {
        loginAs(roleId);
        setIsMenuOpen(false);
    }

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    }

    // Format current role for display
    const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ') : 'Invité';

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-gray-900 border border-transparent shadow-sm">
                            W
                        </div>
                        <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight">
                            WikiCO2 <span className="text-gray-400 font-normal text-sm ml-1">| CEMET</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`text-sm transition-colors duration-200 ${location.pathname === item.path
                                    ? 'text-gray-900 font-bold'
                                    : 'text-gray-500 font-medium hover:text-gray-900'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User Menu & Theme Toggle */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all focus:outline-none"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center space-x-2 text-sm focus:outline-none transition-opacity hover:opacity-80 p-1 pr-3 rounded-full border border-gray-200 hover:border-gray-300 bg-white group"
                            >
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:text-gray-700 transition-colors">
                                    <User size={18} />
                                </div>
                                <div className="flex flex-col items-start leading-tight">
                                    <span className="font-medium text-gray-700">Rôle</span>
                                    <span className="text-xs font-bold text-gray-900">{displayRole}</span>
                                </div>
                                <ChevronDown size={14} className={`text-gray-400 transform transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-soft border border-gray-100 py-2 ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-2 border-b border-gray-50">
                                        <p className="text-xs text-gray-400 uppercase font-medium tracking-wider">Changer de rôle (Debug)</p>
                                    </div>
                                    {userRoles.map((roleItem) => (
                                        <button
                                            key={roleItem.id}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3 ${role === roleItem.id ? 'bg-primary/10 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                            onClick={() => handleRoleChange(roleItem.id)}
                                        >
                                            <roleItem.icon size={16} className={role === roleItem.id ? 'text-gray-900' : 'text-gray-400'} />
                                            {roleItem.name}
                                            {role === roleItem.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></div>}
                                        </button>
                                    ))}
                                    <div className="border-t border-gray-50 my-1"></div>
                                    <button
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={16} />
                                        Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
