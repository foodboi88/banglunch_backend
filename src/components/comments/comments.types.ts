export interface IComment {
    userId: string,
    foodId: string,
    rate: number,
    description: string,
    createdAt: Date
}

export interface IAddComment {
    foodId: string,
    rate: number,
    description: string,
}