export interface IOrderFoods {
    orderDetailId: string,
    foodId: string,
    quantity: number
}

export interface IOrderFoodslDB extends IOrderFoods {
    id: string;
}