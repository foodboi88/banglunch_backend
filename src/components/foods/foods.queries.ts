import { ObjectId } from 'mongodb';

//agrigate query for get product filter by name?, designToolId?, designStyleId?, typeOfArchitectureId? paging size offset and change _id to id
export const getFoodsByFilterWithCategoryId = (name: string, categoryId: string): Array<Record<string, any>> => [
    {
        $match: {
            $or: [
                { deletedAt: null },
                { deletedAt: undefined },
                { deletedAt: "" }
            ]
        }
    },
    {
        $match: {
            $and: [
                {
                    title: {
                        $regex: name || '',
                        $options: "i",
                    },
                },
            ],
        },
    },
    {
        $lookup: {
            from: "food_categories", // bảng muốn tham chiếu tới
            localField: "_id", // id chính của bảng hiện tại
            foreignField: "foodId", // id ngoại tham chiếu từ id chính của bảng hiện tại
            as: "food_categories",
        },
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
            from: "categories",
            localField: "food_categories.categoryId", // id ngoại (ở bảng hiện tại) tham chiếu từ id chính của bảng khác 
            foreignField: "_id", // id chính của bảng khác
            as: "categories",
        },
    },
    {
        $lookup:
        {
            from: "galleries",
            localField: "_id",
            foreignField: "foodId",
            as: "galleries",
        },
    },
    {
        $match:
        /**
         * query: The query in MQL.
         */
        {
            "categories._id": new ObjectId(categoryId),
        },
    },
]

//agrigate query for get product filter by name?, designToolId?, designStyleId?, typeOfArchitectureId? paging size offset and change _id to id
export const getFoodsByFilterWithoutCategoryId = (name: string): Array<Record<string, any>> => [
    {
        $match: {
            $or: [
                { deletedAt: null },
                { deletedAt: undefined },
                { deletedAt: "" }
            ]
        }
    },
    {
        $match: {
            $and: [
                {
                    title: {
                        $regex: name || '',
                        $options: "i",
                    },
                },
            ],
        },
    },
    {
        $lookup: {
            from: "food_categories", // bảng muốn tham chiếu tới
            localField: "_id", // id chính của bảng hiện tại
            foreignField: "foodId", // id ngoại tham chiếu từ id chính của bảng hiện tại
            as: "food_categories",
        },
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
            from: "categories",
            localField: "food_categories.categoryId", // id ngoại (ở bảng hiện tại) tham chiếu từ id chính của bảng khác 
            foreignField: "_id", // id chính của bảng khác
            as: "categories",
        },
    },
    {
        $lookup:
        {
            from: "galleries",
            localField: "_id",
            foreignField: "foodId",
            as: "galleries",
        },
    },
]

//Get detail food by id (food + gallery + user + category + comments) 
export const getDetailFoodById = (foodId: string, size?: number, offset?: number): Array<Record<string, any>> => [
    {
        $match:
        {
            _id: new ObjectId(foodId),
        },
    },
    {
        $lookup:
        {
            from: "users",
            let: {
                sellerId: "$sellerId",
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$_id", "$$sellerId"],
                                },
                            ],
                        },
                    },
                },
                {
                    $lookup: {
                        from: "sellers",
                        localField: "_id",
                        foreignField: "userId",
                        as: "info",
                    },
                },
                {
                    $unwind: "$info",
                },
            ],
            as: "seller",
        },
    },
    {
        $unwind: "$seller",
    },
    {
        $lookup:
        {
            from: "galleries",
            localField: "_id",
            foreignField: "foodId",
            as: "galleries",
        },
    },
    {
        $lookup:
        {
            from: "food_categories",
            let: {
                foodId: "$_id",
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$foodId", "$$foodId"],
                                },
                            ],
                        },
                    },
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "categories",
                    },
                },
                {
                    $unwind: "$categories",
                },
            ],
            as: "food_categories",
        },
    },
]

//get food by shop (detail food + gallery) 
export const getFoodsByShop = (shopId: string, size?: number, offset?: number): Array<Record<string, any>> => [
    {
        $match: {
            $or: [
                { deletedAt: null },
                { deletedAt: undefined },
                { deletedAt: "" }
            ]
        }
    },
    {
        $match:
        /**
         * query: The query in MQL.
         */
        {
            sellerId: new ObjectId(shopId),
        },
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
            from: "galleries",
            localField: "_id",
            foreignField: "foodId",
            as: "galleries",
        },
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
            from: "food_categories",
            localField: "_id",
            foreignField: "foodId",
            as: "food_categories",
        },
    }
]

//get food by shop (detail food + gallery) 
export const getAllFood = (size?: number, offset?: number): Array<Record<string, any>> => [
    {
        $match: {
            $or: [
                { deletedAt: null },
                { deletedAt: undefined },
                { deletedAt: "" }
            ]
        }
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
            from: "galleries",
            localField: "_id",
            foreignField: "foodId",
            as: "galleries",
        },
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
            from: "food_categories",
            localField: "_id",
            foreignField: "foodId",
            as: "food_categories",
        },
    }
]