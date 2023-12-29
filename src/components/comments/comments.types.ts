export interface IComment {
    userId: string,
    foodId: string,
    rate: number,
    description: string,
    createdAt: Date,
    orderDetailId: string,
    summarizedCommentOneStar: string,
    summarizedCommentTwoStar: string,
    summarizedCommentThreeStar: string,
    summarizedCommentFourStar: string,
    summarizedCommentFiveStar: string,
    summarizedCommentSevenStar: string,
    summarizedCommentEightStar: string,
    summarizedCommentNineStar: string,
    summarizedCommentTenStar: string,
}

export interface IAddComment {
    foodId: string,
    rate: number,
    description: string,
    orderDetailId: string
}