import React, { useEffect, useState } from 'react';
import { useAuth } from './auth-context';
import styles from './Stylesheets/groupform.module.css';
import  axios from 'axios';
import { Category, Clothes } from './types'

const Products = () => {
    const { isLoggedIn } = useAuth();
    const axiosConfig = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
    };
    const [clothesList, setClothesList] = useState<Clothes[]>([]);

    useEffect(() => {

        const fetchClothes = async () => {
            try {
                const response = await axios.get('/api/clothes');
                setClothesList(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching clothes', error);
            }
        };
        fetchClothes();
    }, []);


    const handleAddToCart = async (productId: number) => {
        try {
            await axios.post(`/api/cart/${productId}`, { quantity: 1 }, axiosConfig);
        } catch (error) {
            console.error('Error adding to cart', error);
        }
    };


    return (
        <div className={styles.container}>
        <div className={styles.row}>
                <h1 className={styles.header}>Welcome!</h1>
                <p className={styles.paragraph}>This is Andy's clothing warehouse.</p>
                <p className={styles.paragraph}>We have new and used clothes in bulk and will ship directly to you within 5 business days!</p>
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Stock Quantity</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {clothesList.map(clothes => (
                        <tr key={clothes.productId}>
                            <td><img src={clothes.imageUrl} alt={clothes.productName} style={{ width: '100px', height: '100px' }} /></td>
                            <td>{clothes.productName}</td>
                            <td>{clothes.price}</td>
                            <td>{clothes.stockQuantity}</td>
                            {isLoggedIn && (
                                <td>
                                    <button onClick={() => handleAddToCart(clothes.productId)}>Add to Cart</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
}
export { Products };
