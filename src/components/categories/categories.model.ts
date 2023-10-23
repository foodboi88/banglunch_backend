import mongoose, { Document, Model} from "mongoose";
import { ICategory } from "./categories.types";

interface CategoryDocument extends ICategory, Document { };
interface CategoryModel extends Model<CategoryDocument> { };

const categorySchema = new mongoose.Schema<CategoryDocument, CategoryModel> ( {
    name : {
        type : String,
        require : true
    },
    description : String,
})

categorySchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});


const Category = mongoose.model<CategoryDocument, CategoryModel>('categories', categorySchema);

export default Category;