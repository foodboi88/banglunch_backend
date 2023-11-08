export interface IOrderDetail {
    idSeller: string,
    idUser : string
    createdAt: Date,
    purchasedAt: Date,
    isCart: Boolean
}

export interface IOrderDetailDB extends IOrderDetail {
    id: string;
}