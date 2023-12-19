export interface IComment {
    userId: string,
    foodId: string,
    rate: number,
    description: string,
    createdAt: Date
}

export interface IAddComment {
    orderId: string,
    foodId: string,
    rate: number,
    description: string,
}