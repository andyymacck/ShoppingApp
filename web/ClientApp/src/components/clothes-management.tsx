import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Category, Clothes } from './types'

const ClothesAdmin: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [clothesList, setClothesList] = useState<Clothes[]>([]);
    const [selectedClothes, setSelectedClothes] = useState<Clothes | null>(null);
    const [newClothes, setNewClothes] = useState<Omit<Clothes, 'productId'>>({
        productName: '',
        price: 0,
        stockQuantity: 0,
        size: "Small",
        color: "White",
        sex: "Male",
        categoryId: 1
    });
    const axiosConfig = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
    };
    const [message, setMessage] = useState<string | null>(null);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, isUpdate = false) => {
        const { name, value } = e.target;
        if (isUpdate) {
            if (selectedClothes) {
                setSelectedClothes({
                    ...selectedClothes,
                    [name]: value,
                });
            }
        } else {
            setNewClothes({
                ...newClothes,
                [name]: value,
            });
        }
    };
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, isUpdate = false) => {
        const { name, value } = e.target;
        if (isUpdate) {
            if (selectedClothes) {
                setSelectedClothes({
                    ...selectedClothes,
                    [name]: value,
                });
            }
        } else {
            setNewClothes({
                ...newClothes,
                [name]: value,
            });
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/clothes/categories', axiosConfig);
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        };
        const fetchClothes = async () => {
            try {
                const response = await axios.get('/api/clothes', axiosConfig);
                setClothesList(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching clothes', error);
                setMessage('Error fetching clothes');
            }
        };
        fetchClothes();
        fetchCategories();
    }, []);

    const handleCreate = async () => {
        try {
            const response = await axios.post('/api/clothes', newClothes, axiosConfig);
            setClothesList([...clothesList, response.data]);
            setMessage('Clothes created successfully');
        } catch (error) {
            console.error('Error creating clothes', error);
            setMessage('Error creating clothes');
        }
    };

    const handleUpdate = async () => {
        if (!selectedClothes) return;
        try {
            await axios.put(`/api/clothes/${selectedClothes.productId}`, selectedClothes, axiosConfig);
            setClothesList(clothesList.map(clothes =>
                clothes.productId === selectedClothes.productId ? selectedClothes : clothes
            ));
            setMessage('Clothes updated successfully');
        } catch (error) {
            console.error('Error updating clothes', error);
            setMessage('Error updating clothes');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`/api/clothes/${id}`, axiosConfig);
            setClothesList(clothesList.filter(c => c.productId !== id));
            setMessage('Clothes deleted successfully');
        } catch (error) {
            console.error('Error deleting clothes', error);
            setMessage('Error deleting clothes');
        }
    };
    return (
        <div>
            {/* Form for Creating New Clothes */}
            <div>
                {/* Form for Creating New Clothes */}
                <div>
                    <h2>Create New Clothes</h2>
                    <form onSubmit={e => { e.preventDefault(); handleCreate(); }}>
                        <div>
                            <label>Product Name:</label>
                            <input
                                type="text"
                                name="productName"
                                value={newClothes.productName}
                                onChange={e => handleInputChange(e)}
                            />
                        </div>
                        <div>
                            <label>Price:</label>
                            <input
                                type="number"
                                name="price"
                                value={newClothes.price}
                                onChange={e => handleInputChange(e)}
                            />
                        </div>
                        <div>
                            <label>Stock Quantity:</label>
                            <input
                                type="number"
                                name="stockQuantity"
                                value={newClothes.stockQuantity}
                                onChange={e => handleInputChange(e)}
                            />
                        </div>
                        <div>
                            <label>Description:</label>
                            <input
                                type="text"
                                name="description"
                                value={newClothes.description || ''}
                                onChange={e => handleInputChange(e)}
                            />
                        </div>
                        <div>
                            <label>Size:</label>
                            <select
                                name="size"
                                value={newClothes.size || "Small"}
                                onChange={e => handleSelectChange(e)}
                            >
                                <option value="Small">Small</option>
                                <option value="Medium">Medium</option>
                                <option value="Large">Large</option>
                            </select>
                        </div>
                        <div>
                            <label>Color:</label>
                            <select
                                name="color"
                                value={newClothes.color || "White"}
                                onChange={e => handleSelectChange(e)}
                            >
                                <option value="White">White</option>
                                <option value="Black">Black</option>
                                <option value="Blue">Blue</option>
                                <option value="Red">Red</option>
                                <option value="Yellow">Yellow</option>
                                <option value="Green">Green</option>
                                <option value="Purple">Purple</option>
                                <option value="Pink">Pink</option>
                                <option value="Orange">Orange</option>
                            </select>
                        </div>
                        <div>
                            <label>Image URL:</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={newClothes.imageUrl || ""}
                                onChange={e => handleInputChange(e)}
                            />
                        </div>
                        <div>
                            <label>Sex:</label>
                            <select
                                name="sex"
                                value={newClothes.sex || "Male"}
                                onChange={e => handleSelectChange(e)}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label>Category:</label>
                            <select
                                name="categoryId"
                                value={newClothes.categoryId || 1}
                                onChange={e => handleSelectChange(e)}
                            >
                                {categories.map(category => (
                                    <option key={category.categoryId} value={category.categoryId}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit">Create</button>
                    </form>
                </div>
            </div>

            {/* Form for Updating Selected Clothes */}
            {selectedClothes && (
                <div>
                    <h2>Update Clothes</h2>
                    <form onSubmit={e => { e.preventDefault(); handleUpdate(); }}>
                        <div>
                            <label>Product Name:</label>
                            <input
                                type="text"
                                name="productName"
                                value={selectedClothes.productName}
                                onChange={e => handleInputChange(e, true)}
                            />
                        </div>
                        <div>
                            <label>Price:</label>
                            <input
                                type="number"
                                name="price"
                                value={selectedClothes.price}
                                onChange={e => handleInputChange(e, true)}
                            />
                        </div>
                        <div>
                            <label>Stock Quantity:</label>
                            <input
                                type="number"
                                name="stockQuantity"
                                value={selectedClothes.stockQuantity}
                                onChange={e => handleInputChange(e, true)}
                            />
                        </div>
                        <div>
                            <label>Description:</label>
                            <input
                                type="text"
                                name="description"
                                value={selectedClothes.description || ''}
                                onChange={e => handleInputChange(e, true)}
                            />
                        </div>
                        <div>
                            <label>Size:</label>
                            <select
                                name="size"
                                value={selectedClothes ? selectedClothes.size || '' : ''}
                                onChange={e => handleSelectChange(e, true)}
                            >
                                <option value="Small">Small</option>
                                <option value="Medium">Medium</option>
                                <option value="Large">Large</option>
                            </select>
                        </div>
                        <div>
                            <label>Color:</label>
                            <select
                                name="color"
                                value={selectedClothes ? selectedClothes.color || '' : ''}
                                onChange={e => handleSelectChange(e, true)}
                            >
                                <option value="White">White</option>
                                <option value="Black">Black</option>
                                <option value="Blue">Blue</option>
                                <option value="Red">Red</option>
                                <option value="Yellow">Yellow</option>
                                <option value="Green">Green</option>
                                <option value="Purple">Purple</option>
                                <option value="Pink">Pink</option>
                                <option value="Orange">Orange</option>
                            </select>
                        </div>
                        <div>
                            <label>Image URL:</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={selectedClothes.imageUrl || ''}
                                onChange={e => handleInputChange(e, true)}
                            />
                        </div>
                        <div>
                            <label>Sex:</label>
                            <select
                                name="sex"
                                value={selectedClothes ? selectedClothes.sex || '' : ''}
                                onChange={e => handleSelectChange(e, true)}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label>Category:</label>
                            <select
                                name="categoryId"
                                value={selectedClothes ? selectedClothes.categoryId || '' : ''}
                                onChange={e => handleSelectChange(e, true)}
                            >
                                {categories.map(category => (
                                    <option key={category.categoryId} value={category.categoryId}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit">Update</button>
                    </form>
                </div>
            )}

            {/* Display Clothes List and Delete button */}
            <div>
                <h2>Clothes List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Stock Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clothesList.map(clothes => (
                            <tr key={clothes.productId}>
                                <td>{clothes.productName}</td>
                                <td>{clothes.price}</td>
                                <td>{clothes.stockQuantity}</td>
                                <td>
                                    <button onClick={() => setSelectedClothes(clothes)}>Edit</button>
                                    <button onClick={() => handleDelete(clothes.productId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {message && <div>{message}</div>}
        </div>
    );
};

export default ClothesAdmin;
