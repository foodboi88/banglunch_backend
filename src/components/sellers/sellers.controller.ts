import { Body, Controller, Get, Put, Request, Route, Security, Tags } from "tsoa";
import { failedResponse, successResponse } from "../../utils/http";
import User from "../users/users.model";
import Seller from "./sellers.model";
import { IShopStatusUpdate } from "./sellers.types";

@Route("sellers")
@Tags("Sellers")
export class SellerController extends Controller {

    /**
     * @summary OPEN/CLOSE SHOP (Only seller can)
     * @param {ISellerUpdate} body - Shop's status
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     */
    @Security('jwt', ['seller'])
    @Get('/shop-status')
    public async getShopStatus(@Request() request: any): Promise<any> {
        try {
            //get userId from token
            const token = request.headers.authorization.split(' ')[1];
            const userInfo = await User.getUserProfile(token);
            if (!userInfo) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }
            //check seller exist
            const seller = await Seller.findOne({ userId: userInfo._id });
            if (!seller) {
                this.setStatus(400);
                return failedResponse('Người bán hàng không hợp lệ', 'BadRequest');
            }
            return successResponse(seller.shopStatus);
        } catch (error) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    /**
     * @summary OPEN/CLOSE SHOP (Only seller can)
     * @param {ISellerUpdate} body - Shop's status
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     */
    @Security('jwt', ['seller'])
    @Put('/shop-status')
    public async updateShopStatus(@Request() request: any, @Body() body: IShopStatusUpdate): Promise<any> {
        try {
            const { shopStatus } = body;
            //get userId from token
            const token = request.headers.authorization.split(' ')[1];
            const userInfo = await User.getUserProfile(token);
            if (!userInfo) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }
            //check seller exist
            const seller = await Seller.findOne({ userId: userInfo._id });
            if (!seller) {
                this.setStatus(400);
                return failedResponse('Người bán hàng không hợp lệ', 'BadRequest');
            }

            const updateInfo = {
                shopStatus: shopStatus
            }

            await Seller.findByIdAndUpdate(seller._id, updateInfo);

            const result = {
                message: 'Cập nhật trạng thái quán thành công',
                status: shopStatus
            }
            return successResponse(result);
        } catch (error) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }
}
