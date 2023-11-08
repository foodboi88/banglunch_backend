import mongoose, { Document, Model} from "mongoose";
import { IOrderFoods } from "./order-foods.types";

interface OrderFoodsDocument extends IOrderFoods, Document { };
interface OrderFoodsModel extends Model<OrderFoodsDocument> { };

const OrderFoodsModelSchema = new mongoose.Schema<OrderFoodsDocument, OrderFoodsModel> ( {
    idSeller : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users'
    },
    idUser : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users'
    },
    createdAt : Date,
    purchasedAt : Date,
    amount : Number,
    isCart: Boolean
})

OrderFoodsModelSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const OrderFoods = mongoose.model<OrderFoodsDocument, OrderFoodsModel>('order_foods', OrderFoodsModelSchema);

export default OrderFoods;
