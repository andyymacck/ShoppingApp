import React, { useEffect } from 'react';
import { useAuth } from './auth-context';
import { useHistory } from 'react-router-dom';

const Logout: React.FC = () => {
    const { setIsLoggedIn } = useAuth();
    const history = useHistory();

    useEffect(() => {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        history.push('/');
    }, [setIsLoggedIn, history]);

    return null;
};

export default Logout; 