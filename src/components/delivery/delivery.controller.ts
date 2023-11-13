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
    @Security('jwt', ['user','seller'])
    @Post('/caculate-shipping-cost')
    public async caculateShippingCost(@Request() request:any, @Body() body: ICaculateShippingCostInput): Promise<any> {
        try {
            const response = await axios.post('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
                "service_id":53321,
                "insurance_value":500000,
                "coupon": null,
                "from_district_id":1542,
                "to_district_id":1444,
                "to_ward_code":"20314",
                "height":15,
                "length":15,
                "weight":1000,
                "width":15
            },{
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
