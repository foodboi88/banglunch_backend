import mongoose, { Model, Document } from 'mongoose';
import { IFoodCategory } from './food-categories.types';

interface FoodCategoryDocument extends IFoodCategory, Document { };
interface FoodCategoryModel extends Model<FoodCategoryDocument> { };

const foodCategorySchema = new mongoose.Schema<FoodCategoryDocument, FoodCategoryModel>({
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foods'
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
    }
});


foodCategorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});


const FoodCategory = mongoose.model<FoodCategoryDocument, FoodCategoryModel>('food_categories', foodCategorySchema);

export default FoodCategory;