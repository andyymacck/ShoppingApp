export interface UserForRegister {
    username: string;
    password: string;
    email: string;
}

export interface UserForLogin {
    username: string;
    password: string;
}

export interface Category {
    categoryId: number;
    categoryName: string;
    categoryDescription?: string;
    clothes: Clothes[];
}

export interface Clothes {
    productId: number;
    categoryId?: number;
    productName: string;
    description?: string;
    price: number;
    stockQuantity: number;
    size?: string;
    color?: string;
    imageUrl?: string;
    sex?: string;
    category?: Category;
}

export interface ProductDto {
    productId: number;
    productName: string;
    pricePerUnit: number;
    imageUrl: string;
}

export interface CartItemDto {
    cartId: number;
    quantity: number;
    product: ProductDto;
    totalPrice: number;
}

export interface OrderDto {
}