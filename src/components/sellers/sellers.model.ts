import mongoose, { Document, Model } from "mongoose";
import { ISeller } from "./sellers.types";

interface SellerDocument extends ISeller, Document { };
interface SellerModel extends Model<SellerDocument> { };

const sellerSchema = new mongoose.Schema<SellerDocument, SellerModel>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    identityId: {
        type: String,
        require: true
    },
    personalTaxCode: {
        type: String,
        require: true
    },
    shopStatus: {
        type: Boolean,
        default: false
    },
    fromDetailAddress: {
        type: String,
        require: true
    }
})

sellerSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});

const Sellers = mongoose.model<SellerDocument, SellerModel>('sellers', sellerSchema);

export default Sellers;