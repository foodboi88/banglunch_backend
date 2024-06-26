import multer, { Multer } from 'multer';
import { Controller, FormField, Post, Request, Route, Security, Tags, UploadedFiles } from "tsoa";
import { bucket } from '../../firebase';
import { failedResponse } from "../../utils/http";
import Foods from "../foods/foods.model";
import User from "../users/users.model";
import Gallery from "./gallery.model";
import { IGallery } from './gallery.types';


const storage = multer.memoryStorage();
const upload: Multer = multer({ storage: storage, preservePath: false });

export async function deleteFolder(folderPath: string): Promise<void> {
    const [files] = await bucket.getFiles({
        prefix: folderPath,
    });

    await Promise.all(files.map(async (file) => {
        await file.delete();
    }));
}


@Route("gallery")
@Tags("Gallery")
export class GalleryController extends Controller {

    @Security("jwt")
    @Post("create-food-image")
    public async createImage(@FormField() foodId: string,
        @UploadedFiles() files: File[],
        @Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userInfo = await User.getIdFromToken(token);
            if (!userInfo) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }

            // check xem người đang muốn up file có phải chủ nhân món ăn không
            const item = await Foods.findById(foodId)
            if (item.sellerId != userInfo) {
                this.setStatus(400)
                return failedResponse("Bạn không có quyền", "Bad Request")
            }

            // Lưu
            const image_thum: any = files[0];
            const image_thumName = image_thum.originalname;
            const Ref_image_thum = 'product/' + foodId + '/image_thum/' + image_thumName;
            const uploadStream_image_thum = bucket.file(Ref_image_thum).createWriteStream({
                metadata: {
                    contentType: image_thum.mimetype
                }
            });
            await new Promise((resolve, reject) => {
                uploadStream_image_thum.on('finish', resolve);
                uploadStream_image_thum.on('error', reject);
                uploadStream_image_thum.end(image_thum.buffer);
            });

            const folderPath_thum = 'product/' + foodId + "/image_thum"; // Đường dẫn đến folder chứa ảnh

            const options_1: any = { prefix: folderPath_thum };
            const [files_out_1]: any = await bucket.getFiles(options_1);

            // Lấy public URL cho mỗi ảnh và trả về như một mảng JSON
            const result_1 = [];
            for (const file of files_out_1) {
                const [url] = await file.getSignedUrl({ action: 'read', expires: '03-17-2900' });
                result_1.push(url);
            }

            const ProductImageDTO_1: IGallery = {
                fileName: "",
                filePath: result_1[0],
                isMain: true,
                foodId: foodId,
            }
            await new Gallery(ProductImageDTO_1).save();

            // } else if (isMain_in.toLowerCase() === 'false') {
            const image_detail: any = files.slice(1);
            const promises_1 = image_detail.map(async (images: any) => {
                const image_detail = images
                const image_detailName = image_detail.originalname;
                const Ref_image_detail = 'product/' + foodId + '/image_detail/' + image_detailName;
                const uploadStream_image_detail = bucket.file(Ref_image_detail).createWriteStream({
                    metadata: {
                        contentType: image_detail.mimetype
                    }
                });
                await new Promise((resolve, reject) => {
                    uploadStream_image_detail.on('finish', resolve);
                    uploadStream_image_detail.on('error', reject);
                    uploadStream_image_detail.end(image_detail.buffer);
                });
            });
            await Promise.all(promises_1);
            // }

            const folderPath = 'product/' + foodId + "/image_detail"; // Đường dẫn đến folder chứa ảnh

            const options: any = { prefix: folderPath };
            const [files_out]: any = await bucket.getFiles(options);

            // Lấy public URL cho mỗi ảnh và trả về như một mảng JSON
            const result = [];
            for (const file of files_out) {
                const [url] = await file.getSignedUrl({ action: 'read', expires: '03-17-2900' });
                result.push(url);
            }

            for (const rs of result) {
                const ProductImageDTO: IGallery = {
                    fileName: "",
                    filePath: rs,
                    isMain: false,
                    foodId: foodId,
                }
                await new Gallery(ProductImageDTO).save();
            }


            return { foodId: foodId, link_image_thum: result_1, link_image_detail: result };

        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    // @Get()
    // public async getProductImages(@Query() size: number, @Query() offset: number, @Request() request: any): Promise<any> {
    //     try {
    //         const ProductImages = await ProductImage.find().skip(offset).limit(size);
    //         return successResponse(ProductImages);
    //     }
    //     catch (err) {
    //         this.setStatus(500);
    //         return failedResponse('Execute service went wrong', 'ServiceException');
    //     }
    // }

    // @Security('jwt')
    // @Post("one-image")
    // public async createOneImage(@FormField() productId_in: string,
    //     @UploadedFile() file: File,
    //     @Request() request: any): Promise<any> {
    //     try {
    //         const token = request.headers.authorization.split(' ')[1];
    //         const userInfo = await User.getIdFromToken(token);
    //         if (!userInfo) {
    //             this.setStatus(401);
    //             return failedResponse('Unauthorized', 'Unauthorized');
    //         }

    //         // check product 
    //         const item = await Product.findById(productId_in)
    //         if(item.sellerId != userInfo){
    //             return "not have access";
    //         }

    //         const file_in: any = file
    //         const fileName = file_in.originalname;
    //         const Ref = 'product/' + productId_in + '/one-image/' + fileName;

    //         const uploadStream_file = bucket.file(Ref).createWriteStream({
    //             metadata: {
    //                 contentType: file_in.mimetype
    //             }
    //         });
    //         await new Promise((resolve, reject) => {
    //             uploadStream_file.on('finish', resolve);
    //             uploadStream_file.on('error', reject);
    //             uploadStream_file.end(file_in.buffer);

    //         });

    //         //Lấy file ra
    //         const folderPath = 'product/' + productId_in + "/one-image" ; // Đường dẫn đến folder chứa file
    //         const options: any = { prefix: folderPath };
    //         const [files_out]: any = await bucket.getFiles(options);

    //         // Lấy public URL cho mỗi ảnh và trả về như một mảng JSON
    //         const result = [];
    //         for (const file of files_out) {
    //             const [url] = await file.getSignedUrl({ action: 'read', expires: '03-17-2900' });
    //             result.push(url);
    //         }

    //         const ProductImageDTO = {
    //             fileName: "",
    //             filePath: result[0],
    //             isMain: true,
    //             productId: productId_in,
    //             createdAt: new Date(),
    //             updatedAt: new Date()
    //         }
    //         await new ProductImage(ProductImageDTO).save();

    //         return "Upload Image Success !"

    //     } catch (err) {
    //         this.setStatus(500);
    //         return failedResponse('Execute service went wrong', 'ServiceException');
    //     }

    // }
}