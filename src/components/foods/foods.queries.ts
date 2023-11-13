import { ObjectId } from 'mongodb';
import mongoose from "mongoose";

const dataResponseProduct = { // define form response sẽ trả về cho frontend
    $project: {
        _id: 0,
        id: "$_id",
        title: 1,
        content: 1,
        price: 1,
        originalPrice: 1,
        views: 1,
        likes: 1,
        quantityPurchased: 1,
        userId: 1,
        designToolId: 1,
        collectionId: 1,
        createdAt: 1,
        updatedAt: 1
    }
}

const dataHomeProduct = {

    $project: {
        _id: 0,
        id: "$_id",
        title: 1,
        price: 1,
        originalPrice: 1,
        views: 1,
        likes: 1,
        quantityPurchased: 1,
        createdAt: 1,
        updatedAt: 1,
        images: "$productimage.filePath",
        designTools: "$productdesigntools.id",
        size: {
            $size: "$productimage"
        }
    },
}

const lookUpDesignTool = () => ([
    {
        $lookup: {
            from: "productdesigntools",
            let: {
                productId: "$_id",
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$productId", "$$productId"],
                                },
                            ],
                        },
                    },
                },
                {
                    $lookup: {
                        from: "designtools",
                        let: {
                            designToolId: "$designToolId",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ["$_id", "$$designToolId"],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $project: {
                                    name: 1,
                                },
                            },
                        ],
                        as: "designtools",
                    },
                },
                {
                    $unwind: "$designtools",
                },
                {
                    $project: {
                        _id: 0,
                        id: "$designtools._id",
                    },
                },
            ],
            as: "productdesigntools",
        },
    },
])



export const lookUpImage = () => ([
    {
        $lookup: {
            from: 'productimages',
            let: { productId: '$_id' },
            as: 'productimage',
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ['$productId', '$$productId']
                        }
                    },
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        productId: 1,
                        filePath: 1,
                        isMain: 1,
                    }
                }
            ]
        }
    },
    {
        $unwind: {
            path: '$productimage',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            _id: 0,
            id: '$_id',
            filePath: '$productimage.filePath',
            isMain: '$productimage.isMain',
        }
    }
])


const lookUpMainImage = () => ([
    {
        $lookup: {
            from: "productimages",
            let: {
                productId: "$_id",
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: [
                                        "$productId",
                                        "$$productId",
                                    ],
                                },
                                {
                                    $eq: ["$isMain", true],
                                },
                            ],
                        },
                    },
                },
            ],
            as: "productimage",
        },
    }
])



const lookUpAllDesignTool = () => ([
    {
        $lookup: {
            from: 'productdesigntools',
            let: { productId: '$_id' },
            as: 'productDesignTool',
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ['$productId', '$$productId']
                        }
                    },
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        productId: 1,
                        designToolId: 1,
                    }
                }
            ]
        }
    },
    {
        $unwind: {
            path: '$productDesignTool',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $lookup: {
            from: 'designtools',
            let: { designToolId: '$productDesignTool.designToolId' },
            as: 'designTool',
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ['$_id', '$$designToolId']
                        }
                    },
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        name: 1,
                        description: 1,
                    }
                }
            ]
        }
    },
    {
        $unwind: {
            path: '$designTool',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            _id: 0,
            id: '$_id',
            name: '$designTool.name',
            description: '$designTool.description',
        }
    }
])

export const lookUpAllDesignStyle = () => ([
    {
        $lookup: {
            from: 'productdesignstyles',
            let: { productId: '$_id' },
            as: 'productDesignStyle',
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ['$productId', '$$productId']
                        }
                    },
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        productId: 1,
                        designStyleId: 1,
                    }
                }
            ]
        }
    },
    {
        $unwind: {
            path: '$productDesignStyle',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $lookup: {
            from: 'designstyles',
            let: { designStyleId: '$productDesignStyle.designStyleId' },
            as: 'designStyle',
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ['$_id', '$$designStyleId']
                        }
                    },
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        name: 1,
                        description: 1,
                    }
                }
            ]
        }
    },
    {
        $unwind: {
            path: '$designStyle',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            _id: 0,
            id: '$_id',
            name: '$designStyle.name',
            description: '$designStyle.description',
        }
    }
])


