export interface IOrderDetails {
    orderId: string,
    foodId: string,
    quantity: number
    price: number,
}

export interface IOrderDetailDB extends IOrderDetails {
    id: string;
}