import React, { createContext, useState, useEffect } from 'react';
const URL = import.meta.env.VITE_BACKEND_URL;

if (!URL) {
  console.log('Environment variables:', import.meta.env);
    throw new Error("VITE_BACKEND_URL is not defined in the environment file");
}

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log("token :", token);
                if (!token) {
                    throw new Error('User not authenticated. Please log in.');
                }

                const response = await fetch(`${URL}/api/users/role`, { //use URL here, then shows in ackend logs
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log("response :", response);

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                if (!data.role) {
                    throw new Error('No role returned from server.');
                }

                console.log("user role : " , data.role);
                setRole(data.role);
            } catch (error) {
                console.error('Error fetching role:', error.message);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRole();
    }, []);

    return (
        <UserContext.Provider value={{ role, isLoading, error }}>
            {children}
        </UserContext.Provider>
    );
};
