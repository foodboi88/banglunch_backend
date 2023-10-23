export interface ICart {
    userId: string,
    productIds: string[],
    createdAt: Date,
    updatedAt: Date,
    
}
export interface ICartInput  {
    productId: string;
}

export interface ICartDB extends ICart {
    id: string;
}