import { Body, Controller, Delete, Get, Path, Post, Put, Query, Request, Route, Security, Tags } from "tsoa";
import { failedResponse, successResponse } from "../../utils/http";
import Category from "../categories/categories.model";
import FoodCategory from "../food-categories/food-categories.model";
import { deleteFolder } from "../gallery/gallery.controller";
import Sellers from "../sellers/sellers.model";
import Users, { default as User } from "../users/users.model";
import { default as Food, default as Foods } from "./foods.model";
import { getAllFood, getDetailFoodById, getFoodsByFilterWithCategoryId, getFoodsByFilterWithoutCategoryId, getFoodsByShop } from "./foods.queries";
import { IFood, IFoodEdit, IFoodInput } from "./foods.types";
const crypto = require('crypto');


@Route("foods")
@Tags("Foods")
export class ProductController extends Controller {
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
    public async getHomeFoods(@Query() size?: number, @Query() offset?: number, @Query() type?: string): Promise<any> {
        //validate size and offset
        size = size ? size : 10;
        offset = offset ? offset : 0;
        type = type ? type : 'latest';
        try {
            const result = await Foods.aggregate(getAllFood())
            return successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Get('advanced-filter')
    public async advancedFilterFoods(@Query() name?: string, @Query() categoryId?: string): Promise<any> {
        try {
            if (categoryId) {
                const result = await Foods.aggregate(getFoodsByFilterWithCategoryId(name || '', categoryId))
                return successResponse(result);
            } else {
                const result = await Foods.aggregate(getFoodsByFilterWithoutCategoryId(name || ''))
                return successResponse(result);
            }
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Get("get-detail-food")
    public async getDetailFood(@Request() request: any, @Query() foodId: string): Promise<any> {
        try {

            const product = await Foods.aggregate(getDetailFoodById(foodId));
            //increase views
            // await Foods.findByIdAndUpdate(foodId, { views: product[0].views + 1 }, { new: true });

            if (!product) {
                this.setStatus(404);
                return failedResponse('Food not found', 'NotFound');
            }

            return successResponse(product[0]);
        }
        catch (err) {
            this.setStatus(500);
            console.log(err);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    /**
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
    */
    @Get("get-foods-by-shop")
    public async getFoodsByShop(@Request() request: any, @Query() shopId: string): Promise<any> {
        try {
            const foodsBySeller = await Foods.aggregate(getFoodsByShop(shopId))
            const shopInfo = await Sellers.findOne({ userId: shopId });
            const sellerInfo = await Users.findById(shopId)
            return successResponse({
                foods: foodsBySeller,
                info: { address: shopInfo.fromDetailAddress, name: sellerInfo.name, phone: sellerInfo.phone }
            });
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Security("jwt", ["seller"])
    @Post('create-food')
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
            const FoodDTO: IFood = {
                constantId: crypto.randomUUID(),
                title: data.title,
                content: data.content,
                price: data.price,
                views: 0,
                sellerId: userId,
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: null,
                summarizedCommentOneStar: null,
                summarizedCommentTwoStar: null,
                summarizedCommentThreeStar: null,
                summarizedCommentFourStar: null,
                summarizedCommentFiveStar: null,
                summarizedCommentSixStar: null,
                summarizedCommentSevenStar: null,
                summarizedCommentEightStar: null,
                summarizedCommentNineStar: null,
                summarizedCommentTenStar: null,
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

    @Security("jwt", ['seller'])
    @Put("edit-food/{foodId}")
    public async editProductById(@Request() request: any, @Path() foodId: string, @Body() data: IFoodEdit): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const user_id = await User.getIdFromToken(token);
            if (!user_id) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }
            let food = await Food.findById(foodId)
            if (user_id != food.sellerId) {
                this.setStatus(400)
                return failedResponse("Bạn không có quyền chỉnh sửa sản phầm này", "Bad Request")
            }
            if (data.content) {
                food.content = data.content
            }
            if (data.title) {
                food.title = data.title
            }
            if (data.price) {
                food.price = data.price
            }
            food.updatedAt = new Date()
            await food.save()

            if (data.category && data.category.length > 0) {
                await FoodCategory.deleteMany({ foodId: foodId })
                // Check xem trong array category có cái nào không tồn tại trong database không
                for (let i = 0; i < data.category.length; i++) {
                    const category = Category.find({ _id: data.category[i] });
                    if (!category) {
                        this.setStatus(400);
                        return failedResponse('Category is not existed', 'BadRequest');
                    }
                }
                for (let i = 0; i < data.category.length; i++) {
                    const foodCategory = {
                        foodId: food._id,
                        categoryId: data.category[i]
                    }
                    await new FoodCategory(foodCategory).save();
                }
            }
            return successResponse(food)
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Security("jwt")
    @Delete("delete-by-id")
    public async deleteProductById(@Request() request: any, @Query() foodId: string): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const user_id = await User.getIdFromToken(token);
            if (!user_id) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }
            const role = (await User.findById(user_id)).role
            const foodById = await Food.findById(foodId)
            const user_sell = foodById.sellerId
            if (user_id !== user_sell && role !== "seller") {
                this.setStatus(400)
                return failedResponse("Bạn không có quyền xóa sản phẩm này", "Bad Request")
            }
            await Food.findByIdAndUpdate(foodId, { deletedAt: new Date() })
            const folderPath = "product/" + foodId + '/file'
            await deleteFolder(folderPath)
            return successResponse(foodById);


        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }
}