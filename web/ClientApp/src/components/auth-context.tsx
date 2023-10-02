import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    userRole: string | null;
    setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        const token = localStorage.getItem('authToken');
        return !!token;
    });

    const [userRole, setUserRole] = useState<string | null>(() => {
        return localStorage.getItem('userRole');
    });

    useEffect(() => {
        if (isLoggedIn) {
            // Fetch the user's role using Axios
            axios.get('/api/Auth/GetUserRole', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            })
                .then(response => {
                    if (response.data.roles && response.data.roles.length > 0) {
                        setUserRole(response.data.roles[0]);
                        localStorage.setItem('userRole', response.data.roles[0]);
                    }
                })
                .catch(error => {
                    console.error('Error fetching user role:', error);
                    setUserRole(null);
                    localStorage.removeItem('userRole');
                });
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            setUserRole(null);
        }
    }, [isLoggedIn]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userRole, setUserRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
