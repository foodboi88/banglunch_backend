import mongoose, { Document, Model} from "mongoose";
import { IProduct } from "./food.types";

interface ProductDocument extends IProduct, Document { };
interface ProductModel extends Model<ProductDocument> { };

const ProductSchema = new mongoose.Schema<ProductDocument, ProductModel> ( {
    title : {
        type : String,
        require : true
    },
    content : {
        type : String,
        default : ''
    },
    price : {
        type : Number,
        default : 0
    },
    originalPrice : {
        type : Number,
    },
    views : {
        type : Number,
        default : 0
    },
    likes : {
        type : Number,
        default : 0
    },
    quantityPurchased : {
        type : Number,
        default : 0
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    isDisable : {
        type : Boolean,
        default : false
    },
    totalRate : {
        type : Number,
        default : 0
    },
    createdAt : Date,
    updatedAt : Date,
    deletedAt : {
        type : Date,
        default : null,
    }
})

ProductSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const Product = mongoose.model<ProductDocument, ProductModel>('Product', ProductSchema);

export default Product;
