import mongoose, { Document, Model } from "mongoose";
import { IFood } from "./foods.types";

interface FoodDocument extends IFood, Document { };
interface FoodModel extends Model<FoodDocument> { };

const FoodSchema = new mongoose.Schema<FoodDocument, FoodModel>({
    foodId: { // To determine version of record
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
    views: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: Date,
    deletedAt: {
        type: Date,
        default: null,
    },
    updateAt: {
        type: Date,
        default: null
    }
})

FoodSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});

const Food = mongoose.model<FoodDocument, FoodModel>('Foods', FoodSchema);

export default Food;
