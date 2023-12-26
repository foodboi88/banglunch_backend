import { Body, Controller, Get, Post, Route, Tags } from "tsoa";
import { failedResponse, successResponse } from "../../utils/http";
import Category from "./categories.model";
import { ICategory } from "./categories.types";

@Route("categories")
@Tags("Categories")
export class CategoriesController extends Controller {

    @Get('get-all')
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

    @Post('create')
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
}