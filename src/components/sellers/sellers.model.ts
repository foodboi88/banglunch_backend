import mongoose, { Document, Model} from "mongoose";
import { ISeller, SellerType } from "./sellers.types";

interface SellerDocument extends ISeller, Document { };
interface SellerModel extends Model<SellerDocument> { };

const sellerSchema = new mongoose.Schema<SellerDocument, SellerModel> ( {
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        require : true
    },
    sellerType : {
        type : String,
        enum : [SellerType.ARCHITECT, SellerType.COMPANY],
        require : true
    },
    identityCardNumber : {
        type : String,
        require : true
    },
    identityCardDate : {
        type : Date,
        require : true
    },
    identityCardPlace : {
        type : String,
        require : true
    },
    taxCode : {
        type : String,
        require : true
    },
    bankAccountNumber : {
        type : String,
        require : true
    },
    bankName : {
        type : String,
        require : true
    },
    bankAccountName : {
        type : String,
    },
    bankBranch : {
        type : String,
        require : true
    },
    currentBalance : {
        type : Number,
        default : 0
    },
    amountWithdrawn : {
        type : Number,
        default : 0
    },
    isApproved : {
        type : Boolean,
        default : false
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : {
        type : Date,
        default : Date.now
    },
    shopStatus: {
        type: Boolean,
        default: false
    }
})

sellerSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const Seller = mongoose.model<SellerDocument, SellerModel>('sellers', sellerSchema);

export default Seller;