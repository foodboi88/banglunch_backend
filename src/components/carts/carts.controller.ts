import { failedResponse, successResponse } from "../../utils/http";
import { Controller, Get, Route, Security, Tags, Request, Body, Delete, Path, Post, Put } from "tsoa";
import User from "../users/users.model";
import Cart from "./carts.model";
import CartFood from "../cart-foods/cart-foods.model";
import { getProductInMyCart } from "./carts.queries";
import { ICartInput } from "./carts.types";
import Food from "../foods/foods.model";


@Route("carts")
@Tags("Carts")
export class CartController extends Controller {

    @Security("jwt")
    @Put("update-cart")
    public async addProductToCart(@Body() data : ICartInput,
        @Request() request: any): Promise<any> {
            try{
                const token = request.headers.authorization.split(' ')[1];
                const userId = await User.getIdFromToken(token);
                if (!userId) {
                    this.setStatus(401);
                    return failedResponse('Unauthorized', 'Unauthorized');
                }
                
                const item = await CartFood.findOne({cartId : data.cartId , foodId : data.foodId})
                if (item){
                    await CartFood.findByIdAndUpdate(item._id, data);

                    this.setStatus(200);
                    return successResponse({"result" : "cập nhật số lượng của sản phẩm trong giỏ thành công"})
                }else{
                    const update_cart_food = new CartFood(data);
                
                    await update_cart_food.save()
                    return successResponse({"result" : "Thêm đồ ăn vào giỏ hàng thành công!"})
                }
                

            }catch(err){
                this.setStatus(500);
                return failedResponse('Execute service went wrong', 'ServiceException');
            }


        }

        @Security("jwt")
        @Delete("delete-one-product/{productId}")
        public async deleteProductCart(@Path() productId: string,
        @Request() request: any): Promise<any> {
            try{
                const token = request.headers.authorization.split(' ')[1];
                const user_id = await User.getIdFromToken(token);
                if (!user_id) {
                    this.setStatus(401);
                    return failedResponse('Unauthorized', 'Unauthorized');
                }
                
                const update_cart = await Cart.findOne({userId : user_id})
                // let items : any = update_cart.productIds
                // const index = items.indexOf(productId)
                // if ( index !== -1){
                //     items.splice(index,1)
                //     update_cart.productIds = items
                //     update_cart.updatedAt = new Date()
                //     await update_cart.save()
                //     return successResponse("Delete-Product-Success!")
                // }
                // this.setStatus(400)
                // return failedResponse("Product-does-not-exist!","Bad Request")

            }catch(err){
                this.setStatus(500);
                return failedResponse('Execute service went wrong', 'ServiceException');
            }
        }

        @Security("jwt")
        @Delete("delete-all-product")
        public async deleteAllProductCart(
        @Request() request: any): Promise<any> {
            try{
                const token = request.headers.authorization.split(' ')[1];
                const user_id = await User.getIdFromToken(token);
                if (!user_id) {
                    this.setStatus(401);
                    return failedResponse('Unauthorized', 'Unauthorized');
                }
                
                const update_cart = await Cart.findOne({userId : user_id})
                // let items : any = update_cart.productIds
                // if ( items.length ){
                //     update_cart.productIds = []
                //     update_cart.updatedAt = new Date()
                //     await update_cart.save()
                //     return successResponse("Delete-All-Product-Success!")
                // }
                // this.setStatus(400)
                // return failedResponse("Cart-is-empty!","Bad Request")

            }catch(err){
                this.setStatus(500);
                return failedResponse('Execute service went wrong', 'ServiceException');
            }
        }

        @Security("jwt")
        @Get("get-quantity")
        public async getQuantityProductMyCart(
        @Request() request: any): Promise<any> {
            try{
                const token = request.headers.authorization.split(' ')[1];
                const user_id = await User.getIdFromToken(token);
                if (!user_id) {
                    this.setStatus(401);
                    return failedResponse('Unauthorized', 'Unauthorized');
                }
                
                const update_cart = await Cart.findOne({userId : user_id})
                // let items : any = update_cart.productIds
                // return successResponse({"quantityProduct" : items.length })

            }catch(err){
                this.setStatus(500);
                return failedResponse('Execute service went wrong', 'ServiceException');
            }
        }

        @Security("jwt")
        @Get("get-all-product")
        public async getProductInMyCart(
            @Request() request: any): Promise<any> {
                try{
                    const token = request.headers.authorization.split(' ')[1];
                    const user_id = await User.getIdFromToken(token);
                    if (!user_id) {
                        this.setStatus(401);
                        return failedResponse('Unauthorized', 'Unauthorized');
                    }
                    // const product = (await Cart.findOne({userId : user_id})).productIds

                    // if(product.length == 0 ){
                    //     this.setStatus(400)
                    //     return failedResponse("Cart-is-empty",'Bad Request')
                    // }

                    // let cart = await Cart.aggregate(getProductInMyCart(user_id))
                    // if(cart.length > 0){
                    //     cart = cart[0].products
                    // }
                    // return successResponse(cart)


                }catch(err){
                    this.setStatus(500);
                    return failedResponse('Execute service went wrong', 'ServiceException');
                }
            }

}