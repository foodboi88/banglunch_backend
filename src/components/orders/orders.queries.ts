import { ObjectId } from 'mongodb';
import { OrderStatus } from '../../shared/enums/order.enums';

// Get foods in cart by user Id
export const getCartByUserId = (userId: string): Array<Record<string, any>> => [
    {
        $match:
        /**
         * query: The query in MQL.
         */
        {
            userId: new ObjectId(
                userId
            ),
            orderStatus: OrderStatus.Cart,
        },
    },
    {
        $lookup: {
            from: "order_details",
            let: {
                orderId: "$_id", // Dat ten primary key _id cua order_details la orderId
            },

            pipeline: [
                //Tao duong ong moi
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$orderId", "$$orderId"],
                                },
                            ],
                        },
                    },
                },
                {
                    $lookup: {
                        from: "foods",
                        // localField: "foodId",
                        // foreignField: "_id",
                        let: {
                            foodId: "$foodId", // Dat ten primary key _id cua order la orderId
                        },

                        pipeline: [ // Convert _id to id
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ["$_id", "$$foodId"],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $lookup: {
                                    from: 'galleries',
                                    localField: '_id',
                                    foreignField: 'foodId',
                                    as: 'galleries'
                                },
                            },
                        ],
                        as: "foods",
                    },
                },
                {
                    $unwind: "$foods",
                },
            ],
            as: "order_details",
        },
    }
]

export const getOrdersBySeller = (id: string) => {
    return [
        {
            $match:
            /**
             * query: The query in MQL.
             */
            {
                sellerId: new ObjectId(id),
                orderStatus: { $ne: 0 }, // 1 là đang đợi duyệt, 0 là đang là giỏ hàng
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            },
        },
        {
            $unwind: "$user",
        },
        {
            $lookup:
            /**
             * from: The target collection.
             * localField: The local join field.
             * foreignField: The target join field.
             * as: The name for the results.
             * pipeline: Optional pipeline to run on the foreign collection.
             * let: Optional variables to use in the pipeline field stages.
             */
            {
                from: "order_details",
                let: {
                    orderId: "$_id",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            "$orderId", // SellerId bảng hiện tại
                                            "$$orderId", // SellerId bảng quan hệ
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        $lookup: {
                            from: "foods",
                            let: {
                                foodId: "$foodId", // Dat ten primary key _id cua order la orderId
                            },

                            pipeline: [ // Convert _id to id
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $eq: ["$_id", "$$foodId"],
                                                },
                                            ],
                                        },
                                    },
                                },
                                {
                                    $lookup: {
                                        from: 'galleries',
                                        localField: '_id',
                                        foreignField: 'foodId',
                                        as: 'galleries'
                                    },
                                },
                            ],
                            as: "foods",
                        },
                    },
                    {
                        $unwind: "$foods",
                    },
                ],
                as: "order_details",
            },
        },
    ]
}

export const getOrdersByUser = (id: string) => {
    return [
        {
            $match:
            /**
             * query: The query in MQL.
             */
            {
                userId: new ObjectId(id),
                orderStatus: { $ne: 0 }, // 1 là đang đợi duyệt, 0 là đang là giỏ hàng
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'sellerId',
                foreignField: '_id',
                as: 'seller'
            },
        },
        {
            $unwind: "$seller",
        },
        {
            $lookup:
            /**
             * from: The target collection.
             * localField: The local join field.
             * foreignField: The target join field.
             * as: The name for the results.
             * pipeline: Optional pipeline to run on the foreign collection.
             * let: Optional variables to use in the pipeline field stages.
             */
            {
                from: "order_details",
                let: {
                    orderId: "$_id",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            "$orderId", // SellerId bảng hiện tại
                                            "$$orderId", // SellerId bảng quan hệ
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    {
                        $lookup: {
                            from: "foods",
                            let: {
                                foodId: "$foodId", // Dat ten primary key _id cua order la orderId
                            },

                            pipeline: [ // Convert _id to id
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $eq: ["$_id", "$$foodId"],
                                                },
                                            ],
                                        },
                                    },
                                },
                                {
                                    $lookup: {
                                        from: 'galleries',
                                        localField: '_id',
                                        foreignField: 'foodId',
                                        as: 'galleries'
                                    },
                                },
                            ],
                            as: "foods",
                        },
                    },
                    {
                        $unwind: "$foods",
                    },
                    {
                        $lookup: {
                            from: 'comments',
                            localField: '_id',
                            foreignField: 'orderDetailId',
                            as: 'comments'
                        },
                    }
                ],
                as: "order_details",
            },
        },
    ]
}

export const getOrderByFoodAndUser = (foodId: string, userId: string, size?: number, offset?: number): Array<Record<string, any>> => [
    {
        $match:
        /**
         * query: The query in MQL.
         */
        {
            userId: new ObjectId(
                userId
            ),
            orderStatus: 0,
        },
    },
    {
        $lookup: {
            from: "order_details",
            localField: "_id",
            foreignField: "orderId",
            as: "order_details",
        },
    },
    {
        $match:
        /**
         * query: The query in MQL.
         */
        {
            "order_details.foodId": new ObjectId(
                foodId
            ),
        },
    },
]

