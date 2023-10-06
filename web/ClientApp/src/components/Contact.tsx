import React, { useState } from 'react';
import styles from './Stylesheets/contactform.module.css';

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission here, e.g., send data to a server or display a thank you message.
        console.log('Form submitted:', formData);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Contact Us</h1>
            <p className={styles.paragraph}>If you have any questions or feedback, please fill out the form below to get in touch with us.</p>

            <form onSubmit={handleSubmit}>
                <div className={styles.row}>
                    <label htmlFor="name" className={styles.label}>Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.row}>
                    <label htmlFor="email" className={styles.label}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.row}>
                    <label htmlFor="message" className={styles.label}>Message:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className={styles.textarea}
                        rows={5}
                        required
                    ></textarea>
                </div>

                <div className={styles.button}>
                    <button type="submit" className={styles.submitButton}>Submit</button>
                </div>
            </form>
        </div>
    );
};

export default ContactPage;