export function extractGmailID(email: string) {
    // Tách phần ID của Gmail từ địa chỉ email bằng cách cắt chuỗi
    const gmailID = email.split("@")[0];
    return gmailID;
}


export function generateTransactionCode(email: string) {
    // Lấy thông tin về thời gian hiện tại
    const currentDate = new Date();
    // Tạo chuỗi mã giao dịch từ các thành phần của thời gian hiện tại
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    const gmailID = extractGmailID(email);

    // Tạo chuỗi mã giao dịch
    const transactionCode = `${gmailID}-${year}${month}${day}${hours}${minutes}${seconds}`;

    return transactionCode;
}

export function generateWithdrawalCode(email: string) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    const gmailID = extractGmailID(email);

    const withdrawalCode = `${gmailID}-${year}${month}${day}${hours}${minutes}${seconds}`;

    return withdrawalCode;
}


// console.log(generateTransactionCode("khanh@gmail.com"));