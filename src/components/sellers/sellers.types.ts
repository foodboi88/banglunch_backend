export interface ISeller {
    userId: string;
    identityId: string;
    personalTaxCode: string;
    shopStatus: Boolean;
    fromDetailAddress: string,
}

export interface IShopStatusUpdate {
    shopStatus: boolean;
}