import jwt, { Secret } from "jsonwebtoken";
import { Body, Controller, Get, Post, Request, Route, Security, Tags } from "tsoa";
import { ShopStatus } from "../../shared/constants/sellers.constants";
import { OrderStatus } from "../../shared/enums/order.enums";
import { failedResponse, instanceOfFailedResponseType, successResponse } from "../../utils/http";
import Orders from "../orders/orders.model";
import Sellers from "../sellers/sellers.model";
import Users from "./users.model";
import { ActiveStatus, IRefreshTokenReq, ISellerRegister, IUser, IUserDB, IUserLogin, IUserProfile, IUserRegister } from "./users.types";

@Route('users')
@Tags('Users')
export class UserController extends Controller {

    @Post('register')
    public async register(@Body() input: IUserRegister): Promise<any> {
        try {
            const { email, password, confirmPassword, name, phone, address, dob, gender } = input;
            if (password != confirmPassword) {
                this.setStatus(400);
                return failedResponse('Xác nhận mật khẩu không trùng khớp', 'NotEqualPassword');
            }
            const user = await Users.findOne({ email });
            console.log(user)
            if (user) {
                this.setStatus(400);
                return failedResponse('Email này đã được đăng ký', 'RegisteredEmail');
            }
            const newUser = new Users({
                email,
                password,
                name,
                address,
                phone,
                dob,
                gender,
                createdAt: new Date(),
                updatedAt: new Date(),
                role: 'user',
                active: ActiveStatus.Active
            })
            await newUser.save();

            const newCart = new Orders({
                userId: newUser.id,
                sellerId: null,
                createdAt: new Date(),
                purchasedAt: null,
                deliveryCost: 0,
                orderStatus: OrderStatus.Cart
            })
            await newCart.save();


            const result = {
                email: newUser.email,
                name: newUser.name,
                message: 'Đăng kí tài khoản thành công'
            }
            return successResponse(result);

        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

    @Post('register-seller')
    public async registerSeller(@Body() input: ISellerRegister): Promise<any> {
        try {
            const { email, password, confirmPassword, name, phone, address, dob, gender, fromDetailAddress, identityId, personalTaxCode } = input;
            if (password != confirmPassword) {
                this.setStatus(400);
                return failedResponse('Xác nhận mật khẩu không trùng khớp', 'NotEqualPassword');
            }
            const user = await Users.findOne({ email });
            console.log(user)
            if (user) {
                this.setStatus(400);
                return failedResponse('Email này đã được đăng ký', 'RegisteredEmail');
            }
            const newUser = new Users({
                email,
                password,
                name,
                address,
                phone,
                dob,
                gender,
                createdAt: new Date(),
                updatedAt: new Date(),
                role: 'seller',
                active: ActiveStatus.Active
            })
            await newUser.save();

            const newShopInfo = new Sellers({
                userId: newUser._id,
                fromDetailAddress: fromDetailAddress,
                identityId: identityId,
                personalTaxCode: personalTaxCode,
                shopStatus: ShopStatus.Close
            })
            await newShopInfo.save();


            const result = {
                email: newUser.email,
                name: newUser.name,
                message: 'Đăng kí làm chủ quán thành công'
            }
            return successResponse(result);

        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

    @Post('login')
    public async login(@Body() data: IUserLogin): Promise<any> {
        try {
            const { email, password, remember } = data;
            const user = await Users.checkLogin(email, password);
            if (instanceOfFailedResponseType<string>(user)) {
                this.setStatus(400);
                return failedResponse(user, 'FailedLogin');
            }
            user as IUserDB;
            if (!user) {
                this.setStatus(400);
                return failedResponse('Email hoặc mật khẩu không đúng', 'WrongEmailOrPassword');
            }

            if (user.role === 'user') {
                const accessToken = jwt.sign({ id: user.id, email: user.email, scopes: ['user'] }, 'dqPyPxJnDS4e2iU0815m' as Secret, { expiresIn: '1d' });
                const refreshToken = jwt.sign({ id: user.id, email: user.email, scopes: ['user'] }, 'DQpYpXjNds4E2Iu0815M' as Secret, { expiresIn: '7d' });
                return successResponse({ accessToken, refreshToken, role: user.role });
            }
            if (user.role === 'admin') {
                const accessToken = jwt.sign({ id: user.id, email: user.email, scopes: ['admin', 'user'] }, 'dqPyPxJnDS4e2iU0815m' as Secret, { expiresIn: '1d' });
                const refreshToken = jwt.sign({ id: user.id, email: user.email, scopes: ['admin', 'user'] }, 'DQpYpXjNds4E2Iu0815M' as Secret, { expiresIn: '7d' });
                return successResponse({ accessToken, refreshToken, role: user.role });
            }
            if (user.role === 'seller') {
                const accessToken = jwt.sign({ id: user.id, email: user.email, scopes: ['seller', 'user'] }, 'dqPyPxJnDS4e2iU0815m' as Secret, { expiresIn: '1d' });
                const refreshToken = jwt.sign({ id: user.id, email: user.email, scopes: ['seller', 'user'] }, 'DQpYpXjNds4E2Iu0815M' as Secret, { expiresIn: '7d' });
                return successResponse({ accessToken, refreshToken, role: user.role });
            }
        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

    @Post('refresh-token')
    public async refreshToken(@Body() data: IRefreshTokenReq): Promise<any> {
        try {
            const { refreshToken } = data;
            if (!refreshToken) {
                this.setStatus(400);
                return failedResponse('Refresh này không tồn tại', 'RefreshTokenNotFound');
            }
            jwt.verify(refreshToken, 'DQpYpXjNds4E2Iu0815M' as Secret, (error, user: any) => {
                if (error) {
                    this.setStatus(400);
                    return failedResponse('Refresh token không hợp lệ', 'RefreshTokenInvalid');
                }

                const accessToken = jwt.sign({ email: user.email }, 'dqPyPxJnDS4e2iU0815m' as Secret, { expiresIn: '1d' });
                const refreshToken = jwt.sign({ email: user.email }, 'DQpYpXjNds4E2Iu0815M' as Secret, { expiresIn: '7d' });

                return successResponse({ accessToken, refreshToken });
            })
        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

    //get profile user by token in header
    @Security('jwt', ['user'])
    @Get('profile')
    public async getProfile(@Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userInfo = await Users.getUserProfile(token);
            if (instanceOfFailedResponseType<IUser>(userInfo)) {
                this.setStatus(400);
                return userInfo;
            }
            userInfo as IUserProfile;

            const sellerInfo = await Sellers.findOne({ userId: userInfo._id })
            const result = {
                id: userInfo._id,
                email: userInfo.email,
                name: userInfo.name,
                phone: userInfo.phone,
                address: userInfo.address,
                dob: userInfo.dob,
                gender: userInfo.gender,
                createdAt: userInfo.createdAt,
                updatedAt: userInfo.updatedAt,
                accessToken: token,
                sellerInfo: sellerInfo
            }
            return successResponse(result);
        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }
}