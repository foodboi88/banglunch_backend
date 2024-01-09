import { CronJob } from 'cron';
import { startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, getQuarter, startOfYear, endOfYear, getYear, getMonth } from 'date-fns';
import StatisticDaily from './daily/statistic-daily.model';
import Orders from '../orders/orders.model';
import { getPurchaseHistoriesByDay } from '../orders/orders.queries';



export async function autoStatisticUser(){
    // Thống kê doanh thu của người bán và chi tiêu của người mua theo ngày
    const autoStatisticDaily = new CronJob('59 59 23 * * *', async () => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Thời gian bắt đầu (00:00:00)
        const endTime = new Date(currentDate);
        endTime.setHours(23, 59, 59, 999); // Thời gian kết thúc (23:59:59)
        const st = new Date(endTime);
        st.setUTCHours(0, 0, 0, 0);
        const check = await StatisticDaily.findOne({day : st})
        if(!check){
            const result = await Orders.aggregate(getPurchaseHistoriesByDay(currentDate,endTime))
            let total : any
            if(result.length > 0){
                total = result[0].totalSum
            }else{
                total = 0
            }
            
            const stats = new StatisticDaily({
                totalPrice : total,
                day : st,
                createdAt : new Date(),
                updatedAt : new Date()
            })
    
            await stats.save()
        }
    });
    autoStatisticDaily.start()
}