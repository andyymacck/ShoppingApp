import React from 'react';
import styles from './Stylesheets/styles.module.css';

const Home = () => {
    return (
       <div className = { styles.container }>
            <h1 className={ styles.header }>Welcome!</h1>

            <p> This is the Clothing Emporium.</p><p> We have new and used clothes in bulk and will ship directly to you within 5 bussiness days!</p>
            <hr className={ styles.solid }></hr>	  
            <ul>
                <img src="/images/stackableclothes.jfif"/>
                <img src = "/images/clothingrack.png"/>
                
            </ul>
            <p> We have got plenty of inventory!</p>
        </div>
    );
}
export { Home };
