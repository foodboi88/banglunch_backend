import { ObjectId } from 'mongodb';

//agrigate query for get products sold by seller
export const getProductsSoldBuySellerId = (sellerId: string, size: number, offset: number): Array<Record<string, any>> => [
    {
        $lookup: {
            from: "users",
            localField: "userId_buy",
            foreignField: "_id",
            as: "userBuy",
        },
    },
    {
        $unwind: {
            path: "$userBuy",
        },
    },
    {
        $addFields: {
            "userBuy.id": { $toObjectId: "$userBuy._id" },
        },
    },
    {
        $project: {
            "userBuy._id": 0,
            "userBuy.password": 0,
            "userBuy.activeCode": 0,
            "userBuy.role": 0,
            "userBuy.active": 0,
        },
    },
    {
        $lookup: {
            from: "users",
            localField: "userId_sell",
            foreignField: "_id",
            as: "userSell",
        },
    },
    {
        $unwind: {
            path: "$userSell",
        },
    },
    {
        $addFields: {
            "userSell.id": { $toObjectId: "$userSell._id" },
        },
    },
    {
        $project: {
            "userSell._id": 0,
            "userSell.password": 0,
            "userSell.activeCode": 0,
            "userSell.role": 0,
            "userSell.active": 0,
        },
    },
    {
        $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product",
        },
    },
    {
        $unwind: {
            path: "$product",
        },
    },
    {
        $addFields: {
            "product.id": { $toObjectId: "$product._id" },
        },
    },
    {
        $project: {
            "product._id": 0,
            "product.content": 0,
            "product.userId": 0,
            "product.collectionId": 0,
            "product.views": 0,
            "product.likes": 0,
            "product.quantityPurchased": 0,
        },
    },
    {
        $project: {
            _id: 0,
            id: '$_id',
            userBuy: "$userBuy",
            userSell: "$userSell",
            code_Order: 1,
            price: 1,
            voucher: 1,
            createdAt: 1,
            product: "$product",
        },
    },
    {
        $match: {
            'userSell.id': new ObjectId(sellerId),
        }
    },
    {
        $facet: {
            count: [{ $count: 'total' }],
            items: [
                { $skip: +offset },
                { $limit: +size },
            ],
        },
    },
    {
        $project: {
            items: 1,
            totalPrice: 1,
            total: { $arrayElemAt: ['$count.total', 0] },
        },
    },



]


//agrigate query for get products sold by seller
export const getProductsSoldBuyAdmin = (size: number, offset: number): Array<Record<string, any>> => [
    {
        $lookup: {
            from: "users",
            localField: "userId_buy",
            foreignField: "_id",
            as: "userBuy",
        },
    },
    {
        $unwind: {
            path: "$userBuy",
        },
    },
    {
        $addFields: {
            "userBuy.id": { $toObjectId: "$userBuy._id" },
        },
    },
    {
        $project: {
            "userBuy._id": 0,
            "userBuy.password": 0,
            "userBuy.activeCode": 0,
            "userBuy.role": 0,
            "userBuy.active": 0,
        },
    },
    {
        $lookup: {
            from: "users",
            localField: "userId_sell",
            foreignField: "_id",
            as: "userSell",
        },
    },
    {
        $unwind: {
            path: "$userSell",
        },
    },
    {
        $addFields: {
            "userSell.id": { $toObjectId: "$userSell._id" },
        },
    },
    {
        $project: {
            "userSell._id": 0,
            "userSell.password": 0,
            "userSell.activeCode": 0,
            "userSell.role": 0,
            "userSell.active": 0,
        },
    },
    {
        $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product",
        },
    },
    {
        $unwind: {
            path: "$product",
        },
    },
    {
        $addFields: {
            "product.id": { $toObjectId: "$product._id" },
        },
    },
    {
        $project: {
            "product._id": 0,
            "product.content": 0,
            "product.userId": 0,
            "product.collectionId": 0,
            "product.views": 0,
            "product.likes": 0,
            "product.quantityPurchased": 0,
        },
    },
    {
        $project: {
            _id: 0,
            id: '$_id',
            userBuy: "$userBuy",
            userSell: "$userSell",
            code_Order: 1,
            price: 1,
            voucher: 1,
            createdAt: 1,
            product: "$product",
        },
    },
    {
        $facet: {
            count: [{ $count: 'total' }],
            items: [
                { $skip: +offset },
                { $limit: +size },
            ],
        },
    },
    {
        $project: {
            items: 1,
            totalPrice: 1,
            total: { $arrayElemAt: ['$count.total', 0] },
        },
    },



]

//agrigate query for get history buy user
export const getHistoryBuyUserId = (userId: string, size: number, offset: number): Array<Record<string, any>> => [
    {
        $lookup: {
            from: "users",
            localField: "userId_buy",
            foreignField: "_id",
            as: "userBuy",
        },
    },
    {
        $unwind: {
            path: "$userBuy",
        },
    },
    {
        $addFields: {
            "userBuy.id": { $toObjectId: "$userBuy._id" },
        },
    },
    {
        $project: {
            "userBuy._id": 0,
            "userBuy.password": 0,
            "userBuy.activeCode": 0,
            "userBuy.role": 0,
            "userBuy.active": 0,
        },
    },
    {
        $lookup: {
            from: "users",
            localField: "userId_sell",
            foreignField: "_id",
            as: "userSell",
        },
    },
    {
        $unwind: {
            path: "$userSell",
        },
    },
    {
        $addFields: {
            "userSell.id": { $toObjectId: "$userSell._id" },
        },
    },
    {
        $project: {
            "userSell._id": 0,
            "userSell.password": 0,
            "userSell.activeCode": 0,
            "userSell.role": 0,
            "userSell.active": 0,
        },
    },
    {
        $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product",
        },
    },
    {
        $unwind: {
            path: "$product",
        },
    },
    {
        $addFields: {
            "product.id": { $toObjectId: "$product._id" },
        },
    },
    {
        $project: {
            "product._id": 0,
            "product.content": 0,
            "product.userId": 0,
            "product.collectionId": 0,
            "product.views": 0,
            "product.likes": 0,
            "product.quantityPurchased": 0,
        },
    },
    {
        $project: {
            _id: 0,
            id: '$_id',
            userBuy: "$userBuy",
            userSell: "$userSell",
            code_Order: 1,
            price: 1,
            voucher: 1,
            createdAt: 1,
            product: "$product",
        },
    },
    {
        $match: {
            'userBuy.id': new ObjectId(userId),
        }
    },
    {
        $facet: {
            count: [{ $count: 'total' }],
            items: [
                { $skip: +offset },
                { $limit: +size },
            ],
        },
    },
    {
        $project: {
            items: 1,
            totalPrice: 1,
            total: { $arrayElemAt: ['$count.total', 0] },
        },
    },



]