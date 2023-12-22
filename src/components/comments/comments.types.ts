export interface IComment {
    userId: string,
    foodId: string,
    rate: number,
    description: string,
    createdAt: Date,
    orderDetailId: string
}

export interface IAddComment {
    orderId: string,
    foodId: string,
    rate: number,
    description: string,
    orderDetailId: string
}