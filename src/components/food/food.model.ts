import mongoose, { Document, Model } from "mongoose";
import { IFood } from "./food.types";

interface FoodDocument extends IFood, Document { };
interface FoodModel extends Model<FoodDocument> { };

const FoodSchema = new mongoose.Schema<FoodDocument, FoodModel>({
    constant_id: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    originalPrice: {
        type: Number,
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isDisable: {
        type: Boolean,
        default: false
    },
    totalRate: {
        type: Number,
        default: 0
    },
    createdAt: Date,
    deletedAt: {
        type: Date,
        default: null,
    }
})

FoodSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});

const Food = mongoose.model<FoodDocument, FoodModel>('Food', FoodSchema);

export default Food;
