import mongoose, { Document, Model} from "mongoose";
import { IOrderDetail } from "./order-detail.types";

interface ProductsSoldDocument extends IOrderDetail, Document { };
interface ProductsSoldModel extends Model<ProductsSoldDocument> { };

const ProductsSoldSchema = new mongoose.Schema<ProductsSoldDocument, ProductsSoldModel> ( {
    userId_sell : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    userId_buy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    },
    createdAt : Date,
    code_Order : String,
    voucher : String,
    price : Number,
})

ProductsSoldSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const ProductsSold = mongoose.model<ProductsSoldDocument, ProductsSoldModel>('ProductsSold', ProductsSoldSchema);

export default ProductsSold;