export const lookUpAllTypeOfArchitecture = () => ([
    {
        $lookup: {
            from: 'producttypeofarchitectures',
            let: { productId: '$_id' },
            as: 'productTypeOfArchitecture',
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ['$productId', '$$productId']
                        }
                    },
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        productId: 1,
                        typeOfArchitectureId: 1,
                    }
                }
            ]
        }
    },
    {
        $unwind: {
            path: '$productTypeOfArchitecture',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $lookup: {
            from: 'typeofarchitectures',
            let: { typeOfArchitectureId: '$productTypeOfArchitecture.typeOfArchitectureId' },
            as: 'typeOfArchitecture',
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ['$_id', '$$typeOfArchitectureId']
                        }
                    },
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        name: 1,
                        description: 1,
                    }
                }
            ]
        }
    },
    {
        $unwind: {
            path: '$typeOfArchitecture',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            _id: 0,
            id: '$_id',
            name: '$typeOfArchitecture.name',
            description: '$typeOfArchitecture.description',
        }
    }
])






//agrigate query for get latest product paging size offset
export const getLatestProducts = (size: number, offset: number): Array<Record<string, any>> => [
    {
        $match: {
            $and: [
                { isDisable: false },
                { deletedAt: null },
            ]
        }
    },
    ...lookUpMainImage(),
    ...lookUpDesignTool(),
    dataHomeProduct,
    {
        $match: {
            size: {
                $gt: 0
            }
        }
    },
    {
        $sort: {
            createdAt: -1
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
            total: {
                $cond: {
                    if: { $eq: [{ $size: '$count' }, 0] },
                    then: 0,
                    else: { $arrayElemAt: ['$count.total', 0] }
                },
            },
        },
    },

]

//getMostQuantityPurchasedProducts
export const getMostQuantityPurchasedProducts = (size: number, offset: number): Array<Record<string, any>> => [
    {
        $match: {
            $and: [
                { isDisable: false },
                { deletedAt: null },
            ]
        }
    },
    ...lookUpMainImage(),
    ...lookUpDesignTool(),
    dataHomeProduct,
    {
        $match: {
            size: {
                $gt: 0
            }
        }
    },
    {
        $sort: {
            quantityPurchased: -1
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
            total: {
                $cond: {
                    if: { $eq: [{ $size: '$count' }, 0] },
                    then: 0,
                    else: { $arrayElemAt: ['$count.total', 0] }
                },
            },
        },
    },

]

//agrigate query for get product filter by name?, designToolId?, designStyleId?, typeOfArchitectureId? paging size offset and change _id to id
export const getProductByFilter = (name: string, categoryId: string, size: number, offset: number, sellerId: string): Array<Record<string, any>> => [
    {
        $match: {
            $and: [
                {
                    title: {
                        $regex: "Mỳ",
                        $options: "i",
                    },
                },
            ],
        },
    },
    {
        $lookup: {
            from: "food_categories",
            localField: "_id",
            foreignField: "foodId",
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
            localField: "food_categories.categoryId",
            foreignField: "_id",
            as: "categories",
        },
    },
    {
        $project: {
            _id: 1,
            title: 1,
            content: 1,
            price: 1,
            views: 1,
            categories: "$categories",
            image: "$food_image.filePath",
            userId: 1,
        },
    },
    {
        $match:
        /**
         * query: The query in MQL.
         */
        {
            "categories._id": new ObjectId("64231030edf9dd11e488c252"),
        },
    },
]


//agrigate query for get product by id (with product image)
export const getProductById = (id: string): Array<Record<string, any>> => [
]


//agrigate query for get product by typeOfArchitectureId paging size offset  (with product image)
export const getProductByTypeOfArchitectureId = (typeOfArchitectureId: string, size: number, offset: number): Array<Record<string, any>> => [
]


//agrigate query for get most like product paging size offset
export const getMostLikeProducts = (size: number, offset: number): Array<Record<string, any>> => [
]


//agrigate query for get most view product paging size offset
export const getMostViewProducts = (size: number, offset: number): Array<Record<string, any>> => [
]

//agrigate query for get product  paging size offset
export const getProductByUserId = (size: number, offset: number): Array<Record<string, any>> => [
]

//agrigate query for get newest product by collectionId paging size offset  
export const getProductByCollectionId = (collectionId: string, size: number, offset: number): Array<Record<string, any>> => [
]



