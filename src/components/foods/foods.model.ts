import mongoose, { Document, Model } from "mongoose";
import { IFood } from "./foods.types";

interface FoodDocument extends IFood, Document { };
interface FoodModel extends Model<FoodDocument> { };

const FoodSchema = new mongoose.Schema<FoodDocument, FoodModel>({
    constantId: { // To determine version of record
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
    weight: { // Gram
        type: Number,
        default: 0,
    },
    length: {
        type: Number,
        default: 0
    },
    width: {
        type: Number,
        default: 0,
    },
    height: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    createdAt: Date,
    deletedAt: {
        type: Date,
        default: null,
    },
    updatedAt: {
        type: Date,
        default: null
    },
    summarizedComments: String
})

FoodSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});

const Foods = mongoose.model<FoodDocument, FoodModel>('foods', FoodSchema);

export default Foods;
