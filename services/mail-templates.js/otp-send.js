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
          </body>
        `, // html body
    };
  },
};
