import { Body, Controller, Get, Post, Request, Route, Security, Tags } from "tsoa";
import { failedResponse, successResponse } from "../../utils/http";
import Food from "../foods/foods.model";
import OrderDetails from "../order-details/order-details.model";
import User from "../users/users.model";
import { default as OrderDetail, default as Orders } from "./orders.model";
import { getCartByUserId } from "./orders.queries";
import { IUpdateCartBodyrequest } from "./orders.types";


@Route("orders")
@Tags("Orders")
export class OrderController extends Controller {

    @Security("jwt")
    @Get('cart-by-user')
    public async getCartByUser(@Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userId = await User.getIdFromToken(token);
            if (!userId) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }

            const res = await Orders.aggregate(getCartByUserId(userId));

            return successResponse(res)

        } catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Security("jwt")
    @Post('update-cart')
    public async register(@Body() input: IUpdateCartBodyrequest, @Request() request: any): Promise<any> {
        try {
            const { foodId, sellerId, quantity } = input;
            //Check xem người dùng đăng nhập chưa
            const token = request.headers.authorization.split(' ')[1];
            const userId = await User.getIdFromToken(token);
            if (!userId) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }

            //Lấy cart của người dùng. Nếu chưa có thì thêm mới cart
            let cartOfUser = await OrderDetail.findOne({ userId: userId, isCart: true });
            console.log('Thông tin cart của user hiện tại', cartOfUser);
            const newCart = new OrderDetail({
                userId: userId,
                sellerId: sellerId,
                createdAt: new Date(),
                purchasedAt: null,
                isCart: true
            })
            if (!cartOfUser) {
                cartOfUser = newCart;
                await cartOfUser.save();
            } else {
                cartOfUser.update(newCart);
            }

            // Tìm đồ ăn theo id
            const foodById = await Food.findById(foodId);
            if (!foodById) {
                this.setStatus(400);
                return failedResponse('Không tìm thấy sản phẩm', 'NotFoundData');
            }

            //Tìm đồ ăn được đặt và update
            const orderDetail = await OrderDetails.findOne({ foodId: foodById.id, orderId: cartOfUser.id });
            if (!orderDetail) {
                const newOrderDetail = new OrderDetails({
                    orderId: cartOfUser.id,
                    foodId: foodById.id,
                    quantity: quantity,
                    price: foodById.price
                })
                console.log(newOrderDetail)
                newOrderDetail.save();
            } else {
                await orderDetail.update({ quantity: quantity, price: foodById.price })
            }

            const result = {
                updatedFood: input,
                message: 'Cập nhật giỏ hàng thành công',
            }
            return successResponse(result);

        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }
}