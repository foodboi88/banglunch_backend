import { Body, Controller, Delete, Get, Path, Post, Put, Query, Request, Route, Security, Tags } from "tsoa";
import { failedResponse, successResponse } from "../../utils/http";
import  Category  from "../categories/categories.model";
import FoodCategory from "../food-categories/food-categories.model";
import { deleteFolder } from "../gallery/gallery.controller";
import User from "../users/users.model";
import {getLatestProducts, getMostLikeProducts, getMostQuantityPurchasedProducts, getMostViewProducts, getProductByFilter, getProductById } from "./foods.queries";
import { IFoodEdit, IFoodInput } from "./foods.types";
import Food from "./foods.model";
const crypto = require('crypto');


@Route("foods")
@Tags("Foods")
export class ProductController extends Controller {

    @Security("jwt", ["seller"])
    @Post()
    public async createFood(@Body() data: IFoodInput, @Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            //verify token
            const userId = await User.getIdFromToken(token);
            if (!userId) {
                this.setStatus(401);
                return failedResponse('Token is not valid', 'Unauthorized');
            }
            //verify food
            const FoodDTO = {
                constantId: crypto.randomUUID(),
                title: data.title,
                content: data.content,
                price: data.price,
                views: 0,
                sellerId: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: new Date(),
            }

            //verify category
            for (let i = 0; i < data.category.length; i++) {
                const category = Category.find({ _id: data.category[i] });
                if (!category) {
                    this.setStatus(400);
                    return failedResponse('Category is not valid', 'BadRequest');
                }
            }

            //save food
            const food = await new Food(FoodDTO).save();

            for (let i = 0; i < data.category.length; i++) {
                const foodCategory = {
                    foodId: food._id,
                    categoryId: data.category[i]
                }
                await new FoodCategory(foodCategory).save();
            }

            return successResponse(food);
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
    public async getHomeProducts(@Query() size?: number, @Query() offset?: number, @Query() type?: string): Promise<any> {
        //validate size and offset
        size = size ? size : 10;
        offset = offset ? offset : 0;
        type = type ? type : 'latest';
        try {
            var data;
            switch (type) {
                case 'latest':
                    data = await Food.aggregate(getLatestProducts(size, offset));
                    break;
                case 'mostView':
                    data = await Food.aggregate(getMostViewProducts(size, offset));
                    break;
                case 'mostQuantityPurchased':
                    data = await Food.aggregate(getMostQuantityPurchasedProducts(size, offset));
                    break;
                case 'mostLike':
                    data = await Food.aggregate(getMostLikeProducts(size, offset));
                    break;
                default:
                    data = await Food.aggregate(getLatestProducts(size, offset));
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
     * @param id
     * @param size
     * @param offset
     * @param name
     * @param designToolId
     * @param collectionId
     * **/
    @Get('filter')
    public async getProductsByFilter(
        @Query() size: number,
        @Query() offset: number,
        @Query() name?: string,
        @Query() categoryId?: string,
        @Query() sellerId?: string,

    ): Promise<any> {
        try {
            //verify params (trim)
            name = name ? name.trim() : null;
            categoryId = categoryId ? categoryId.trim() : null;
            sellerId = sellerId ? sellerId.trim() : null;
            let data = await Food.aggregate(getProductByFilter(name, categoryId, size, offset, sellerId));
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
            const product = await Food.aggregate(getProductById(id));
            //increase views
            await Food.findByIdAndUpdate(id, { views: product[0].info.views + 0.5 }, { new: true });

            if (!product) {
                this.setStatus(404);
                return failedResponse('Food not found', 'NotFound');
            }

            return successResponse(product[0]);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Security("jwt")
    @Get("my-shop")
    public async getProducts(@Request() request: any, @Query() size: number, @Query() offset: number): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userInfo = await User.getUserProfile(token);
            if (!userInfo) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }
            const Products = await Food.find({ userId: userInfo._id }).skip(offset).limit(size);
            return successResponse(Products);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Security("jwt")
    @Delete("delete-food-by-id")
    public async deleteProductById(@Request() request: any, @Query() productId: string): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const user_id = await User.getIdFromToken(token);
            if (!user_id) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }
            const role = (await User.findById(user_id)).role
            const user_sell = (await Food.findById(productId)).sellerId
            if (user_id != user_sell && role != "admin") {
                this.setStatus(400)
                return failedResponse("Bạn không có quyền xóa sản phẩm này", "Bad Request")
            }
            await Food.findByIdAndUpdate(productId, { deletedAt: new Date() })
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
    public async editProductById(@Request() request: any, @Path() idProduct: string, @Body() data: IFoodEdit): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const user_id = await User.getIdFromToken(token);
            if (!user_id) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }
            let product = await Food.findById(idProduct)
            if (user_id != product.sellerId) {
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
            if (data.category && data.category.length > 0) {
                await FoodCategory.deleteMany({ productId: idProduct })
                for (let i = 0; i < data.category.length; i++) {
                    const typeOfArchitecture = Category.find({ _id: data.category[i] });
                    if (!typeOfArchitecture) {
                        this.setStatus(400);
                        return failedResponse('TypeOfArchitectureId is not valid', 'BadRequest');
                    }
                }
                for (let i = 0; i < data.category.length; i++) {
                    const productTypeOfArchitecture = {
                        productId: product._id,
                        typeOfArchitectureId: data.category[i]
                    }
                    await new FoodCategory(productTypeOfArchitecture).save();
                }
            }
            let productNew = await Food.aggregate(getProductById(idProduct))
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