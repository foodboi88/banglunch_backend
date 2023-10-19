export interface IProductImage {
    fileName: string;
    filePath: string;
    isMain: boolean;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProductImageDB extends IProductImage {
    id: string;
}
