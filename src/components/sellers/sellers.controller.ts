import { Controller, Route, Tags, Post, Body, Get, Request, Security, Put, Query, Path, Delete, UploadedFiles, UploadedFile, FormField, Example } from "tsoa";
import { ISeller, ISellerDTO, ISellerRegister, ISellerUpdate, IShopStatusUpdate, SellerType } from "./sellers.types";
import Seller from "./sellers.model";
import { failedResponse, successResponse } from "../../utils/http";
import User from "../users/users.model";
import { getRegistrationFormPipeline } from "./sellers.queries";

@Route("sellers")
@Tags("Sellers")
export class SellerController extends Controller {


    /**
     * sellerType: ARCHITECT, COMPANY
     * @summary REGISTER NEW SELLER REQUEST (Only user can register seller)
     * @param {ISellerRegister} body - Seller's info
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     */
    @Example<ISellerRegister>({
        sellerType: SellerType.ARCHITECT,
        identityCardNumber: '123456789',
        identityCardDate: new Date('2021-01-01'),
        identityCardPlace: 'Hà Nội',
        taxCode: '123456789',
        bankAccountNumber: '123456789',
        bankAccountName: 'Nguyễn Văn A',
        bankName: 'Vietcombank',
        bankBranch: 'Hà Nội',
    })
    @Security('jwt', ['user'])
    @Post('/register')
    public async createSeller(@Request() request:any, @Body() body: ISellerRegister): Promise<any> {
        try {
            const { identityCardNumber, taxCode, bankAccountNumber, bankBranch, bankName } = body;
            //get userId from token
            const token = request.headers.authorization.split(' ')[1];
            const userInfo = await User.getUserProfile(token);

            //check seller exist
            const sellerExist = await Seller.findOne({ userId: userInfo._id });
            if (sellerExist) {
                if (sellerExist.isApproved) {
                    this.setStatus(400);
                    return failedResponse('Gửi đơn đăng ký không thành công vì bạn đã là người bán.', 'BadRequest');
                }
                else {
                    this.setStatus(400);
                    return failedResponse("Gửi đơn đăng ký không thành công! Đơn đăng ký của bạn đã tồn tại. Hãy chờ admin phê duyệt", 'BadRequest');
                }
            }

            if ( !identityCardNumber || !taxCode || !bankAccountNumber || !bankBranch || !bankName) {
                this.setStatus(400);
                return failedResponse('Missing required fields', 'BadRequest');
            }

            const sellerDTO: ISellerDTO = {
                userId: userInfo._id,
                sellerType: body.sellerType,
                identityCardNumber: body.identityCardNumber,
                identityCardDate: body.identityCardDate,
                identityCardPlace: body.identityCardPlace,
                taxCode: body.taxCode,
                bankAccountNumber: body.bankAccountNumber,
                bankAccountName: body.bankAccountName,
                bankName: body.bankName,
                bankBranch: body.bankBranch,
                currentBalance: 0,
                amountWithdrawn: 0,
                isApproved: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                shopStatus: false,
            }
            await new Seller(sellerDTO).save();

            const result  = {
                message : 'Bạn đã gửi đơn đăng ký trở thành người bán hàng thành công. Hãy chờ admin phê duyệt!',
                status : "Waiting for admin's approval"
            }
            return successResponse(result);
        } catch (error) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }


    /**
     * @summary GET ALL REGISTRATION FORM TO CONFIRM (Only admin can get registration form of all users)
     * @param {number} size - Number of items per page
     * @param {number} offset - Number of skipped items
     * 
     * */
    @Security('jwt', ['admin'])
    @Get('/registration-form')
    public async getRegistrationForm(@Query() size?: number, @Query() offset?: number, @Query() isApproved?: boolean ): Promise<any> {
        try {
            isApproved = isApproved ? isApproved : false;
            const sellerList = await Seller.aggregate(getRegistrationFormPipeline(size, offset, isApproved));
            const result = sellerList[0] ? sellerList[0] : [];
            return successResponse(result);
        } catch (error) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }


