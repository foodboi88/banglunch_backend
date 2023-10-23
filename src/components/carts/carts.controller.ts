import { failedResponse, successResponse } from "../../utils/http";
import { Controller, Get, Route, Security, Tags, Request } from "tsoa";
import User from "../users/users.model";
import Cart from "./carts.model";


@Route("carts")
@Tags("Carts")
export class CartController extends Controller {

    @Security("jwt")
    @Get("product-quantity")
    public async getQuantityProductMyCart(@Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const user_id = await User.getIdFromToken(token);
            if (!user_id) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }

            const update_cart = await Cart.findOne({ userId: user_id })
            let items: any = update_cart.productIds
            return successResponse({ "quantityProduct": items.length })

        } catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }
}