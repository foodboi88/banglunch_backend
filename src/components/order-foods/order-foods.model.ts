import mongoose, { Document, Model} from "mongoose";
import { IOrderFoods } from "./order-foods.types";

interface OrderFoodsDocument extends IOrderFoods, Document { };
interface OrderFoodsModel extends Model<OrderFoodsDocument> { };

const OrderFoodsModelSchema = new mongoose.Schema<OrderFoodsDocument, OrderFoodsModel> ( {
    orderDetailId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'order_details'
    },
    foodId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'foods'
    },
    quantity: Number
})

OrderFoodsModelSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const OrderFoods = mongoose.model<OrderFoodsDocument, OrderFoodsModel>('order_foods', OrderFoodsModelSchema);

export default OrderFoods;
