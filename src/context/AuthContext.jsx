// Authentification + rôle utilisateur + Fournit : user, role, login, logout

import { createContext, useState } from "react";
import { fakeUsers } from "../utils/permissions";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(fakeUsers.super_admin);

    const loginAs = (type) => {
        setUser(fakeUsers[type]);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user, 
                role: user?.role, 
                isAuthenticated: !!user, 
                loginAs, 
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};