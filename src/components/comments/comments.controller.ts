import { Body, Controller, Get, Post, Query, Request, Route, Security, Tags } from "tsoa";
import { failedResponse, successResponse } from "../../utils/http";
import Orders from "../orders/orders.model";
import { getOrderByFoodAndUser } from "../orders/orders.queries";
import Users from "../users/users.model";
import { getCommentByFood } from "./comment.queries";
import { IAddComment, IComment } from "./comment.types";
import Comments from "./comments.model";

@Route("comments")
@Tags("Comments")
export class CommentsController extends Controller {
    /**
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     */
    @Get("get-comments-by-food")
    public async getCommentsByFood(@Request() request: any, @Query() foodId: string): Promise<any> {
        try {
            const commentByFood = await Comments.aggregate(getCommentByFood(foodId))
            let totalRateScore = 0;
            commentByFood.forEach(item => {
                totalRateScore = totalRateScore + item.rate;
            })
            return successResponse({
                items: commentByFood,
                averageRate: (totalRateScore / commentByFood.length),
                numberOfItems: commentByFood.length
            });
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Security("jwt")
    @Post('create-comment')
    public async createComment(@Body() data: IAddComment, @Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            //verify token
            const userId = await Users.getIdFromToken(token);
            if (!userId) {
                this.setStatus(401);
                return failedResponse('Token is not valid', 'Unauthorized');
            }

            //Check xem người mua đã từng mua đồ ăn này hay chưa
            const whetherBuyedOrNot = await Orders.aggregate(getOrderByFoodAndUser(data.foodId, userId));
            if (whetherBuyedOrNot.length <= 0) {
                this.setStatus(401);
                return failedResponse('You must purchase this food first', 'NotPurchaseYet');
            }

            const commentDTO: IComment = {
                userId: userId,
                foodId: data.foodId,
                description: data.description,
                rate: data.rate,
                createdAt: new Date(),
            }

            //save food
            const comment = await new Comments(commentDTO).save();

            return successResponse(comment);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }
}
