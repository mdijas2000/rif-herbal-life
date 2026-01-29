export interface OrderItem {
    id?: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

export interface Order {
    orderId?: number;
    username: string;
    fullName?: string;
    email?: string;
    mobileNumber?: string;
    address?: string;
    orderDate: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    trackingId?: string;
    deliveryAddress?: string;
    deliveryMobileNumber?: string;
}
