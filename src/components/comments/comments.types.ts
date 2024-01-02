export interface IComment {
    userId: string,
    foodId: string,
    rate: number,
    description: string,
    createdAt: Date,
    orderDetailId: string,
}

export interface IAddComment {
    foodId: string,
    rate: number,
    description: string,
    orderDetailId: string
}