    /**
     * @summary APPROVE SELLER (Only admin can approve seller)
     * @param {string} id - Seller's id
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     * 
    **/
    @Security('jwt', ['admin'])
    @Put('/approve/{id}')
    public async approveSeller(@Path() id: string): Promise<any> {
        try {
            const seller = await Seller.findById(id);
            if (!seller) {
                this.setStatus(400);
                return failedResponse('Người bán hàng không hợp lệ', 'BadRequest');
            }
            seller.isApproved = true;
            const user = await User.findById(seller.userId);
            user.role = 'seller';
            await user.save();
            await seller.save();

            const result = {
                message : 'Phê duyệt người bán hàng thành công',
                status : 'Approved'
            }
            return successResponse(result);
        } catch (error) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    /**
     * @summary GET SELLER PROFILE (Only seller can get their profile)
     * @returns {Promise<any>} 200 - Return seller's profile
     * @returns {Promise<any>} 400 - Return error message
     */
    @Security('jwt', ['seller'])
    @Get('/profile')
    public async getSellerProfile(@Request() request:any): Promise<any> {
        try {
            //get userId from token
            const token = request.headers.authorization.split(' ')[1];
            const userInfo = await User.getUserProfile(token);

            //check seller exist
            const seller = await Seller.findOne({ userId: userInfo._id });
            if (!seller) {
                this.setStatus(400);
                return failedResponse('Người bán hàng không hợp lệ', 'BadRequest');
            }

            const result = {
                sellerType: seller.sellerType,
                identityCardNumber: seller.identityCardNumber,
                identityCardDate: seller.identityCardDate,
                identityCardPlace: seller.identityCardPlace,
                taxCode: seller.taxCode,
                bankAccountNumber: seller.bankAccountNumber,
                bankAccountName: seller.bankAccountName,
                bankName: seller.bankName,
                bankBranch: seller.bankBranch,
                currentBalance: seller.currentBalance,
                amountWithdrawn: seller.amountWithdrawn,
            }
            return successResponse(result);
        } catch (error) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    /**
     * @summary UPDATE SELLER PROFILE (Only seller can update their profile)
     * @param {ISellerUpdate} body - Seller's info
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     */
    @Security('jwt', ['seller'])
    @Put('/profile')
    public async updateSellerProfile(@Request() request:any, @Body() body: ISellerUpdate): Promise<any> {
        try {
            const { bankAccountNumber, bankName, bankBranch, bankAccountName } = body;
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
                bankAccountNumber: bankAccountNumber ? bankAccountNumber : seller.bankAccountNumber,
                bankName: bankName ? bankName : seller.bankName,
                bankBranch: bankBranch ? bankBranch : seller.bankBranch,
                bankAccountName: bankAccountName ? bankAccountName : seller.bankAccountName,
            }

            await Seller.findByIdAndUpdate(seller._id, updateInfo);

            const result = {
                message : 'Cập nhật thông tin người bán hàng thành công',
                status : 'Updated'
            }
            return successResponse(result);
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
    public async updateShopStatus(@Request() request:any, @Body() body: IShopStatusUpdate): Promise<any> {
        try {
            const { shopStatus } = body;
            //get userId from token
            const token = request.headers.authorization.split(' ')[1];
            const userInfo = await User.getUserProfile(token);
            if (!userInfo) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }
            console.log(userInfo)
            //check seller exist
            const seller = await Seller.findOne({ userId: userInfo._id });
            console.log(seller)
            if (!seller) {
                this.setStatus(400);
                return failedResponse('Người bán hàng không hợp lệ', 'BadRequest');
            }

           const updateInfo = {
                shopStatus: shopStatus
            }

            await Seller.findByIdAndUpdate(seller._id, updateInfo);

            const result = {
                message : 'Cập nhật trạng thái shop bán hàng thành công',
                status : 'Updated'
            }
            return successResponse(result);
        } catch (error) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }
}
