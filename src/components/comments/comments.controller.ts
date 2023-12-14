import { Body, Controller, Get, Post, Query, Request, Route, Security, Tags } from "tsoa";
import { failedResponse, successResponse } from "../../utils/http";
import Orders from "../orders/orders.model";
import { getOrderByFoodAndUser } from "../orders/orders.queries";
import Users from "../users/users.model";
import { getCommentByFood } from "./comments.queries";
import { IAddComment, IComment } from "./comments.types";
import Comments from "./comments.model";
import OpenAI from "openai";

const openaiInstance = new OpenAI({apiKey: process.env.OPENAI_SECRET_KEY});

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

    /**
     * @summary For user Get summarize for all comments. Use ChatGPT API
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     */
    @Get("summarize")
    public async summarizeComments(@Request() request: any, @Query() prompt: string): Promise<any> {
        try {
            const response = await openaiInstance.completions.create({
                model: 'text-davinci-003-turbo', // Chọn mô hình ChatGPT (có thể thay đổi tùy thuộc vào yêu cầu của bạn)
                prompt: 'Tóm tắt list bình luận về món ăn sau ["Mình ăn sữa chua ở mấy cơ sở rồi nhưng thấy ở 50***là được cho đầy đặn nhất.ở đây rất rộng rãi với tầng 2 trang trí còn rất đẹp nữa.vào đây còn được hát karaoke nữa mng ạ.tuyệt vời xứng đáng đc 5 saoo","Ăn ở đây phải gọi là siêu ngon luôn 😍","Ăn nhiều lần tại quán, thấy menu rất đa dạng, có cả đồ uống, nhưng món khiến mình mê nhất vẫn là sữa chua trân châu","Sữa chua ngon, ăn có vị chua nhẹ không bị ngọt quá. Trân châu dai thơm mùi cốt dừa. Nhân viên phục vụ chu đáo nhiệt tình.. Đáng mua và sẽ ủng hộ quán nhiều lần.😊", "Quán gần chỗ mình đi xe khách nên đi Mu Cang Chai đêm nên ghé vào ăn nghỉ ngơi, vệ sinh. Quán bán đêm muộn tiện lợi. Mình chọn sưa chua trân châu 25k. Thấy loại basic này ngon hơn là mix chung với các vị khác.Trân châu nhiều, dẻo dai và vị sữa chua ổn, k quá chua hay ngọt.Bạn nhân viên bán hàng dễ thương, phục vụ tốt."]',
                max_tokens: 150, // Số lượng từ tối đa trong kết quả
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
}
