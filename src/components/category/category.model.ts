import mongoose, { Document, Model} from "mongoose";
import { ITypeOfArchitecture } from "./category.types";

interface TypeOfArchitectureDocument extends ITypeOfArchitecture, Document { };
interface TypeOfArchitectureModel extends Model<TypeOfArchitectureDocument> { };

const typeOfArchitectureSchema = new mongoose.Schema<TypeOfArchitectureDocument, TypeOfArchitectureModel> ( {
    name : {
        type : String,
        require : true
    },
    description : String,
})

typeOfArchitectureSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});


const TypeOfArchitecture = mongoose.model<TypeOfArchitectureDocument, TypeOfArchitectureModel>('TypeOfArchitecture', typeOfArchitectureSchema);

export default TypeOfArchitecture;