import { ObjectId } from "mongodb";

export const getProductInMyCart = (id: string) : Array<Record<string, any>> => [
      {
        $match: {
            userId : new ObjectId(id)
        }
      },
      {
        $lookup: {
          from: "products",
          let: {
            productIds: "$productIds",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$productIds"],
                },
              },
            },
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
                as: "productimages",
              },
            },
            {
              $project: {
                _id: 0,
                id: "$_id",
                title: 1,
                price: 1,
                createdAt : 1,
                updatedAt : 1,
                image: {
                  $arrayElemAt: [
                    "$productimages.filePath",
                    0,
                  ],
                },
              },
            },
          ],
          as: "products",
        },
      },
      {
        $project: {
            _id : 0,
            products : "$products",
        }
      },
]  
