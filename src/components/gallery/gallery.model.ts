import mongoose, { Document, Model } from "mongoose";
import { IGallery } from "./gallery.types";

interface GalleryDocument extends IGallery, Document { };
interface GalleryModel extends Model<GalleryDocument> { };

const gallerySchema = new mongoose.Schema<GalleryDocument, GalleryModel>({
    fileName: {
        type: String,
        require: true
    },
    filePath: {
        type: String,
        require: true
    },
    isMain: {
        type: Boolean,
        require: true
    },
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foods'
    }
})

gallerySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});

const Gallery = mongoose.model<GalleryDocument, GalleryModel>('ProductImage', gallerySchema);

export default Gallery; 