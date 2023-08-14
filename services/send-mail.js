const nodemailer = require('nodemailer');
const templates = require('./mail-templates.js/otp-send');

exports.mailer = async ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  request,
  db,
  accessManager,
  lang,
  params,
}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'kaherincentive@kledeemeduniversity.edu.in', // your email address
        pass: 'yngxqzobhsznnjyh', // your email password
      },
    });
    const message = await templates[params.type](params);

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    return {
      msg: translate(lang, 'created_mood'),
      data: {},
    };
  } catch (error) {
    if (error instanceof CreateError) {
      throw error;
    }
    logger.error(`Failed to signup: %s`, error);

    throw new Error(error.message);
  }
};
