import React, { useState } from 'react';
import { UserForLogin } from './types';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useAuth } from './auth-context';
import styles from './Stylesheets/contactform.module.css';


const Login: React.FC = () => {
    const [formData, setFormData] = useState<UserForLogin>({
        username: '',
        password: ''
    });

    const { setIsLoggedIn } = useAuth();

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const history = useHistory();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMessage(null);
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('/api/Auth/login', formData);
            const token = response.data.token;
            localStorage.setItem('authToken', token);
            console.log(response.data);
            setMessage("Login successful");
            setIsLoggedIn(true);
            setTimeout(() => {
                history.push('/');
            }, 1000);
        } catch (error) {
            console.error("Error Logging in", error);
            setMessage("Error Logging in");
        }
        finally {
            setIsLoading(false); // Set loading to false when login ends, regardless of outcome
        }
    }
    
    return (
        <div className={styles.container}>
            <h2 className={styles.row}> Login </h2>
            {message && <div>{message}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                </div>
                <button type="submit" disabled={isLoading}>Login</button>
            </form>
        </div>
    );
    
}
export default Login;