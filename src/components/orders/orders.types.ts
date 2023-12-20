export interface IOrders {
    sellerId: string,
    userId: string
    createdAt: Date,
    rejectedAt: Date,
    approvedAt?: Date,
    deliveryCost: number,
    orderStatus: number,
    expectedDeliveryTime?: Date,
    fromDetailAddress?: string,
    toDetailAddress?: string
}

export interface IUpdateFoodInCartBodyrequest {
    foodId: string,
    sellerId: string,
    quantity: number,
}

export interface IApproveOrder {
    orderId: string,
    status: number,
}

export interface ICreateOrder {
    deliveryCost: number,
    expectedDeliveryTime: Date
}

export interface IOrderDetailDB extends IOrders {
    id: string;
}