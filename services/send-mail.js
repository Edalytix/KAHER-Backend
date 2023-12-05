const nodemailer = require('nodemailer');
const templates = require('./mail-templates.js/otp-send');
const config = require('../config/app.config.json');
const models = require("../models").models;
const MailLog = models.mailLog;

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
      host: config.smtp.host,
      port: config.smtp.port,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.smtp.user, // your email address
        pass: config.smtp.pass, // your email password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const message = await templates[params.type](params);

    transporter.sendMail(message, async (error, info) => {
      if (error) {
        logger.error(`Failed to email: %s`, error);
        console.log(error);
      } else {
        logger.info(`Email sent: %s`, info.response);
        console.log('Email sent: ' + info.response);
      }
      let mailLog = new MailLog({
        email: params.to,
        error: JSON.stringify(error),
        info: JSON.stringify(info),
        response: JSON.stringify(info.response)
      });
      await mailLog.save();
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
