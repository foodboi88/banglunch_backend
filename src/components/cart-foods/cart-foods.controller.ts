import { Controller, Route, Tags, Post, Body, Get, Request, Security, Put, Query, Path, Delete} from "tsoa";
import { failedResponse, successResponse } from "../../utils/http";
import User from "../users/users.model";
import CartFood from "./cart-foods.model";
// import { getHistoryBuyUserId, getProductsSoldBuyAdmin, getProductsSoldBuySellerId } from "./order-details.queries";


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
            

        }catch(err){
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    
}