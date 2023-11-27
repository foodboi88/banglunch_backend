import { Controller, Route, Tags, Post, Body, Get, Request, Security, Put, Query, Path, Delete, UploadedFiles, UploadedFile, FormField, Example } from "tsoa";
import Comments from "./comments.model";
import { successResponse, failedResponse } from "src/utils/http";

@Route("comments")
@Tags("Comments")
export class CommentsController extends Controller {
    /**
     * @returns {Promise<any>} 200 - Return message and status
     * @returns {Promise<any>} 400 - Return error message
     */
    @Get("get-comments-by-food")
    public async getCommentsByFood(@Request() request: any, @Query() foodId: string): Promise<any> {
        try {
            const commentByFood = await Comments.find({ foodId: foodId })
            return successResponse(commentByFood);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }
}
