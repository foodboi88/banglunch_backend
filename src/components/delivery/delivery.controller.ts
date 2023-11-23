import axios from "axios";
import { Body, Controller, Post, Request, Route, Security, Tags } from "tsoa";
import { OrderStatus } from "../../shared/enums/order.enums";
import { failedResponse } from "../../utils/http";
import Orders from "../orders/orders.model";
import { IOrders } from "../orders/orders.types";
import Users from "../users/users.model";
import { ICaculateShippingCostInput } from "./delivery.types";

@Route("delivery")
@Tags("Delivery")
export class DeliveryController extends Controller {

    /**
     * @summary Caculate shipping cost depend on size and weight of food - GIAOHANGNHANH
     * @param {ICaculateShippingCostInput}
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     */
    @Security('jwt')
    @Post('/caculate-shipping-cost')
    public async caculateShippingCost(@Request() request: any, @Body() body: ICaculateShippingCostInput): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userId = await Users.getIdFromToken(token);
            if (!userId) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }

            // Api tính phí vận chuyển của giao hàng nhanh
            const response = await axios.post('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
                "service_id": 53321,
                "insurance_value": 500000,
                "coupon": null,
                "from_district_id": 1542,
                "to_district_id": 1444,
                "to_ward_code": "20314",
                "height": 15,
                "length": 15,
                "weight": 2000,
                "width": 15
            }, {
                headers: {
                    'Token': `ee813073-822e-11ee-96dc-de6f804954c9`,
                    'ShopId': `4695506`,
                    'Content-Type': 'application/json'
                }
            })

            //Lấy cart của người dùng. Nếu chưa có thì thêm mới cart
            let cartOfUser = await Orders.findOne({ userId: userId, orderStatus: OrderStatus.Cart });
            const newCart: IOrders = {
                userId: userId,
                sellerId: cartOfUser.sellerId ? cartOfUser.sellerId : '',
                createdAt: cartOfUser.createdAt ? cartOfUser.createdAt : new Date(),
                purchasedAt: null,
                deliveryCost: response.data.data.total, // Cập nhật giá vận chuyển mới cho cart để tiện convert sang order
                orderStatus: OrderStatus.Cart
            }
            const newCartMongo = new Orders(newCart)
            if (!cartOfUser) { // Chưa có thì thêm mới cart
                cartOfUser = newCartMongo;
                await cartOfUser.save();
            } else {
                await cartOfUser.update(newCart);
            }

            return response.data
        } catch (error) {
            this.setStatus(500);
            return failedResponse(error, 'ServiceException');
        }
    }

    /**
     * @summary Create a shipping order - GIAOHANGNHANH
     * @param {ICaculateShippingCostInput}
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     */
    @Security('jwt')
    @Post('/create-shipping-order')
    public async createShippingOrder(@Request() request: any, @Body() body: ICaculateShippingCostInput): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userId = await Users.getIdFromToken(token);
            if (!userId) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }

            const response = await axios.post('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/preview', {
                "payment_type_id": 2,
                "note": "Tintest 123",
                "from_ward_code": "20314",
                "required_note": "KHONGCHOXEMHANG",
                "return_phone": "0332190458",
                "return_address": "39 NTT",
                "return_district_id": null,
                "return_ward_code": "20107",
                "client_order_code": "",
                "to_name": "TinTest124",
                "to_phone": "0987654321",
                "to_address": "72 Thành Thái, Phường 14, Quận 10, Hồ Chí Minh, Vietnam",
                "to_ward_code": "20107",
                "to_district_id": 1442,
                "cod_amount": 200000,
                "content": "ABCDEF",
                "weight": 200,
                "length": 15,
                "width": 15,
                "height": 15,
                "pick_station_id": 0,
                "insurance_value": 0,
                "service_id": 0,
                "service_type_id": 2,
                "coupon": null,
                "pick_shift": [
                    2
                ],
                "items": [
                    {
                        "name": "Áo Polo",
                        "code": "Polo123",
                        "quantity": 1,
                        "price": 200000,
                        "length": 12,
                        "width": 12,
                        "height": 12,
                        "category": {
                            "level1": "Áo"
                        }
                    }
                ]
            }, {
                headers: {
                    'Token': `ee813073-822e-11ee-96dc-de6f804954c9`,
                    'ShopId': `4695506`,
                    'Content-Type': 'application/json'
                }
            })



            return response.data
        } catch (error) {
            this.setStatus(500);
            return failedResponse(error, 'ServiceException');
        }
    }

    /**
     * @summary Get provinces - GIAOHANGNHANH
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     */
    @Security('jwt')
    @Post('/get-province')
    public async getProvince(@Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userId = await Users.getIdFromToken(token);
            if (!userId) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }

        } catch (error) {
            this.setStatus(500);
            return failedResponse(error, 'ServiceException');
        }
    }

    /**
     * @summary Get districts by province - GIAOHANGNHANH
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     */
    @Security('jwt')
    @Post('/get-district-by-province')
    public async getDistrictsByProvince(@Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userId = await Users.getIdFromToken(token);
            if (!userId) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }

        } catch (error) {
            this.setStatus(500);
            return failedResponse(error, 'ServiceException');
        }
    }

    /**
     * @summary Get districts by province - GIAOHANGNHANH
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     */
    @Security('jwt')
    @Post('/get-ward-by-district')
    public async getWardsByDistrict(@Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userId = await Users.getIdFromToken(token);
            if (!userId) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }

        } catch (error) {
            this.setStatus(500);
            return failedResponse(error, 'ServiceException');
        }
    }
}


