import React, { useState } from 'react';
import { UserForRegister } from './types';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import styles from './Stylesheets/groupform.module.css';

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
        <div className={styles.container}>
            <h2 className={styles.h4}>Register</h2>
            {message && <div className={styles.message}>{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <button type="submit" className={styles.button}>Register</button>
            </form>
        </div>
    );
}

export default Registration;