import { ObjectId } from 'mongodb';
import mongoose from "mongoose";

const dataResponseProduct = {
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


//agrigate query for get free product paging size offset
export const getFreeProducts = (size: number, offset: number): Array<Record<string, any>> => [
    {
        $match: {
            $and: [
                { isDisable: false },
                { deletedAt: null },
                { price: 0 },
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
        $facet: {
            count: [{ $count: 'total' }],
            items: [
                { $sort: { views: -1 } },
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



//agrigate query for get product filter by name
export const getProductByName = (name: string): Array<Record<string, any>> => [
    {
        $match: {
            $and: [
                { isDisable: false },
                { deletedAt: null },
                { title: { $regex: name, $options: 'i' } },
            ]
        }
    },
    dataResponseProduct
]

//agrigate query for get product by designStyleId paging size offset



//agrigate query for get product filter by name?, designToolId?, designStyleId?, typeOfArchitectureId? paging size offset and change _id to id
export const getProductByFilter = (name: string, designToolId: string, designStyleId: string, typeOfArchitectureId: string, size: number, offset: number, authorId: string): Array<Record<string, any>> => [
    {
        $match: {
            $and: [
                { isDisable: false },
                { deletedAt: null }
            ]
        }
    },
    {
        $lookup: {
            from: 'productdesigntools',
            localField: '_id',
            foreignField: 'productId',
            as: 'productDesignTool'
        }
    },
    {
        $lookup: {
            from: 'productdesignstyles',
            localField: '_id',
            foreignField: 'productId',
            as: 'productDesignStyle'
        }
    },
    {
        $lookup: {
            from: 'producttypeofarchitectures',
            localField: '_id',
            foreignField: 'productId',
            as: 'productTypeOfArchitecture'
        }
    },
    {
        $lookup: {
            from: 'productimages',
            localField: '_id',
            foreignField: 'productId',
            as: 'productimage'
        }
    },
    {
        $unwind: '$productTypeOfArchitecture',
    },
    {
        $unwind: '$productDesignStyle',
    },
    {
        $unwind: '$productTypeOfArchitecture',
    },
    {
        $unwind: '$productDesignStyle',
    },
    {
        $unwind: '$productimage',
    },
    {
        $match: { 'productimage.isMain': true }
    },
    {
        $project: {
            _id: 1,
            title: 1,
            price: 1,
            views: 1,
            likes: 1,
            quantityPurchased: 1,
            typeOfArchitectureId: '$productTypeOfArchitecture.typeOfArchitectureId',
            productDesignToolId: '$productDesignTool.designToolId',
            productDesignStyleId: '$productDesignStyle.designStyleId',
            image: '$productimage.filePath',
            userId: 1,
            isDisable: 1,
        },
    },
    {
        $sort: {
            views: -1
        }
    },
    {
        $match: {
            $and: [
                name ? { 'title': { $regex: name, $options: 'i' }, } : {},
                authorId ? { userId: new ObjectId(authorId) } : {},
                designStyleId ? { productDesignStyleId: new ObjectId(designStyleId) } : {},
                typeOfArchitectureId ? { typeOfArchitectureId: new ObjectId(typeOfArchitectureId) } : {},
            ]

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
            items: {
                $map: {
                    input: '$items',
                    as: 'item',
                    in: {
                        id: '$$item._id',
                        title: '$$item.title',
                        price: '$$item.price',
                        views: '$$item.views',
                        likes: '$$item.likes',
                        quantityPurchased: '$$item.quantityPurchased',
                        typeOfArchitectureId: '$$item.typeOfArchitectureId',
                        productDesignToolId: '$$item.productDesignToolId',
                        productDesignStyleId: '$$item.productDesignStyleId',
                        image: '$$item.image'
                    }
                }
            },
            total: { $arrayElemAt: ['$count.total', 0] },
        },
    },
    {
        $replaceRoot: {
            newRoot: {
                $mergeObjects: [
                    { total: '$total' },
                    { items: '$items' }
                ]
            }
        }
    },
]


//agrigate query for get product by id (with product image)
export const getProductById = (id: string): Array<Record<string, any>> => [
    {
        $match: {
            $and: [
                { isDisable: false },
                { deletedAt: null },
                { _id: mongoose.Types.ObjectId(id), }
            ]
        }
    },
    {
        $facet: {
            info: [
                dataResponseProduct,
            ],
            images: [
                ...lookUpImage(),

            ],
            designTools: [
                ...lookUpAllDesignTool()
            ],
            designStyles: [
                ...lookUpAllDesignStyle()
            ],
            typeOfArchitectures: [
                ...lookUpAllTypeOfArchitecture()
            ]
        }
    },
    {
        $project: {
            info: { $arrayElemAt: ['$info', 0] },
            images: 1,
            designTools: 1,
            designStyles: 1,
            typeOfArchitectures: 1
        }
    }
]


//agrigate query for get product by typeOfArchitectureId paging size offset  (with product image)
export const getProductByTypeOfArchitectureId = (typeOfArchitectureId: string, size: number, offset: number): Array<Record<string, any>> => [
    {
        $match: {
            $and: [
                { isDisable: false },
                { deletedAt: null }
            ]
        }
    },
    {
        $lookup: {
            from: 'producttypeofarchitectures',
            localField: '_id',
            foreignField: 'productId',
            as: 'productTypeOfArchitecture'
        }
    },
    {
        $lookup: {
            from: 'productimages',
            localField: '_id',
            foreignField: 'productId',
            as: 'productimage'
        }
    },
    {
        $unwind: '$productTypeOfArchitecture',
    },
    {
        $unwind: '$productimage',
    },
    {
        $match: { 'productimage.isMain': true }
    },
    {
        $project: {
            _id: 1,
            title: 1,
            price: 1,
            views: 1,
            likes: 1,
            quantityPurchased: 1,
            typeOfArchitectureId: '$productTypeOfArchitecture.typeOfArchitectureId',
            image: '$productimage.filePath'
        },
    },
    {
        $match: {
            typeOfArchitectureId: new ObjectId(typeOfArchitectureId)
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
            items: {
                $map: {
                    input: '$items',
                    as: 'item',
                    in: {
                        id: '$$item._id',
                        title: '$$item.title',
                        price: '$$item.price',
                        views: '$$item.views',
                        likes: '$$item.likes',
                        quantityPurchased: '$$item.quantityPurchased',
                        typeOfArchitectureId: '$$item.typeOfArchitectureId',
                        image: '$$item.image'
                    }
                }
            },

            total: { $arrayElemAt: ['$count.total', 0] },
        },
    },
    {
        $replaceRoot: {
            newRoot: {
                $mergeObjects: [
                    { total: '$total' },
                    { items: '$items' }
                ]
            }
        }
    },
]





//agrigate query for get most like product paging size offset
export const getMostLikeProducts = (size: number, offset: number): Array<Record<string, any>> => [
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
    {
        $project: {
            _id: 0,
            id: "$_id",
            title: 1,
            price: 1,
            views: 1,
            likes: 1,
            quantityPurchased: 1,
            createdAt: 1,
            updatedAt: 1,
            images: "$productimage.filePath",
            isDisable: 1,
            deletedAt: 1,
            size: {
                $size: "$productimage"
            }
        },
    },
    {
        $match: {
            size: {
                $gt: 0
            }
        }
    },
    {
        $sort: {
            likes: -1
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


//agrigate query for get most view product paging size offset
export const getMostViewProducts = (size: number, offset: number): Array<Record<string, any>> => [
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
    {
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
            isDisable: 1,
            deletedAt: 1,
            size: {
                $size: "$productimage"
            }
        },
    },
    {
        $match: {
            size: {
                $gt: 0
            }
        }
    },
    {
        $sort: {
            views: -1
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



//agrigate query for get product  paging size offset
export const getProductByUserId = (size: number, offset: number): Array<Record<string, any>> => [
    {
        $match: {
            $and: [
                { isDisable: false },
                { deletedAt: null }
            ]
        }
    },
    dataResponseProduct,
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

//agrigate query for get newest product by designToolId paging size offset
export const getProductByDesignToolId = (designToolId: string, size: number, offset: number): Array<Record<string, any>> => [
    {
        $match: {
            $and: [
                { isDisable: false },
                { deletedAt: null },
                { designToolId: mongoose.Types.ObjectId(designToolId), }
            ]
        }
    },
    dataResponseProduct,
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


//agrigate query for get newest product by collectionId paging size offset  
export const getProductByCollectionId = (collectionId: string, size: number, offset: number): Array<Record<string, any>> => [
    {
        $match: {
            $and: [
                { isDisable: false },
                { deletedAt: null },
                { collectionId: mongoose.Types.ObjectId(collectionId), }
            ]
        }
    },
    dataResponseProduct,
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



