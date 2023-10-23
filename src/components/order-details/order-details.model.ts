import mongoose, { Document, Model} from "mongoose";
import { IOrderDetail } from "./order-details.types";

interface OrderDetailDocument extends IOrderDetail, Document { };
interface OrderDetailModel extends Model<OrderDetailDocument> { };

const OrderDetailModelSchema = new mongoose.Schema<OrderDetailDocument, OrderDetailModel> ( {
    idSeller : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users'
    },
    idUser : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users'
    },
    foodId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Foods'
    },
    createdAt : Date,
    codeOrder : String,
    voucher : String,
    price : Number,
})

OrderDetailModelSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const OrderDetail = mongoose.model<OrderDetailDocument, OrderDetailModel>('order_details', OrderDetailModelSchema);

export default OrderDetail;
