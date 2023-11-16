import { Body, Controller, Get, Post, Request, Route, Security, Tags } from "tsoa";
import { OrderStatus } from "../../shared/enums/order.enums";
import { failedResponse, successResponse } from "../../utils/http";
import Food from "../foods/foods.model";
import OrderDetails from "../order-details/order-details.model";
import User from "../users/users.model";
import { default as Orders } from "./orders.model";
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
    public async updateCart(@Body() input: IUpdateCartBodyrequest, @Request() request: any): Promise<any> {
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
            let cartOfUser = await Orders.findOne({ userId: userId, orderStatus: OrderStatus.Cart });
            console.log('Thông tin cart của user hiện tại', cartOfUser);
            const newCart = new Orders({
                userId: userId,
                sellerId: sellerId,
                createdAt: new Date(),
                purchasedAt: null,
                deliveryCost: 0,
                orderStatus: OrderStatus.Cart
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

    @Security("jwt")
    @Post('purchase')
    public async purchase(@Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userId = await User.getIdFromToken(token);
            if (!userId) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }

            //Check xem shop đã mở cửa chưa
            //Lấy cart của người dùng. Nếu chưa có thì thêm mới cart
            let cartOfUser = await Orders.findOne({ userId: userId, orderStatus: OrderStatus.Cart });
            //Viết aggregate lấy thông tin shop mà người dùng đang mua - cart => user => sellerInfo

            //Nếu đã mở cửa thì chuyển giỏ hàng hiện tại sang trạng thái chờ duyệt

            //Thông báo tới chủ shop là đang có 1 đơn hàng được order tới shop
        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }
}