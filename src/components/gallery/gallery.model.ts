import mongoose, { Document, Model} from "mongoose";
import { IProductImage } from "./gallery.types";

interface ProductImageDocument extends IProductImage, Document { };
interface ProductImageModel extends Model<ProductImageDocument> { };

const productImageSchema = new mongoose.Schema<ProductImageDocument, ProductImageModel> ( {
    fileName : {
        type : String,
        require : true
    },
    filePath : {
        type : String,
        require : true
    },
    isMain : {
        type : Boolean,
        require : true
    },
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    },
    createdAt : Date,
    updatedAt : Date
})

productImageSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const ProductImage = mongoose.model<ProductImageDocument, ProductImageModel>('ProductImage', productImageSchema);

export default ProductImage; 