import mongoose, { Document, Model } from "mongoose";
import { IOrders } from "./orders.types";

interface OrdersDocument extends IOrders, Document { };
interface OrdersModel extends Model<OrdersDocument> { };

const OrdersModelSchema = new mongoose.Schema<OrdersDocument, OrdersModel>({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    createdAt: Date,
    rejectedAt: Date,
    approvedAt: Date,
    amount: Number,
    deliveryCost: Number,
    orderStatus: Number,
    expectedDeliveryTime: Date,
})

OrdersModelSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});

const Orders = mongoose.model<OrdersDocument, OrdersModel>('orders', OrdersModelSchema);

export default Orders;
