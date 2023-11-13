export interface IOrders {
    sellerId: string,
    userId : string
    createdAt: Date,
    purchasedAt: Date,
    isCart: Boolean
}

export interface IUpdateCartBodyrequest {
    foodId: string,
    sellerId: string,
    quantity: number,
}

export interface IOrderDetailDB extends IOrders {
    id: string;
}