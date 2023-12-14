const hostUrls = require('../../config/app.config.json').host;
const dotenv = require('dotenv');
dotenv.config();
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/app.config.json');
var currentDate = new Date();

// Get individual components of the date (year, month, day, hours, minutes, seconds)
var year = currentDate.getFullYear();
var month = currentDate.getMonth() + 1; // Note: Months are zero-based, so we add 1
var day = currentDate.getDate();
var hours = currentDate.getHours();
var minutes = currentDate.getMinutes();
var seconds = currentDate.getSeconds();

// Format the date as a string (e.g., "YYYY-MM-DD HH:mm:ss")
var dateString =
  year +
  '-' +
  padNumber(month) +
  '-' +
  padNumber(day) +
  ' ' +
  padNumber(hours) +
  ':' +
  padNumber(minutes) +
  ':' +
  padNumber(seconds);

// Function to pad single-digit numbers with a leading zero
function padNumber(num) {
  return (num < 10 ? '0' : '') + num;
}

// Output the result
console.log(dateString);
module.exports = {
  OTPSend: function Mail(params) {
    return {
      from: config.smtp.user, // sender address
      to: params.to, // list of receivers
      subject: 'OTP for Password Reset', // Subject line
      text: `The OTP to reset the password for the account associated with the email ${params.to}`, // plain text body
      html: `
          <body>
            <h2>Your OTP for Kaher password reset</h2>
            <h2>${params.otp}</h2>
            <a href=${hostUrls[env]}/account/forget-password/otp?verify=${params.token} target="_blank" class="button">Click Here</a>
            </body>
        `, // html body
    };
  },
  SetPassword: function Mail(params) {
    return {
      from: config.smtp.user, // sender address
      to: params.to, // list of receivers
      subject: 'Kaher Account created', // Subject line
      text: `Set new password using the credentials given below for the email ${params.to}`, // plain text body
      html: `
      <body>
      Hi

      You’re account has been created on incentive.kaher.edu.in. Please find the credentials to login.
      
      <h2>${params.password}</h2>
      <h2>${params.to}</h2>
      <a href=${hostUrls[env]}/account/login?verify=${params.token} target="_blank" class="button">Click Here</a>
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
  SubmitApplicationForApplicant: function Mail(params) {
    return {
      from: config.smtp.user, // sender address
      to: params.to, // list of receivers
      subject: 'Your Application is Successfully Submitted', // Subject line
      text: `Your Application titled ${params.applicationName} is Successfully Submitted.`, // plain text body
      html: `
      <body>
      Dear ${params.applicantName},
      <br>
      Your Application titled ${params.applicationName} is Successfully Submitted on ${dateString}.
      <br>
      <br>
      With Regards,
      <br>
      Team Kaher
      </body>`, // html body
    };
  },
  SubmitApplicationForApprover: function Mail(params) {
    return {
      from: config.smtp.user, // sender address
      to: params.to, // list of receivers
      subject: 'You have a new Application to approve.', // Subject line
      text: `You have a new Application titled ${params.applicationName} to approve.`, // plain text body
      html: `
      <body>
      Dear ${params.approverName},
      <br>
      Your have been added to a new application titled ${params.applicationName} as Approver on ${dateString}.
      <br>
      With Regards,
      <br>
      Team Kaher
      </body>`, // html body
    };
  },
  ApplicationStatusChangeForApprover: function Mail(params) {
    return {
      from: config.smtp.user, // sender address
      to: params.to, // list of receivers
      subject: 'Application Status has been Updated.', // Subject line
      text: `Status has been Updated for Application titled ${params.applicationName}.`, // plain text body
      html: `
      <body>
      Dear ${params.approverName}

      Status has been Updated for your Application titled ${params.applicationName} on ${dateString}.

      <br>
      With Regards,
      <br>
      Team Kaher
      </body>`, // html body
    };
  },
  ApplicationStatusChangeForApplicant: function Mail(params) {
    return {
      from: config.smtp.user, // sender address
      to: params.to, // list of receivers
      subject: 'Application Status has been Updated.', // Subject line
      text: `Status has been Updated for Application titled ${params.applicationName}.`, // plain text body
      html: `
      <body>
      Dear ${params.applicantName}

      Status has been Updated for Application titled ${params.applicationName} on ${dateString}.

      <br>
      With Regards,
      <br>
      Team Kaher
      </body>`, // html body
    };
  },
  ApplicationRejectedForApprover: function Mail(params) {
    return {
      from: config.smtp.user, // sender address
      to: params.to, // list of receivers
      subject: 'Application Rejected.', // Subject line
      text: `Application titled ${params.applicationName} Rejected.`, // plain text body
      html: `
      <body>
      Dear ${params.approverName}

      Application titled ${params.applicationName} has been rejected by ${params.rejecterName} on ${dateString} due to ${params.rejectionReason}

      <br>
      With Regards,
      <br>
      Team Kaher
      </body>`, // html body
    };
  },
  ApplicationRejectedForApplicant: function Mail(params) {
    return {
      from: config.smtp.user, // sender address
      to: params.to, // list of receivers
      subject: 'Application Rejected.', // Subject line
      text: `Application titled ${params.applicationName} Rejected.`, // plain text body
      html: `
      <body>
      Dear ${params.applicantName}

      Your Application titled ${params.applicationName} has been rejected by ${params.rejecterName} on ${dateString}.

      <br>
      With Regards,
      <br>
      Team Kaher
      </body>`, // html body
    };
  },
  ApplicationApprovedForApprover: function Mail(params) {
    return {
      from: config.smtp.user, // sender address
      to: params.to, // list of receivers
      subject: 'Application Approved.', // Subject line
      text: `Application titled ${params.applicationName} Approved.`, // plain text body
      html: `
      <body>
      Dear ${params.approverName}

      Application titled ${params.applicationName} has been approved by ${params.approverName} on ${dateString}.
      <br>
      With total approved grant as ${params.approvedGrant},
      <br>
      <br>
      With Regards,
      <br>
      Team Kaher
      </body>`, // html body
    };
  },
  ApplicationApprovedForApplicant: function Mail(params) {
    return {
      from: config.smtp.user, // sender address
      to: params.to, // list of receivers
      subject: 'Application Approved.', // Subject line
      text: `Application titled ${params.applicationName} Approved.`, // plain text body
      html: `
      <body>
      Dear ${params.applicantName}

      Your Application titled ${params.applicationName} has been approved by ${params.approverName} on ${dateString}.
      <br>
      With total approved grant as ${params.approvedAmount},
      <br>
      <br>
      With Regards,
      <br>
      Team Kaher
      </body>`, // html body
    };
  },
};
