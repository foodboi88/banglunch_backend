export interface IFood {
    constantId: string;
    sellerId: string;
    title: string;
    content: string;
    price: number;
    views: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    summarizedComments: string;
}

export interface IFoodInput {
    title: string;
    content: string;
    price: number;
    category: string[];
}

export interface IProductDB extends IFood {
    id: string;
}

export interface IFoodEdit {
    title?: string;
    content?: string;
    price?: number;
    category?: string[]
}