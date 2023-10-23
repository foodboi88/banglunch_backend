import mongoose, { Document, Model} from "mongoose";
import { ICart } from "./carts.types";

interface CartDocument extends ICart, Document { };
interface CartModel extends Model<CartDocument> { };

const CartSchema = new mongoose.Schema<CartDocument, CartModel> ( {
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    createdAt : Date,
    updatedAt : Date
})

CartSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const Cart = mongoose.model<CartDocument, CartModel>('carts', CartSchema);

export default Cart;
