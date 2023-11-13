import { Controller, Route, Tags, Post, Body, Get, Request, Security, Put, Query, Path, Delete} from "tsoa";
import { failedResponse, successResponse } from "../../utils/http";
import User from "../users/users.model";
import OrderDetail from "./orders.model";
import Food from "../foods/foods.model";
import OrderFoods from "../order-details/order-details.model";
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

            const res = await OrderDetail.findOne({userId : userId, isCart: true });
            
            return successResponse(res)

        }catch(err){
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Security("jwt")
    @Post('update-cart')
    public async register(@Body() input: IUpdateCartBodyrequest, @Request() request: any): Promise<any>{
        try{
            const {foodId, sellerId, quantity } = input;
            //Check xem người dùng đăng nhập chưa
            const token = request.headers.authorization.split(' ')[1];
            const userId = await User.getIdFromToken(token);
            if (!userId) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }

            //Lấy cart của người dùng. Nếu chưa có thì thêm mới cart
            let cartOfUser = await OrderDetail.findOne({userId : userId, isCart: true });
            console.log(cartOfUser);
            if(!cartOfUser){
                const newCart = new OrderDetail({
                    userId: userId,
                    sellerId: sellerId,
                    createdAt: new Date(),
                    purchasedAt: null,
                    isCart: true
                })
                await newCart.save();
                cartOfUser = newCart;
            }

            // Tìm đồ ăn theo id
            const foodById = await Food.findById(foodId);
            if(!foodById){
                this.setStatus(400);
                return failedResponse('Không tìm thấy sản phẩm', 'NotFoundData');
            }

            //Tìm đồ ăn được đặt và update
            const orderFood = OrderFoods.findOne({foodId: foodById.id, orderDetailId: cartOfUser.id});
            console.log(orderFood);
            if(!orderFood){
                const newOrderFood = new OrderFoods({
                    orderDetailId: cartOfUser.id,
                    foodId: foodById.id,
                    quantity: quantity
                })
                console.log(newOrderFood)
                newOrderFood.save();
            }else{
                await orderFood.update({quantity: quantity})
            }

            const result = {
                updatedFood: input,
                message: 'Cập nhật giỏ hàng thành công',
            }
            return successResponse(result);
            
        }catch(error){
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }
}