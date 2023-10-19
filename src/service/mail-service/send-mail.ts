import * as nodemailer from 'nodemailer'

// Tạo một bộ vận chuyển (transporter) sử dụng SMTP
let transporter = nodemailer.createTransport({
service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export function SendMail(to : string, subject : string, text : string, html : any){
    
    let mailOptions : any
    // Nội dung email

    if( text && html){
        mailOptions = {
            from: process.env.MAIL_USER, 
            to: to, // email người nhận
            subject: subject, // Chủ đề email
            text: text, // Nội dung email dạng text
            html: html, // Nội dung email dạng HTML
        };
    }else if(text){
        mailOptions = {
            from: process.env.MAIL_USER, 
            to: to, // email người nhận
            subject: subject, // Chủ đề email
            text: text, // Nội dung email dạng text
        };
    }else if(html){
        mailOptions = {
            from: process.env.MAIL_USER, 
            to: to, //  email người nhận
            subject: subject, // Chủ đề email
            html: html, // Nội dung email dạng HTML
        };
    }


    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        console.log('Error:', error);
        } else {
        console.log('Email sent:', info.response);
        }
    });

}





