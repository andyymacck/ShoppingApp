import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ProductDto, CartItemDto } from './types';
import { Link } from 'react-router-dom';
import styles from './Stylesheets/groupform.module.css';


const Cart = () => {
    const [cartItems, setCartItems] = useState<CartItemDto[]>([]);
    const [quantityInputs, setQuantityInputs] = useState<{ [key: number]: number }>({});

    const axiosConfig = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
    };
    const [clothesList, setClothesList] = useState<CartItemDto[]>([]);

    useEffect(() => {
        axios.get<CartItemDto[]>('/api/cart', axiosConfig)
            .then(response => {
                setCartItems(response.data);
                const initialQuantities = response.data.reduce((acc, item) => {
                    acc[item.cartId] = item.quantity;
                    return acc;
                }, {} as { [key: number]: number });
                setQuantityInputs(initialQuantities);
            })
            .catch(error => console.error('Error loading cart items', error));
    }, []);

    const handleDelete = async (cartId: number) => {
        try {
            await axios.delete(`/api/cart/${cartId}`, axiosConfig);
            setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
        } catch (error) {
            console.error('Error deleting cart item', error);
        }
    };

    const handleUpdate = async (cartId: number) => {
        const quantity = quantityInputs[cartId];
        try {
            await axios.put(`/api/cart/${cartId}`, { quantity }, axiosConfig);
            setCartItems(prevItems => prevItems.map(item =>
                item.cartId === cartId ? { ...item, quantity, totalPrice: item.product.pricePerUnit * quantity } : item
            ));
        } catch (error) {
            console.error('Error updating cart item', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.row}>
            <table>
                <thead>
                    <tr>
                        <th>Product Image</th>
                        <th>Product</th>
                        <th>Price Per Unit</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map(item => (
                        <tr key={item.cartId}>
                            <td><img src={item.product.imageUrl} alt={item.product.productName} style={{ width: '100px', height: '100px' }} /></td>
                            <td>{item.product.productName}</td>
                            <td>{item.product.pricePerUnit}</td>
                            <td>
                                <input
                                    type="number"
                                    value={quantityInputs[item.cartId] || item.quantity}
                                    onChange={(e) => setQuantityInputs({ ...quantityInputs, [item.cartId]: Number(e.target.value) })}
                                />
                            </td>
                            <td>{item.totalPrice}</td>
                            <td>
                                <button onClick={() => handleDelete(item.cartId)}>Delete</button>
                                <button onClick={() => handleUpdate(item.cartId)}>Update</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {cartItems.length > 0 ? (
                <Link to="/checkout">Go to Checkout</Link>
            ) : (
                <p>Your cart is empty!</p>
            )}
            </div>
        </div>
    );
};

export { Cart }; 