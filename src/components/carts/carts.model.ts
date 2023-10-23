import mongoose, { Document, Model} from "mongoose";
import { ICart } from "./carts.types";

interface CartDocument extends ICart, Document { };
interface CartModel extends Model<CartDocument> { };

const CartSchema = new mongoose.Schema<CartDocument, CartModel> ( {
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    productIds : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    }],
    createdAt : Date,
    updatedAt : Date
})

CartSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const Cart = mongoose.model<CartDocument, CartModel>('Carts', CartSchema);

export default Cart;
