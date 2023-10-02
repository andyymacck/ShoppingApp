import React, { useState } from 'react';
import { UserForRegister } from './types';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Registration: React.FC = () => {
    const [formData, setFormData] = useState<UserForRegister>({
        username: '',
        password: '',
        email: ''
    });

    const [message, setMessage] = useState<string | null>(null);
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
        try {
            const response = await axios.post('/api/auth/register', formData);
            console.log(response.data);
            setMessage("Registration successful");
            setTimeout(() => {
                history.push('/');
            }, 2000);
        } catch (error) {
            console.error("Error registering", error);
            setMessage("Error registering");
        }
    }
    return (
        <div>
            <h2>Register</h2>
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
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
export default Registration;