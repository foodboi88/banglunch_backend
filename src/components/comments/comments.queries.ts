import { ObjectId } from "mongodb";

//Get comment by foodId (food + gallery + user + category + comments) 
export const getCommentByFood = (foodId: string): Array<Record<string, any>> => [
  {
    $match:
    /**
     * query: The query in MQL.
     */
    {
      foodId: new ObjectId(
        foodId
      ),
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
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "users",
    },
  },
  {
    $unwind:
    /**
     * path: Path to the array field.
     * includeArrayIndex: Optional name for index.
     * preserveNullAndEmptyArrays: Optional
     *   toggle to unwind null and empty values.
     */
    {
      path: "$users",
    },
  },
  {
    $project:
    /**
     * specifications: The fields to
     *   include or exclude.
     */
    {
      userId: 1,
      foodId: 1,
      description: 1,
      rate: 1,
      createdAt: 1,
      username: "$users.name",
    },
  },
]
