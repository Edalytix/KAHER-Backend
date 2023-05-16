const connection = require("../connection").connection;
const templates = require("../templates");
const moment = require("moment");

module.exports.Send = ({ CreateError, translate, logger, lang }) => {
  return Object.freeze({
    otp: async ({ to, otp, salute, firstname, lastname, title }) => {
      title = checkTitle(title);
      const receiverName = constructName({
        salute,
        firstname,
        lastname,
        title,
      });
      const params = {
        otp: otp,
        fullname: receiverName,
        firstname: firstname,
        lastname: lastname,
        salute: salute,
        title: title,
      };

      const sendTo = [
        {
          email: to,
        },
      ];

      let templateId = templates.passwordReset.otp;

      const status = await connection().sendMail({
        to: sendTo,
        templateId: templateId,
        params: params,
      });
    },
    sendVerifyEmialOtp: async ({
      to,
      otp,
      salute,
      firstname,
      lastname,
      title,
    }) => {
      title = checkTitle(title);
      const receiverName = constructName({
        salute,
        firstname,
        lastname,
        title,
      });
      const params = {
        otp: otp,
        fullname: receiverName,
        firstname: firstname,
        lastname: lastname,
        salute: salute,
        title: title,
        email: to,
      };

      const sendTo = [
        {
          email: to,
        },
      ];

      let templateId = templates.signup.otp;
      if (lang == 'en') {
        templateId = templates.signup.otp_en;
      }

      const status = await connection().sendMail({
        to: sendTo,
        templateId: templateId,
        params: params,
      });
    },
    emailVerify: async ({
      to,
      salute,
      title,
      firstname,
      lastname,
      verify_link,
    }) => {
      const receiverName = constructName({
        salute,
        firstname,
        lastname,
        title,
      });

      const params = {
        fullname: receiverName,
        firstname: firstname,
        lastname: lastname,
        salute: salute,
        title: title,
        verify_link: verify_link,
      };

      const sendTo = [
        {
          email: to,
          name: receiverName,
        },
      ];

      let templateId = templates.signup.verifyEmail;

      const status = await connection().sendMail({
        to: sendTo,
        templateId: templateId,
        params: params,
      });
    },
  });
};

function constructName({ salute, title, firstname, lastname }) {
  return salute + " " + title === null || undefined
    ? ""
    : salute + " " + firstname + " " + lastname;
}

function checkTitle(title) {
  return title ? title : "";
}
