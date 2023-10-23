export interface ISeller {
    userId : string;
    sellerType : SellerType;
    identityCardNumber : string;
    identityCardDate : Date;    //ngay cap cmnd
    identityCardPlace : string;  //noi cap
    taxCode : string;
    bankAccountNumber : string;
    bankAccountName : string;
    bankName : string;
    bankBranch : string;
    currentBalance : number;
    amountWithdrawn: number;
    isApproved : boolean; //đã được duyệt hay chưa
    shopStatus: Boolean;
}

export enum SellerType {
    ARCHITECT = 'ARCHITECT',
    COMPANY = 'COMPANY',
}

export interface ISellerDTO {
    userId : string;
    sellerType : SellerType;
    identityCardNumber : string;
    identityCardDate : Date;    //ngay cap cmnd
    identityCardPlace : string;  //noi cap
    taxCode : string;
    bankAccountNumber : string;
    bankAccountName : string;
    bankName : string;
    bankBranch : string;
    currentBalance : number;
    amountWithdrawn: number;
    isApproved : boolean;
    createdAt : Date;
    updatedAt : Date;
    shopStatus: Boolean;
}

export interface ISellerRegister {
    sellerType : SellerType;
    identityCardNumber : string;
    identityCardDate : Date;    //ngay cap cmnd
    identityCardPlace : string;  //noi cap
    taxCode : string;
    bankAccountNumber : string;
    bankAccountName : string;
    bankName : string;
    bankBranch : string;
}

export interface ISellerUpdate {
    bankAccountNumber? : string;
    bankAccountName? : string;
    bankName? : string;
    bankBranch? : string;
}

export interface IShopStatusUpdate {
    shopStatus: boolean;
}