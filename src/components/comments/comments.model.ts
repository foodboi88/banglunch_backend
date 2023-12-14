import mongoose, { Document, Model} from "mongoose";
import { IComment } from "./comments.types";

interface CommentsDocument extends IComment, Document { };
interface CommentsModel extends Model<CommentsDocument> { };

const CommentsModelSchema = new mongoose.Schema<CommentsDocument, CommentsModel> ( {
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    foodId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'foods'
    },
    rate: Number,
    description: String,
    createdAt: Date
})

CommentsModelSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const Comments = mongoose.model<CommentsDocument, CommentsModel>('comments', CommentsModelSchema);

export default Comments;
