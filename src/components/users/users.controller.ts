import jwt, { Secret } from "jsonwebtoken";
import { Body, Controller, Get, Post, Request, Route, Security, Tags } from "tsoa";
import { RegisterMailHTML } from "../../service/mail-service/register-mail-html";
import { SendMail } from "../../service/mail-service/send-mail";
import { OrderStatus } from "../../shared/enums/order.enums";
import { failedResponse, instanceOfFailedResponseType, successResponse } from "../../utils/http";
import Orders from "../orders/orders.model";
import Users from "./users.model";
import { ActiveStatus, IRefreshTokenReq, IUser, IUserDB, IUserLogin, IUserProfile, IUserRegister } from "./users.types";
import Sellers from "../sellers/sellers.model";

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
                active: ActiveStatus.InActive
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

            const mailOptions = {
                to: email,
                subject: "Xác nhận email - VRO GROUP",
                text: '',
                html: RegisterMailHTML(
                    name,
                    "Chào mừng bạn đến với VRO ! Xác nhận email để bắt đầu",
                    `${process.env.CLIENT_DOMAIN}/active-account?email=${email}&activeCode=${newUser.activeCode}`
                )
            }
            SendMail(
                mailOptions.to,
                mailOptions.subject,
                mailOptions.text,
                mailOptions.html
            );
            const result = {
                email: newUser.email,
                name: newUser.name,
                message: 'Đăng kí tài khoản thành công! Vui lòng kiểm tra email để kích hoạt tài khoản'
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

            if (user.active === ActiveStatus.InActive) {
                this.setStatus(400);
                return failedResponse('Tài khoản chưa được kích hoạt', 'AccountNotActivated');
            }

            //check if user is blocked then return error
            if (user.status == "block") {
                this.setStatus(400);
                return failedResponse('Tài khoản đã bị khóa! Vui lòng liên hệ admin để biết thêm chi tiết hoặc để yêu cầu mở khóa', 'AccountBlocked');
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

            const sellerInfo = await Sellers.findOne({userId: userInfo._id})
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