import { Request, Response } from 'express';

export type BaseResponseType<D> = SuccessResponseType<D> | FailedResponseType<string | string[]>;

export interface IBaseResponse{
    statusCode: string
}

export interface SuccessResponseType<D> extends IBaseResponse {
    data: D
}

export interface FailedResponseType<E> extends IBaseResponse {
    message: E
}

export function instanceOfFailedResponseType<T>(object: any): object is FailedResponseType<T>{
    return object.statusCode !== undefined
}

export interface IListResponse<Data> {
    items: Data
    total: number
}

export const successResponse = <D>(data: D): SuccessResponseType<D> => {
    return { data, statusCode: 'OK' }
};

export const failedResponse = <E>(message: E, statusCode: string): FailedResponseType<E> => {
    return { message, statusCode }
};

export interface CustomRequest<Params = any, Body = any, Query = any> extends Request<Params, any, Body, Query> {}
export interface CustomResponse<R> extends Response<BaseResponseType<R>> {}
