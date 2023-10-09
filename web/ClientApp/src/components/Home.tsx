import React from 'react';
import styles from './Stylesheets/styles.module.css';


const Home = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.header}>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Niconne&display=swap"></link>
                Welcome!</h1>

            <p>This is the Clothing Emporium.</p>
            <p>We have new and used clothes in bulk and will ship directly to you within 5 business days!</p>

            <hr className={styles.solid} />

            <ul className={styles.imageList}>
                <li><img src="/images/vintagestorelayout.jpg" alt="layout" /></li>
                <li><img src="/images/vintagestorelayout2.jfif" alt="layout2" /></li>
                <li><img src="/images/usedclothesstore.jfif" alt="layout3" /></li>
            </ul>


            <hr className={styles.solid} />

            <ul className={styles.imageList}>
                <li><img src="/images/stackableclothes.jfif" alt="Stackable Clothes" /></li>
                <li><img src="/images/clothingrack.png" alt="Clothing Rack" /></li>
                <li><img src="/images/rackofshirts.jpg" alt="Rack" /></li>
            </ul>

            <p>We have got plenty of inventory!</p>
        </div>
    );
};
  
export { Home };
