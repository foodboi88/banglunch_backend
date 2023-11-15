import { Controller, Route, Tags, Post, Body, Get, Request, Security, Put, Query, Path, Delete, UploadedFiles, UploadedFile, FormField, Example } from "tsoa";
import { failedResponse, successResponse } from "../../utils/http";
import { ICaculateShippingCostInput } from "./delivery.types";
import axios from "axios";

@Route("delivery")
@Tags("Delivery")
export class DeliveryController extends Controller {

    /**
     * @summary Caculate shipping cost depend on size and weight of food - GIAOHANGNHANH
     * @param {ICaculateShippingCostInput}
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     */
    @Security('jwt', ['user', 'seller'])
    @Post('/caculate-shipping-cost')
    public async caculateShippingCost(@Request() request: any, @Body() body: ICaculateShippingCostInput): Promise<any> {
        try {
            
            const response = await axios.post('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
                "service_type_id": 5,
                "from_district_id": 1442,
                "to_district_id": 1820,
                "to_ward_code": "030712",
                "height": 20,
                "length": 30,
                "weight": 3000,
                "width": 40,
                "insurance_value": 0,
                "coupon": null,
                "items": [
                    {
                        "name": "TEST1",
                        "quantity": 1,
                        "height": 200,
                        "weight": 1000,
                        "length": 200,
                        "width": 200
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
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }
}
