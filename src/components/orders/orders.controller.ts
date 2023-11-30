import { Body, Controller, Get, Post, Request, Route, Security, Tags } from "tsoa";
import { OrderStatus } from "../../shared/enums/order.enums";
import { failedResponse, successResponse } from "../../utils/http";
import Food from "../foods/foods.model";
import OrderDetails from "../order-details/order-details.model";
import { IOrderDetails } from "../order-details/order-details.types";
import Sellers from "../sellers/sellers.model";
import { default as User, default as Users } from "../users/users.model";
import { default as Orders } from "./orders.model";
import { getCartByUserId, getOrdersBySeller } from "./orders.queries";
import { IApproveOrder, ICreateOrder, IOrders, IUpdateFoodInCartBodyrequest } from "./orders.types";


@Route("orders")
@Tags("Orders")
export class OrderController extends Controller {

    /**
     * @summary for user
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     */
    @Security("jwt")
    @Get('cart-by-user') // Lấy cart theo người mua
    public async getCartByUser(@Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userId = await User.getIdFromToken(token);
            if (!userId) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }

            const res = await Orders.aggregate(getCartByUserId(userId));
            let numberOfFood = 0;
            res[0].order_details.forEach((item: IOrderDetails) => {
                numberOfFood += item.quantity;
            });
            return successResponse({ ...res[0], numberOfFood })

        } catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    /**
     * @summary for user
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     */
    @Security("jwt")
    @Post('update-food-in-cart')
    public async updateCart(@Body() input: IUpdateFoodInCartBodyrequest, @Request() request: any): Promise<any> {
        try {
            const { foodId, sellerId, quantity } = input;
            //Check xem người dùng đăng nhập chưa
            const token = request.headers.authorization.split(' ')[1];
            const userId = await User.getIdFromToken(token);
            if (!userId) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }

            //Lấy cart của người dùng
            let cartOfUser = await Orders.findOne({ userId: userId, orderStatus: OrderStatus.Cart });
            console.log('Thông tin cart của user hiện tại', cartOfUser);
            const newCart: IOrders = {
                userId: userId,
                sellerId: cartOfUser?.sellerId ? cartOfUser?.sellerId : sellerId, // Nếu trong giỏ đang chưa có hàng thì set luôn idSeller bằng với id của shop của sản phẩm được thêm vào 
                createdAt: new Date(),
                purchasedAt: null,
                deliveryCost: 0,
                orderStatus: OrderStatus.Cart,
                expectedDeliveryTime: null
            }


            //Nếu chưa có thì thêm mới cart. Có rồi thì cập nhật
            if (!cartOfUser) {
                cartOfUser = new Orders(newCart);
                await cartOfUser.save();
            } else {
                await cartOfUser.update(newCart); // update chỉ nhận param là 1 object thường
            }


            // Check xem đồ ăn được thêm vào có cùng shop với các sản phẩm khác trong giỏ hay không
            if (sellerId.toString() !== cartOfUser.sellerId.toString()) {
                this.setStatus(400);
                return failedResponse('DifferentShopError', 'Vui lòng chọn sản phẩm của cùng 1 shop');
            }

            // Tìm đồ ăn theo id
            const foodById = await Food.findById(foodId);
            if (!foodById) {
                this.setStatus(400);
                return failedResponse('Không tìm thấy sản phẩm', 'NotFoundData');
            }

            //Tìm đồ ăn được đặt và update
            const orderDetail = await OrderDetails.findOne({ foodId: foodById.id, orderId: cartOfUser.id });
            const newOrderDetail: IOrderDetails = {
                orderId: cartOfUser.id,
                foodId: foodById.id,
                quantity: quantity,
                price: foodById.price
            }
            if (!orderDetail) {
                console.log(newOrderDetail)
                await new OrderDetails(newOrderDetail).save();
            } else {
                await orderDetail.update(newOrderDetail);
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

    /**
     * @summary for user
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     */
    @Security("jwt")
    @Post('create-order')
    public async createOrder(@Request() request: any, @Body() input: ICreateOrder): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userId = await User.getIdFromToken(token);
            if (!userId) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }

            //Check xem shop đã mở cửa chưa
            //Lấy cart của người dùng. Nếu chưa có thì thêm mới cart
            const cartOfUser = await Orders.findOne({ userId: userId, orderStatus: OrderStatus.Cart });
            //Viết aggregate lấy thông tin shop mà người dùng đang mua - cart => user => sellerInfo
            const sellerId = cartOfUser.sellerId;
            const sellerInfo = await Sellers.findOne({ userId: sellerId });
            if (!sellerInfo.shopStatus) {
                this.setStatus(400);
                return failedResponse('Shop chưa mở cửa, vui lòng chờ', 'ClosedShop');
            }


            //Nếu đã mở cửa thì chuyển giỏ hàng hiện tại sang trạng thái chờ duyệt
            cartOfUser.orderStatus = OrderStatus.WaitingApproved;

            //Lưu giá vận chuyển 
            const { deliveryCost, expectedDeliveryTime } = input;
            cartOfUser.deliveryCost = deliveryCost;
            cartOfUser.expectedDeliveryTime = expectedDeliveryTime;
            await cartOfUser.update(cartOfUser)

            //Thông báo tới chủ shop là đang có 1 đơn hàng được order tới shop



            return successResponse(cartOfUser)
        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

    /**
     * @summary for seller
     * status: 2 (Shipping), 3 (Rejected)
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     */
    @Security("jwt")
    @Post('approve-order')
    public async approveOrder(@Body() input: IApproveOrder, @Request() request: any,): Promise<any> {
        try {
            const { orderId, status } = input;
            const token = request.headers.authorization.split(' ')[1];
            const userId = await User.getIdFromToken(token);
            if (!userId) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }

            //Lấy order của người dùng
            const orderOfUser = await Orders.findOne({ _id: orderId });

            const cloneOrderOfUser: IOrders = {
                sellerId: orderOfUser.sellerId,
                userId: orderOfUser.userId,
                createdAt: new Date(), // Lấy thời điểm tạo đơn là thời điểm shop duyệt đơn
                purchasedAt: undefined,
                deliveryCost: orderOfUser.deliveryCost,
                orderStatus: status, // Chuyển sang status được truyền vào,
                expectedDeliveryTime: undefined
            }

            await orderOfUser.update(cloneOrderOfUser)

            return successResponse(orderOfUser)
        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

    /**
     * @summary for seller
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     */
    @Security("jwt")
    @Get('orders-by-seller')
    public async getOrdersBySeller(@Request() request: any): Promise<any> { // Lấy danh sách các đơn đang đặt ở shop của mình
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userId = await Users.getIdFromToken(token);
            if (!userId) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }

            const res = await Orders.aggregate(getOrdersBySeller(userId));

            return successResponse(res)

        } catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }
}