import mongoose, { Document, Model} from "mongoose";
import { IOrderDetails } from "./order-details.types";

interface OrderDetailsDocument extends IOrderDetails, Document { };
interface OrderDetailsModel extends Model<OrderDetailsDocument> { };

const OrderDetailsModelSchema = new mongoose.Schema<OrderDetailsDocument, OrderDetailsModel> ( {
    orderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'orders'
    },
    foodId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'foods'
    },
    quantity: Number,
    price: Number,
})

OrderDetailsModelSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const OrderDetails = mongoose.model<OrderDetailsDocument, OrderDetailsModel>('order_details', OrderDetailsModelSchema);

export default OrderDetails;
