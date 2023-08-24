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
            <a href=https://kaher.edalytics.com/account/forgot-password/otp?verify=${params.token} target="_blank">
            <button>Click Here</button>
            </body>
        `, // html body
    };
  },
  SetPassword: function Mail(params) {
    return {
      from: 'info@kledeemeduniversity.edu.in', // sender address
      to: params.to, // list of receivers
      subject: 'Set your new password.', // Subject line
      text: `Set new password using the credentials given below for the email ${params.to}`, // plain text body
      html: `
          <body>
            <h2>New Password given below:</h2>
            <h2>${params.password}</h2>
            <a href=https://kaher.edalytics.com/account/login?verify=${params.token} target="_blank">
            <button>Click Here</button>
          </a>
          </body>
        `, // html body
    };
  },
};
