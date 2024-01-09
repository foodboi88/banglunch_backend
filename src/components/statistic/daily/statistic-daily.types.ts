export interface IStatisticDaily {
    userId : String;
    totalBuy : Number;
    totalSell : Number;
    day : Date ;
    createdAt: Date;
    updatedAt: Date;
}

export interface IStatisticUserDailyDB extends IStatisticDaily {
    id: string;
}