import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const ProtectedRoutes = ({ children }) => {
    const { user } = UserAuth();
    const [authLoaded, setAuthLoaded] = useState(false);

    useEffect(() => {
        const authenticationCheck = async () => {
          
            setAuthLoaded(true); 
        };

        authenticationCheck();
    }, [user]);

    if (!authLoaded) {
        return <div>Loading...</div>;  
    }

    if (!user) {
        return <Navigate to='/Login' />;
    }

    return children;
};

export default ProtectedRoutes;