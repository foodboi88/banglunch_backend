/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse, fetchMiddlewares } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './components/users/users.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OrderController } from './components/orders/orders.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GalleryController } from './components/gallery/gallery.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ProductController } from './components/foods/foods.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SellerController } from './components/sellers/sellers.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OrderDetailsController } from './components/order-details/order-details.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DeliveryController } from './components/delivery/delivery.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CommentsController } from './components/comments/comments.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CategoriesController } from './components/categories/categories.controller';
import { expressAuthentication } from './middleware/auth';
// @ts-ignore - no great way to install types from subpackage
const promiseAny = require('promise.any');
import type { RequestHandler } from 'express';
import * as express from 'express';
const multer = require('multer');
const upload = multer();

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "IUserRegister": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "confirmPassword": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "phone": {"dataType":"string","required":true},
            "address": {"dataType":"string","required":true},
            "dob": {"dataType":"datetime","required":true},
            "gender": {"dataType":"boolean","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ISellerRegister": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "confirmPassword": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "phone": {"dataType":"string","required":true},
            "address": {"dataType":"string","required":true},
            "dob": {"dataType":"datetime","required":true},
            "gender": {"dataType":"boolean","required":true},
            "identityId": {"dataType":"string","required":true},
            "personalTaxCode": {"dataType":"string","required":true},
            "fromDetailAddress": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserLogin": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "remember": {"dataType":"boolean","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IRefreshTokenReq": {
        "dataType": "refObject",
        "properties": {
            "refreshToken": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUpdateFoodInCartBodyrequest": {
        "dataType": "refObject",
        "properties": {
            "foodId": {"dataType":"string","required":true},
            "sellerId": {"dataType":"string","required":true},
            "quantity": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IApproveOrder": {
        "dataType": "refObject",
        "properties": {
            "orderId": {"dataType":"string","required":true},
            "status": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IFoodInput": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string","required":true},
            "content": {"dataType":"string","required":true},
            "price": {"dataType":"double","required":true},
            "category": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IFoodEdit": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string"},
            "content": {"dataType":"string"},
            "price": {"dataType":"double"},
            "category": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IShopStatusUpdate": {
        "dataType": "refObject",
        "properties": {
            "shopStatus": {"dataType":"boolean","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICaculateShippingCostInput": {
        "dataType": "refObject",
        "properties": {
            "service_type_id": {"dataType":"double","required":true},
            "insurance_value": {"dataType":"double","required":true},
            "coupon": {"dataType":"string","required":true},
            "from_district_id": {"dataType":"double","required":true},
            "to_district_id": {"dataType":"double","required":true},
            "to_ward_code": {"dataType":"string","required":true},
            "items": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICreateShippingOrder": {
        "dataType": "refObject",
        "properties": {
            "fromWardCode": {"dataType":"string","required":true},
            "toWardCode": {"dataType":"string","required":true},
            "toDistrictId": {"dataType":"double","required":true},
            "items": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IAddComment": {
        "dataType": "refObject",
        "properties": {
            "foodId": {"dataType":"string","required":true},
            "rate": {"dataType":"double","required":true},
            "description": {"dataType":"string","required":true},
            "orderDetailId": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICategory": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.get('/users/profile',
            authenticateMiddleware([{"jwt":["user"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getProfile)),

            function UserController_getProfile(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserController();


              const promise = controller.getProfile.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/users/register',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.register)),

            function UserController_register(request: any, response: any, next: any) {
            const args = {
                    input: {"in":"body","name":"input","required":true,"ref":"IUserRegister"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserController();


              const promise = controller.register.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/users/register-seller',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.registerSeller)),

            function UserController_registerSeller(request: any, response: any, next: any) {
            const args = {
                    input: {"in":"body","name":"input","required":true,"ref":"ISellerRegister"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserController();


              const promise = controller.registerSeller.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/users/login',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.login)),

            function UserController_login(request: any, response: any, next: any) {
            const args = {
                    data: {"in":"body","name":"data","required":true,"ref":"IUserLogin"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserController();


              const promise = controller.login.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/users/refresh-token',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.refreshToken)),

            function UserController_refreshToken(request: any, response: any, next: any) {
            const args = {
                    data: {"in":"body","name":"data","required":true,"ref":"IRefreshTokenReq"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UserController();


              const promise = controller.refreshToken.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/orders/cart-by-user',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrderController)),
            ...(fetchMiddlewares<RequestHandler>(OrderController.prototype.getCartByUser)),

            function OrderController_getCartByUser(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OrderController();


              const promise = controller.getCartByUser.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/orders/orders-by-seller',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrderController)),
            ...(fetchMiddlewares<RequestHandler>(OrderController.prototype.getOrdersBySeller)),

            function OrderController_getOrdersBySeller(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OrderController();


              const promise = controller.getOrdersBySeller.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/orders/orders-by-user',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrderController)),
            ...(fetchMiddlewares<RequestHandler>(OrderController.prototype.getOrdersByUser)),

            function OrderController_getOrdersByUser(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OrderController();


              const promise = controller.getOrdersByUser.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/orders/update-food-in-cart',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrderController)),
            ...(fetchMiddlewares<RequestHandler>(OrderController.prototype.updateCart)),

            function OrderController_updateCart(request: any, response: any, next: any) {
            const args = {
                    input: {"in":"body","name":"input","required":true,"ref":"IUpdateFoodInCartBodyrequest"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OrderController();


              const promise = controller.updateCart.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/orders/create-order',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrderController)),
            ...(fetchMiddlewares<RequestHandler>(OrderController.prototype.createOrder)),

            function OrderController_createOrder(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OrderController();


              const promise = controller.createOrder.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/orders/approve-order',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrderController)),
            ...(fetchMiddlewares<RequestHandler>(OrderController.prototype.approveOrder)),

            function OrderController_approveOrder(request: any, response: any, next: any) {
            const args = {
                    input: {"in":"body","name":"input","required":true,"ref":"IApproveOrder"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OrderController();


              const promise = controller.approveOrder.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/gallery/create-food-image',
            authenticateMiddleware([{"jwt":[]}]),
            upload.array('files'),
            ...(fetchMiddlewares<RequestHandler>(GalleryController)),
            ...(fetchMiddlewares<RequestHandler>(GalleryController.prototype.createImage)),

            function GalleryController_createImage(request: any, response: any, next: any) {
            const args = {
                    foodId: {"in":"formData","name":"foodId","required":true,"dataType":"string"},
                    files: {"in":"formData","name":"files","required":true,"dataType":"array","array":{"dataType":"file"}},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new GalleryController();


              const promise = controller.createImage.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/foods/home',
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.getHomeFoods)),

            function ProductController_getHomeFoods(request: any, response: any, next: any) {
            const args = {
                    size: {"in":"query","name":"size","dataType":"double"},
                    offset: {"in":"query","name":"offset","dataType":"double"},
                    type: {"in":"query","name":"type","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ProductController();


              const promise = controller.getHomeFoods.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/foods/advanced-filter',
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.advancedFilterFoods)),

            function ProductController_advancedFilterFoods(request: any, response: any, next: any) {
            const args = {
                    name: {"in":"query","name":"name","dataType":"string"},
                    categoryId: {"in":"query","name":"categoryId","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ProductController();


              const promise = controller.advancedFilterFoods.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/foods/get-detail-food',
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.getDetailFood)),

            function ProductController_getDetailFood(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    foodId: {"in":"query","name":"foodId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ProductController();


              const promise = controller.getDetailFood.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/foods/get-foods-by-shop',
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.getFoodsByShop)),

            function ProductController_getFoodsByShop(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    shopId: {"in":"query","name":"shopId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ProductController();


              const promise = controller.getFoodsByShop.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/foods/create-food',
            authenticateMiddleware([{"jwt":["seller"]}]),
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.createFood)),

            function ProductController_createFood(request: any, response: any, next: any) {
            const args = {
                    data: {"in":"body","name":"data","required":true,"ref":"IFoodInput"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ProductController();


              const promise = controller.createFood.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/foods/edit-food/:foodId',
            authenticateMiddleware([{"jwt":["seller"]}]),
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.editProductById)),

            function ProductController_editProductById(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    foodId: {"in":"path","name":"foodId","required":true,"dataType":"string"},
                    data: {"in":"body","name":"data","required":true,"ref":"IFoodEdit"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ProductController();


              const promise = controller.editProductById.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/foods/delete-by-id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ProductController)),
            ...(fetchMiddlewares<RequestHandler>(ProductController.prototype.deleteProductById)),

            function ProductController_deleteProductById(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    foodId: {"in":"query","name":"foodId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ProductController();


              const promise = controller.deleteProductById.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/sellers/shop-status',
            authenticateMiddleware([{"jwt":["seller"]}]),
            ...(fetchMiddlewares<RequestHandler>(SellerController)),
            ...(fetchMiddlewares<RequestHandler>(SellerController.prototype.getShopStatus)),

            function SellerController_getShopStatus(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SellerController();


              const promise = controller.getShopStatus.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/sellers/shop-status',
            authenticateMiddleware([{"jwt":["seller"]}]),
            ...(fetchMiddlewares<RequestHandler>(SellerController)),
            ...(fetchMiddlewares<RequestHandler>(SellerController.prototype.updateShopStatus)),

            function SellerController_updateShopStatus(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"ref":"IShopStatusUpdate"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SellerController();


              const promise = controller.updateShopStatus.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/delivery/caculate-shipping-cost',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(DeliveryController)),
            ...(fetchMiddlewares<RequestHandler>(DeliveryController.prototype.caculateShippingCost)),

            function DeliveryController_caculateShippingCost(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    input: {"in":"body","name":"input","required":true,"ref":"ICaculateShippingCostInput"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DeliveryController();


              const promise = controller.caculateShippingCost.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/delivery/create-shipping-order',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(DeliveryController)),
            ...(fetchMiddlewares<RequestHandler>(DeliveryController.prototype.createShippingOrder)),

            function DeliveryController_createShippingOrder(request: any, response: any, next: any) {
            const args = {
                    input: {"in":"body","name":"input","required":true,"ref":"ICreateShippingOrder"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DeliveryController();


              const promise = controller.createShippingOrder.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/delivery/get-province',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(DeliveryController)),
            ...(fetchMiddlewares<RequestHandler>(DeliveryController.prototype.getProvince)),

            function DeliveryController_getProvince(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DeliveryController();


              const promise = controller.getProvince.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/delivery/get-district-by-province',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(DeliveryController)),
            ...(fetchMiddlewares<RequestHandler>(DeliveryController.prototype.getDistrictsByProvince)),

            function DeliveryController_getDistrictsByProvince(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DeliveryController();


              const promise = controller.getDistrictsByProvince.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/delivery/get-ward-by-district',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(DeliveryController)),
            ...(fetchMiddlewares<RequestHandler>(DeliveryController.prototype.getWardsByDistrict)),

            function DeliveryController_getWardsByDistrict(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DeliveryController();


              const promise = controller.getWardsByDistrict.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/comments/summarize',
            ...(fetchMiddlewares<RequestHandler>(CommentsController)),
            ...(fetchMiddlewares<RequestHandler>(CommentsController.prototype.summarizeComments)),

            function CommentsController_summarizeComments(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CommentsController();


              const promise = controller.summarizeComments.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/comments/get-comments-by-food',
            ...(fetchMiddlewares<RequestHandler>(CommentsController)),
            ...(fetchMiddlewares<RequestHandler>(CommentsController.prototype.getCommentsByFood)),

            function CommentsController_getCommentsByFood(request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    foodId: {"in":"query","name":"foodId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CommentsController();


              const promise = controller.getCommentsByFood.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/comments/create-comment',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CommentsController)),
            ...(fetchMiddlewares<RequestHandler>(CommentsController.prototype.createComment)),

            function CommentsController_createComment(request: any, response: any, next: any) {
            const args = {
                    data: {"in":"body","name":"data","required":true,"ref":"IAddComment"},
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CommentsController();


              const promise = controller.createComment.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/categories/get-all',
            ...(fetchMiddlewares<RequestHandler>(CategoriesController)),
            ...(fetchMiddlewares<RequestHandler>(CategoriesController.prototype.getCategories)),

            function CategoriesController_getCategories(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CategoriesController();


              const promise = controller.getCategories.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/categories/create',
            ...(fetchMiddlewares<RequestHandler>(CategoriesController)),
            ...(fetchMiddlewares<RequestHandler>(CategoriesController.prototype.createCategory)),

            function CategoriesController_createCategory(request: any, response: any, next: any) {
            const args = {
                    data: {"in":"body","name":"data","required":true,"ref":"ICategory"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CategoriesController();


              const promise = controller.createCategory.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, _response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await promiseAny(secMethodOrPromises);
                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, successStatus: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode = successStatus;
                let headers;
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders();
                    statusCode = controllerObj.getStatus() || statusCode;
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                returnHandler(response, statusCode, data, headers)
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            data.pipe(response);
        } else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        } else {
            response.status(statusCode || 204).end();
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown>  {
        return function(status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any, response: any): any[] {
        const fieldErrors: FieldErrors  = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"ignore"});
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"ignore"});
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"ignore"});
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"ignore"});
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', {"noImplicitAdditionalProperties":"ignore"});
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"ignore"});
                    } else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"ignore"});
                    } else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"ignore"});
                    }
                case 'res':
                    return responder(response);
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
