export interface IOrders {
    sellerId: string,
    userId: string
    createdAt: Date,
    purchasedAt?: Date,
    deliveryCost: number,
    orderStatus: number
}

export interface IUpdateFoodInCartBodyrequest {
    foodId: string,
    sellerId: string,
    quantity: number,
}

export interface IApproveOrder{
    orderId: string,
    status: number,
}

export interface IOrderDetailDB extends IOrders {
    id: string;
}