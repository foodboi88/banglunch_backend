export interface IFoodCategory {
    foodId: string;
    categoryId: string;
}

export interface IFoodCategoryInput {
    foodId: string;
    categoryId: string;
}

export interface IFoodCategoryDB extends IFoodCategory {
    id: string;
}

