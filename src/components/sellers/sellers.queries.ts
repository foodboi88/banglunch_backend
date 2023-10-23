import mongoose from 'mongoose';


const dataResponseRegistrationForm = {
    $project: {
        _id: 0,
        id: '$_id',
        identityCardNumber: 1,
        taxCode: 1,
        bankAccountNumber: 1,
        bankName: 1,
        bankBranch: 1,
        isApproved: 1,
        createdAt: 1,
        updatedAt: 1,
        name: '$user.name',
        email: '$user.email',
        phone: '$user.phone',
        address: '$user.address',
        dob: '$user.dob',
    }
}

export const getRegistrationFormPipeline = (size: number, offset: number, isApproved: boolean) => {

    size = size ? size : 10;
    offset = offset ? offset : 0;

    return [
        {
            $match: {
                isApproved: isApproved
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: {
                path: '$user',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $facet: {
                count: [{ $count: 'total' }],
                items: [
                    { $skip: +offset },
                    { $limit: +size },
                    dataResponseRegistrationForm
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
}
