import { Body, Controller, Delete, Get, Path, Post, Put, Query, Request, Route, Security, Tags } from "tsoa";
import { failedResponse, successResponse } from "../../utils/http";
import { default as ProductTypeOfArchitecture, default as TypeOfArchitecture } from "../category/category.model";
import { deleteFolder } from "../gallery/gallery.controller";
import User from "../user/user.model";
import Product from "./food.model";
import { getFreeProducts, getLatestProducts, getMostLikeProducts, getMostQuantityPurchasedProducts, getMostViewProducts, getProductByDesignToolId, getProductByFilter, getProductById } from "./food.queries";
import { IProductEdit, IProductInput } from "./food.types";


@Route("products")
@Tags("Products")
export class ProductController extends Controller {

    @Security("jwt", ["seller"])
    @Post()
    public async createProduct(@Body() data: IProductInput, @Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            //verify token
            const userId = await User.getIdFromToken(token);
            if (!userId) {
                this.setStatus(401);
                return failedResponse('Token is not valid', 'Unauthorized');
            }
            //verify product
            const ProductDTO = {
                title: data.title,
                content: data.content,
                price: data.price,
                size: data.size,
                views: 0,
                likes: 0,
                quantityPurchased: 0,
                userId: userId,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            //verify productTypeOfArchitectures
            for (let i = 0; i < data.productTypeOfArchitecture.length; i++) {
                const typeOfArchitecture = TypeOfArchitecture.find({ _id: data.productTypeOfArchitecture[i] });
                if (!typeOfArchitecture) {
                    this.setStatus(400);
                    return failedResponse('TypeOfArchitectureId is not valid', 'BadRequest');
                }
            }

            //save product
            const product = await new Product(ProductDTO).save();

            //save productTypeOfArchitecture
            for (let i = 0; i < data.productTypeOfArchitecture.length; i++) {
                const productTypeOfArchitecture = {
                    productId: product._id,
                    typeOfArchitectureId: data.productTypeOfArchitecture[i]
                }
                await new ProductTypeOfArchitecture(productTypeOfArchitecture).save();
            }

            return successResponse(product);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }


    /**
     * Get home products
     * Type = 'latest' or 'mostView' or 'mostQuantityPurchased' or 'mostLike' or 'freeProduct'
     * 
     * @param request 
     * @param size 
     * @param offset 
     * @param type 
     * @returns successResponse
     */
    @Get('home')
    public async getHomeProducts(@Request() request: any, @Query() size?: number, @Query() offset?: number, @Query() type?: string): Promise<any> {
        //validate size and offset
        size = size ? size : 10;
        offset = offset ? offset : 0;
        type = type ? type : 'latest';
        try {
            var data;
            switch (type) {
                case 'latest':
                    data = await Product.aggregate(getLatestProducts(size, offset));
                    break;
                case 'mostView':
                    data = await Product.aggregate(getMostViewProducts(size, offset));
                    break;
                case 'mostQuantityPurchased':
                    data = await Product.aggregate(getMostQuantityPurchasedProducts(size, offset));
                    break;
                case 'mostLike':
                    data = await Product.aggregate(getMostLikeProducts(size, offset));
                    break;
                case 'freeProduct':
                    data = await Product.aggregate(getFreeProducts(size, offset));
                    break;
                default:
                    data = await Product.aggregate(getLatestProducts(size, offset));
                    break;
            }
            if (data.length === 0 || data[0].items.length === 0) {
                return successResponse([]);
            }
            const result = data[0];
            return successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    /**
     * Get items by filter designToolId, collectionId, size, offset, name
     * @param request
     * @param id
     * @param size
     * @param offset
     * @param name
     * @param designToolId
     * @param collectionId
     * **/
    @Get('filter')
    public async getProductsByFilter(
        @Request() request: any,
        @Query() size: number,
        @Query() offset: number,
        @Query() name?: string,
        @Query() designToolId?: string,
        @Query() designStyleId?: string,
        @Query() typeOfArchitectureId?: string,
        @Query() authorId?: string,

    ): Promise<any> {
        try {
            //verify params (trim)
            name = name ? name.trim() : null;
            designToolId = designToolId ? designToolId.trim() : null;
            designStyleId = designStyleId ? designStyleId.trim() : null;
            typeOfArchitectureId = typeOfArchitectureId ? typeOfArchitectureId.trim() : null;
            authorId = authorId ? authorId.trim() : null;
            let data = await Product.aggregate(getProductByFilter(name, designToolId, designStyleId, typeOfArchitectureId, size, offset, authorId));
            if (data[0].length > 0) {
                data = data[0]
            }
            return successResponse(data);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }


    @Get("by-id")
    public async getProductById(@Request() request: any, @Query() id: string): Promise<any> {
        try {
            const product = await Product.aggregate(getProductById(id));
            //increase views
            await Product.findByIdAndUpdate(id, { views: product[0].info.views + 0.5 }, { new: true });

            if (!product) {
                this.setStatus(404);
                return failedResponse('Product not found', 'NotFound');
            }

            return successResponse(product[0]);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Security("jwt")
    @Get("my-products")
    public async getProducts(@Request() request: any, @Query() size: number, @Query() offset: number): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userInfo = await User.getUserProfile(token);
            if (!userInfo) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }
            const Products = await Product.find({ userId: userInfo._id }).skip(offset).limit(size);
            return successResponse(Products);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }


    @Get("by-design-tool-id")
    public async getProductsByDesignToolId(@Request() request: any, @Query() designToolId: string, @Query() size: number, @Query() offset: number): Promise<any> {
        try {
            const result = Product.aggregate(getProductByDesignToolId(designToolId, size, offset));
            return successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Security("jwt")
    @Delete("delete-product-by-id")
    public async deleteProductById(@Request() request: any, @Query() productId: string): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const user_id = await User.getIdFromToken(token);
            if (!user_id) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }
            const role = (await User.findById(user_id)).role
            const user_sell = (await Product.findById(productId)).userId
            if (user_id != user_sell && role != "admin") {
                this.setStatus(400)
                return failedResponse("Bạn không có quyền xóa sản phẩm này", "Bad Request")
            }
            await Product.findByIdAndUpdate(productId, { deletedAt: new Date() })
            const folderPath = "product/" + productId + '/file'
            await deleteFolder(folderPath)
            return successResponse("Xóa sản phẩm thành công")


        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Security("jwt", ['seller'])
    @Put("edit-product/{idProduct}")
    public async editProductById(@Request() request: any, @Path() idProduct: string, @Body() data: IProductEdit): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const user_id = await User.getIdFromToken(token);
            if (!user_id) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }
            let product = await Product.findById(idProduct)
            if (user_id != product.userId) {
                this.setStatus(400)
                return failedResponse("Bạn không có quyền chỉnh sửa sản phầm này", "Bad Request")
            }
            // if(product.quantityPurchased > 0 ){ // Sửa được chứ không phải không sửa
            //     this.setStatus(400)
            //     return failedResponse("Sản phẩm đã được bán, bạn không thể chỉnh sửa được","Bad Request")
            // }
            if (data.content) {
                product.content = data.content
            }
            if (data.title) {
                product.title = data.title
            }
            if (data.price) {
                product.price = data.price
            }
            await product.save()
            if (data.productTypeOfArchitecture && data.productTypeOfArchitecture.length > 0) {
                await ProductTypeOfArchitecture.deleteMany({ productId: idProduct })
                for (let i = 0; i < data.productTypeOfArchitecture.length; i++) {
                    const typeOfArchitecture = TypeOfArchitecture.find({ _id: data.productTypeOfArchitecture[i] });
                    if (!typeOfArchitecture) {
                        this.setStatus(400);
                        return failedResponse('TypeOfArchitectureId is not valid', 'BadRequest');
                    }
                }
                for (let i = 0; i < data.productTypeOfArchitecture.length; i++) {
                    const productTypeOfArchitecture = {
                        productId: product._id,
                        typeOfArchitectureId: data.productTypeOfArchitecture[i]
                    }
                    await new ProductTypeOfArchitecture(productTypeOfArchitecture).save();
                }
            }
            let productNew = await Product.aggregate(getProductById(idProduct))
            if (productNew.length > 0) {
                productNew = productNew[0]
            } else {
                this.setStatus(400)
                return failedResponse("Không tìm thấy sản phẩm", "Bad Request")
            }
            return successResponse(productNew)

        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }




}