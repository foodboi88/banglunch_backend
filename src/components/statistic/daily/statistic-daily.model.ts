import mongoose, { Document, Model} from "mongoose";
import { IStatisticDaily } from "./statistic-daily.types";

interface StatisticDailyDocument extends IStatisticDaily, Document { };
interface StatisticDailyModel extends Model<StatisticDailyDocument> { };

const statisticDailySchema = new mongoose.Schema<StatisticDailyDocument, StatisticDailyModel> ( {
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    totalBuy : {
        type : Number,
        default : 0,
    },
    totalSell : {
        type : Number,
        default : 0,
    },
    day : {
        type : Date,
    },
    createdAt : Date,
    updatedAt : Date
})

statisticDailySchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const StatisticDaily = mongoose.model<StatisticDailyDocument, StatisticDailyModel>('StatisticUserDaily', statisticDailySchema);

export default StatisticDaily; 