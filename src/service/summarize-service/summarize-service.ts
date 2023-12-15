import { CronJob } from "cron";
import OpenAI from "openai";

const openaiInstance = new OpenAI({apiKey: process.env.OPENAI_SECRET_KEY});

export async function summarize() {
    const summarizeComments = new CronJob('59 59 * * * *', async () => {
        

        const response = await openaiInstance.completions.create({
            model: 'gpt-3.5-turbo-instruct', // Chọn mô hình ChatGPT (có thể thay đổi tùy thuộc vào yêu cầu của bạn)
            prompt: 'Tóm tắt list bình luận về món ăn sau ["Mình ăn sữa chua ở mấy cơ sở rồi nhưng thấy ở 50***là được cho đầy đặn nhất.ở đây rất rộng rãi với tầng 2 trang trí còn rất đẹp nữa.vào đây còn được hát karaoke nữa mng ạ.tuyệt vời xứng đáng đc 5 saoo","Ăn ở đây phải gọi là siêu ngon luôn 😍","Ăn nhiều lần tại quán, thấy menu rất đa dạng, có cả đồ uống, nhưng món khiến mình mê nhất vẫn là sữa chua trân châu","Sữa chua ngon, ăn có vị chua nhẹ không bị ngọt quá. Trân châu dai thơm mùi cốt dừa. Nhân viên phục vụ chu đáo nhiệt tình.. Đáng mua và sẽ ủng hộ quán nhiều lần.😊", "Quán gần chỗ mình đi xe khách nên đi Mu Cang Chai đêm nên ghé vào ăn nghỉ ngơi, vệ sinh. Quán bán đêm muộn tiện lợi. Mình chọn sưa chua trân châu 25k. Thấy loại basic này ngon hơn là mix chung với các vị khác.Trân châu nhiều, dẻo dai và vị sữa chua ổn, k quá chua hay ngọt.Bạn nhân viên bán hàng dễ thương, phục vụ tốt."]',
            max_tokens: 150, // Số lượng từ tối đa trong kết quả
          });
      
        const summary = response.choices[0].text.trim();
        console.log(summary)
        

    })
    summarizeComments.start()
}