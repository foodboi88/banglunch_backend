export interface IOrderDetail {
    userId_sell: string,
    userId_buy : string
    productId: string,
    createdAt: Date,
    code_Order : string,
    voucher : string,
    price : number,  
}

export interface IOrderDetailDB extends IOrderDetail {
    id: string;
}