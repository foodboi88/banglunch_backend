import { Controller, Route, Tags, Post, Body, Get, Request, Security, Put, Query, Path, Delete } from "tsoa";
import { successResponse, failedResponse } from "../../utils/http";
import { ITypeOfArchitecture } from "./category.types";
import TypeOfArchitecture from "./category.model";

@Route("type-of-architectures")
@Tags("TypeOfArchitectures")
export class TypeOfArchitectureController extends Controller {
    @Post()
    public async createTypeOfArchitecture(@Body() data: ITypeOfArchitecture): Promise<any> {
        try {
            const result = await new TypeOfArchitecture(data).save();
            return successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse(`Error: ${err}`, 'ServiceException');
        }
    }

    @Get()
    public async getAllTypeOfArchitectures(): Promise<any> {
        try {
            const result = await TypeOfArchitecture.find();
            return successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse(`Error: ${err}`, 'ServiceException');
        }
    }
}