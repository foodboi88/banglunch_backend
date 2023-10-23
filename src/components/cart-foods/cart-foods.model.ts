import mongoose, { Document, Model} from "mongoose";
import { ICartFood } from "./cart-foods.types";

interface CartFoodDocument extends ICartFood, Document { };
interface CartFoodModel extends Model<CartFoodDocument> { };

const CartFoodModelSchema = new mongoose.Schema<CartFoodDocument, CartFoodModel> ( {
    cartId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'carts'
    },
    foodId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'foods'
    },
    quantity : Number,
})

CartFoodModelSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const CartFood = mongoose.model<CartFoodDocument, CartFoodModel>('cart_foods', CartFoodModelSchema);

export default CartFood;
