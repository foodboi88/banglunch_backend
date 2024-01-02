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
    summarizedCommentOneStar?: string,
    summarizedCommentTwoStar?: string,
    summarizedCommentThreeStar?: string,
    summarizedCommentFourStar?: string,
    summarizedCommentFiveStar?: string,
    summarizedCommentSixStar?: string,
    summarizedCommentSevenStar?: string,
    summarizedCommentEightStar?: string,
    summarizedCommentNineStar?: string,
    summarizedCommentTenStar?: string,
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