export interface IProduct {
    userId: string;
    title: string;
    content: string;
    price: number;
    views: number;
    likes: number;
    size: string;
    quantityPurchased: number;
    isDisable: boolean;
    totalRate : number
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    originalPrice : number;
}

export interface IProductInput  {
    title: string;
    content: string;
    price: number;
    originalPrice?: number;
    size: string;
    productDesignTools: string [];
    productDesignStyles: string [];
    productTypeOfArchitecture: string [];
}

export interface IProductDB extends IProduct {
    id: string;
}

export interface IProductEdit  {
    title?: string;
    content?: string;
    price?: number;
    originalPrice?: number;
    productDesignTools?: string [];
    productTypeOfArchitecture?: string [];
}