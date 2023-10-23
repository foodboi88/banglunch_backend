import { Controller, Route, Tags, Post, Body, Get, Request, Security, Put, Query, Path, Delete} from "tsoa";
import { failedResponse, successResponse } from "../../utils/http";
import User from "../users/users.model";
import OrderDetail from "./order-details.model";
import { getHistoryBuyUserId, getProductsSoldBuyAdmin, getProductsSoldBuySellerId } from "./order-details.queries";


@Route("ProductsSold")
@Tags("Order-details")
export class ProductsSoldController extends Controller {

    @Security("jwt")
    @Get()
    public async getProductSolds(@Query() size: number, @Query() offset: number,
        @Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const user_id = await User.getIdFromToken(token);
            if (!user_id) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }

            const res = await OrderDetail.find({userId_sell : user_id}).skip(offset).limit(size).select("-userId_sell -userId_buy -voucher");
            
            return successResponse(res)

        }catch(err){
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    
    
    
    }

    @Security("jwt")
    @Get("/sell-history-by-seller")
    public async getProductSoldsBySeller(@Query() userId : string,
        @Query() size: number, @Query() offset: number,
        @Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const user_id = await User.getIdFromToken(token);
            if (!user_id) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }
            let data : any = await OrderDetail.aggregate(getProductsSoldBuySellerId(userId,size,offset))
            
            if(data.length > 0){
                const l = data[0].items.length
                data = data[0]
                let total = 0
                for(let i =0 ; i < l ; i++){
                    total += Number(data.items[i].price)
                }
                data.totalPrice = total
            }
            return successResponse(data)

        }catch(err){
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Security("jwt",['admin'])
    @Get("/sell-history-by-admin")
    public async getProductSoldsByAdmin(@Query() size: number, @Query() offset: number,
        @Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const user_id = await User.getIdFromToken(token);
            if (!user_id) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }
            let data : any = await OrderDetail.aggregate(getProductsSoldBuyAdmin(size,offset))
            
            if(data.length > 0){
                const l = data[0].items.length
                data = data[0]
                let total = 0
                for(let i =0 ; i < l ; i++){
                    total += Number(data.items[i].price)
                }
                data.totalPrice = total
            }
            return successResponse(data)

        }catch(err){
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Security("jwt")
    @Get("/sell-history-buy-user")
    public async getUserPurchaseHistory(@Query() userId : string,
        @Query() size: number, @Query() offset: number,
        @Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const user_id = await User.getIdFromToken(token);
            if (!user_id) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }
            let data : any = await OrderDetail.aggregate(getHistoryBuyUserId(userId,size,offset))
            
            if(data.length > 0){
                const l = data[0].items.lengthN
                data = data[0]
                let total = 0
                for(let i =0 ; i < l ; i++){
                    total += Number(data.items[i].price)
                }
                data.totalPrice = total
            }
            return successResponse(data)

        }catch(err){
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    
}