const hostUrls = require('../../config/app.config.json').host;
console.log(hostUrls);
const dotenv = require('dotenv');
dotenv.config();
const env = process.env.NODE_ENV || 'development';
module.exports = {
  OTPSend: function Mail(params) {
    return {
      from: 'info@kledeemeduniversity.edu.in', // sender address
      to: params.to, // list of receivers
      subject: 'OTP for Password Reset', // Subject line
      text: `The OTP to reset the password for the account associated with the email ${params.to}`, // plain text body
      html: `
          <body>
            <h2>Your OTP for Kaher password reset</h2>
            <h2>${params.otp}</h2>
            <a href=${hostUrls[env]}/account/reset-password?verify=${params.token} target="_blank" class="button">Click Here</a>
            </body>
        `, // html body
    };
  },
  SetPassword: function Mail(params) {
    return {
      from: 'info@kledeemeduniversity.edu.in', // sender address
      to: params.to, // list of receivers
      subject: 'Kaher Account created', // Subject line
      text: `Set new password using the credentials given below for the email ${params.to}`, // plain text body
      html: `
      <body>
      Hi

      You’re account has been created on incentive.kaher.edu.in. Please find the credentials to login.
      
      <h2>${params.password}</h2>
      <h2>${params.to}</h2>
      <a href=${hostUrls[env]}/account/login target="_blank" class="button">Click Here</a>
      <br>
      <br>
      Please reset your password on first login.
      <br>
      <br>
      With Regards,
      <br>
      Team Kaher
      </body>`, // html body
    };
  },
};
