export interface Product {
    productId?: number;
    productName: string;
    description: string;
    price: number;
    imageURL: string;
    size?: string; // e.g., "250ml", "100g", "500g"
    stock?: number;
}