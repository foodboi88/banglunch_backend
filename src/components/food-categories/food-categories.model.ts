import mongoose, { Model, Document } from 'mongoose';
import { IFoodCategory } from './food-categories.types';

interface FoodCategoryDocument extends IFoodCategory, Document { };
interface FoodCategoryModel extends Model<FoodCategoryDocument> { };

const foodCategorySchema = new mongoose.Schema<FoodCategoryDocument, FoodCategoryModel>({
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Foods'
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    }
});


foodCategorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});


const FoodCategory = mongoose.model<FoodCategoryDocument, FoodCategoryModel>('Food_Categories', foodCategorySchema);

export default FoodCategory;