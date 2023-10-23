export interface ICart {
    userId: string,
    createdAt: Date,
    updatedAt: Date,
    
}
export interface ICartInput  {
    foodId: string;
    cartId: string;
    quantity: number;
}

export interface ICartDB extends ICart {
    id: string;
}