export interface ICartFood {
    cartId: string,
    foodId: string,
    quantity: number,
}
export interface ICartFoodInput  {
    foodId: string;
    cartId: string;
    quantity: number;
}

export interface ICartFoodDB extends ICartFood {
    id: string;
}