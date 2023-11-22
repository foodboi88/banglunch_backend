import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

export const getOrdersBySeller = (id: string) => {
    return [
        {
            $match:
            /**
             * query: The query in MQL.
             */
            {
                _id: new ObjectId(id)
            },
        },
        {
            $lookup:
            {
                from: "orders",
                let: {
                    sellerId: "$_id",
                },
                pipeline: [
                    // Tao duong ong moi
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            "$sellerId", // SellerId bảng hiện tại
                                            "$$sellerId", // SellerId bảng quan hệ
                                        ],
                                    },
                                ],
                            },
                            orderStatus: 1
                        },
                    },
                    {
                        $lookup: {
                            from: "order_details",
                            // localField: "_id",
                            // foreignField: "orderId",
                            let: {
                                orderId: "$_id", // alias foodId ở orders là foodId
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $eq: [
                                                        "$orderId", //orderId đã được alias ở bảng orders
                                                        "$$orderId" //orderId ở bảng order_details
                                                    ], 
                                                },
                                            ],
                                        },
                                    },
                                },
                                {
                                    $lookup: {
                                        from: "foods",
                                        localField: "foodId",
                                        foreignField: "_id",
                                        as: "food",
                                    },
                                },
                                {
                                    $unwind: "$food",
                                },
                            ],
                            as: "order_details",
                        },
                    },
                ],
                as: "orders",
            },
        },
    ]
}
