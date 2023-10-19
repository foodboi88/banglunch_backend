export const RegisterMailHTML = (fullName: string,  messageRegister: string, redirectUrl: string) => {
    return `
    <!doctype html>
    <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css?family=Lato');
                * {
                    color: #000;
                    font-family: 'Lato', sans-serif;
                }
                #logo {
                    font-weight: bold;
                    font-size: 50px;
                    color: #CF0201;
                    margin: 20px auto;
                    display: block;
                }
                #logo-image {
                    width: 50px;
                  
                }
                #name-text {
                    color: #FF6600;
                }
    
              
    
                #header > p {
                    margin: 0;
                    line-height: 34px;
                }
    
                #wrapper-content {
                    width: 500px;
                    display: block;
                    margin: 0 auto;
                    text-align: center;
                }
    
                p {
                    font-size: 18px;
                    line-height: 28px;
                }
    
                .horizon {
                    width: 100%;
                    height: 2px;
                    background-color: lightgray;
                }
    
                #footer {
                    font-size: 14px;
                }
    
                #footer p {
                    color: lightgray;
                }
    
                #link-confirm {
                    cursor: pointer;
                    box-sizing: border-box;
                    padding: 12px 16px;
                    border-radius: 5px;
                    background-color: #CF0201;
                    border: none;
                    font-size: 18px;
                    color: #ffffff;
                    font-weight: 500;
                    margin: 12px auto;
                    outline: none;
                    width: 250px;
                    text-decoration: none;
                    text-align: center;
                }
    
                #pinme-team {
                    margin-top: 18px;
                }
    
                .small-text {
                    color: lightgrey;
                    font-size: 16px;
                }
            </style>
        </head>
        <body>
            <div id="wrapper-content">
                <p id="logo">
                <img id="logo-image" src="https://vro.vn/wp-content/uploads/2022/12/logo-vro-group.jpg" alt=""> Vro Group
                </p>
                
    
                <div id="header"><p>Xin chào <strong>${fullName}</strong>!</p></div>
    
                <div class="body">
                    <p>${messageRegister}</p>
    
                    <a href="${redirectUrl}" target="_self" id="link-confirm">Xác nhận email</a>
    
                    <p id="pinme-team">
                        Trân trọng cảm ơn! <br>
                        Đội ngũ <strong style="color: #CF0201;">VRO GROUP</strong>
                    </p>
                </div>
    
                <div class="horizon"></div>
    
                <div id="footer">
                    <p>Send with &hearts;</p>
                </div>
            </div>
        </body>
    </html>
    `
} 