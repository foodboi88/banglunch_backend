import { Controller, Route, Tags, Post, Body, Get, Request, Security, Put, Query, Path, Delete } from "tsoa";
import { successResponse, failedResponse } from "../../utils/http";
import { ICategory } from "./categories.types";
import Category from "./categories.model";

@Route("categories")
@Tags("Categories")
export class CategoriesController extends Controller {
    @Post()
    public async createCategory(@Body() data: ICategory): Promise<any> {
        try {
            const result = await new Category(data).save();
            return successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse(`Error: ${err}`, 'ServiceException');
        }
    }

    @Get()
    public async getCategories(): Promise<any> {
        try {
            const result = await Category.find();
            return successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse(`Error: ${err}`, 'ServiceException');
        }
    }
}