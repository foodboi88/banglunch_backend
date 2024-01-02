import OpenAI from "openai";
import { Body, Controller, Get, Post, Query, Request, Route, Security, Tags } from "tsoa";
import { failedResponse, successResponse } from "../../utils/http";
import Foods from "../foods/foods.model";
import { IFood } from "../foods/foods.types";
import Users from "../users/users.model";
import Comments from "./comments.model";
import { getCommentByFood } from "./comments.queries";
import { IAddComment, IComment } from "./comments.types";

const openaiInstance = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY });

@Route("comments")
@Tags("Comments")
export class CommentsController extends Controller {
    /**
     * @summary For user Get summarize for all comments. Use ChatGPT API
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     */
    @Get("summarize")
    public async summarizeComments(@Request() request: any): Promise<any> {
        try {
            const response = await openaiInstance.completions.create({
                model: 'gpt-3.5-turbo-instruct', // Chọn mô hình ChatGPT
                prompt: 'Tổng hợp lại toàn bộ array bình luận dưới đây ngắn gọn nhưng đầy đủ ý nghĩa nhất: ["Ù ôi xuất sắc, lần đầu ăn miến trộn nên thấy lươn giòn rụm trộn với gia vị ăn đã dễ sợ. Nước sấu chua ngọt có thêm gừng dập ngon xỉu. 2 tô 2 nước chỉ 110k quá ổn.","Chả, nem, miến đều ổn, không quá xuất sắc nhưng ăn cũng tạm, phục vụ nhanh, quán rộng rãi","Chỉ coá lươn chiên khá khô, lần sau ra phải thử lươn mềm hơn mới được","1 tô giá tầm 30k, ăn hơi ít :) lươn cũng hơi ít nhưng với vị trí như vậy cũng chấp nhận đc,miến ăn cực vừa vặn từ miến trộn tới miến nước , mềm dai đúng độ luôn vừa tới,cơ mà chả lươn ăn cũng bt ko quá đặc sắc"]',
                max_tokens: 300, // Số lượng từ tối đa trong kết quả
            });

            const summary = response.choices[0].text.trim();
            console.log(summary)
            return summary;
        }
        catch (err) {
            this.setStatus(500);
            console.log(err)
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

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
            //verify token
            const token = request.headers.authorization.split(' ')[1];
            const userId = await Users.getIdFromToken(token);
            if (!userId) {
                this.setStatus(401);
                return failedResponse('Token is not valid', 'Unauthorized');
            }

            // Check xem món này ở đơn này đã được thêm bình luận chưa, nếu rồi thì không cho thêm nữa 
            const commentExist = await Comments.findOne({
                userId: userId,
                orderDetailId: data.orderDetailId,
                foodId: data.foodId
            })
            if (commentExist) { // Đã bình luận rồi
                this.setStatus(400);
                return failedResponse('Bạn đã bình luận món ăn trong đơn này rồi', 'CommentRestricted');
            }

            //save comment 
            const commentDTO: IComment = {
                userId: userId,
                foodId: data.foodId,
                description: data.description,
                rate: data.rate,
                createdAt: new Date(),
                orderDetailId: data.orderDetailId
            }
            await new Comments(commentDTO).save();

            //Get all comments with the same rate of food
            const commentsByFood = await Comments.find({ foodId: data.foodId, rate: data.rate });
            let prompt = 'Tóm tắt list bình luận về món ăn sau: ['
            commentsByFood.forEach((item) => {
                prompt = prompt + item.description + ",";
            })
            prompt += data.description + "]";
            console.log(prompt)

            //Summarize all comments of food
            const response = await openaiInstance.completions.create({
                model: 'gpt-3.5-turbo-instruct', // Chọn mô hình ChatGPT
                prompt: prompt,
                max_tokens: 300, // Số lượng từ tối đa trong kết quả
            });
            const summary = response.choices[0].text.trim();
            console.log(summary)

            //Save summarized comment to corresponding food
            const foodById = await Foods.findById(data.foodId);
            const foodDTO: IFood = {
                        constantId: foodById.constantId,
                        title: foodById.title,
                        content: foodById.content,
                        price: foodById.price,
                        views: foodById.views,
                        sellerId: foodById.sellerId,
                        createdAt: foodById.createdAt,
                        updatedAt: foodById.updatedAt,
                        deletedAt: foodById.deletedAt,
                        summarizedCommentOneStar: data.rate === 1 ? summary : null,
                        summarizedCommentTwoStar: data.rate === 2 ? summary : null,
                        summarizedCommentThreeStar: data.rate === 3 ? summary : null,
                        summarizedCommentFourStar: data.rate === 4 ? summary : null,
                        summarizedCommentFiveStar: data.rate === 5 ? summary : null,
                        summarizedCommentSixStar: data.rate === 6 ? summary : null,
                        summarizedCommentSevenStar: data.rate === 7 ? summary : null,
                        summarizedCommentEightStar: data.rate === 8 ? summary : null,
                        summarizedCommentNineStar: data.rate === 9 ? summary : null,
                        summarizedCommentTenStar: data.rate === 10 ? summary : null,
              }
            const food = await foodById.update(foodDTO);

            return successResponse(food);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }
}
