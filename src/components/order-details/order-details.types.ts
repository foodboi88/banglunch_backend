export interface IOrderDetails {
    orderDetailId: string,
    foodId: string,
    quantity: number
}

export interface IOrderDetailDB extends IOrderDetails {
    id: string;
}