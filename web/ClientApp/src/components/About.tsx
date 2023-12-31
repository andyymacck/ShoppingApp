import React from 'react';
import styles from './Stylesheets/groupform.module.css';

    const About: React.FC = () => {
        return (
            <div className={styles.container}>
                <header>
                    <h1>Welcome to Clothing Emporium</h1>
                </header>

                <section className={styles.aboutUs}> {/* Use styles.aboutUs for class */}
                    <h2>About Us</h2>
                    <p>Welcome to Clothing Emporium, your premier destination for both new and used clothing! We are passionate about fashion and believe that great style doesn't have to come at a high price. Our store offers a wide selection of clothing items for men, women, and children, so you can find something for everyone in the family.</p>

                    <p>Our mission is to provide high-quality clothing at affordable prices while also promoting sustainability. We carefully curate our selection of used clothing, ensuring that each item is in excellent condition. By choosing used clothing, you not only save money but also contribute to reducing fashion waste.</p>

                    <p>At The Clothing Emporium, customer satisfaction is our top priority. Our friendly and knowledgeable staff are here to assist you in finding the perfect outfit or answering any questions you may have. Whether you're looking for the latest fashion trends or unique vintage pieces, we have something for everyone's taste and budget.</p>

                    <p>Thank you for choosing Clothing Emporium as your go-to clothing store. We look forward to serving you and helping you express your style!</p>
                </section>

                <section className={styles.ourTeam}> {/* Use styles.ourTeam for class */}
                    <h2>Our Team</h2>
                    <div className={styles.teamMember}> {/* Use styles.teamMember for class */}
                        <img src="/images/aboutpage1.jpg" alt="John Doe - Founder" />
                        <h3>John Doe</h3>
                        <p>Founder & CEO</p>
                    </div>
                    <div className={styles.teamMember}> {/* Use styles.teamMember for class */}
                        <img src="/images/aboutpage2.jpeg" alt="Jane Smith - Fashion Consultant" />
                        <h3>Jane Smith</h3>
                        <p>Fashion Consultant</p>
                    </div>
                    {/* Add more team members as needed */}
                </section>

                <footer>
                    <p>&copy; 2023 Clothing Emporium</p>
                </footer>
            </div>
        );
    };

export { About };