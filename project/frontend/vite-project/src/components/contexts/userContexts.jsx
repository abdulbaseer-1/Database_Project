import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const URL = import.meta.env.VITE_BACKEND_URL;

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({ role: null, name: null, email: null });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Not authenticated');

                const response = await fetch(`${URL}/api/users/details`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error('Failed to fetch user details');

                const data = await response.json();
                setUser({ role: data.role, name: data.name, email: data.email });
            } catch (error) {
                console.error(error.message);
                setUser({ role: null, name: null, email: null });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={{ ...user, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};
