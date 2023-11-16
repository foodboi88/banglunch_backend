export interface IOrders {
    sellerId: string,
    userId: string
    createdAt: Date,
    purchasedAt: Date,
    deliveryCost: number,
    orderStatus: number
}

export interface IUpdateCartBodyrequest {
    foodId: string,
    sellerId: string,
    quantity: number,
}

export interface IOrderDetailDB extends IOrders {
    id: string;
}