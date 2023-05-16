
const config = require('../../config/mail.config.json');

const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config[process.env.NODE_ENV].apiKey;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const fromDetails = {
    email: config.senderEmail,
    name: config.senderName
};

exports.connection = () => Object.freeze({
    sendMail: async ({ to, templateId, params, attachments = [] }) => {
        try {
            let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
            let emailOptions = {
                from: fromDetails,
                to: to,
                templateId: templateId,
                params: params,
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                }
            }
            if (attachments) {
                if (attachments.length > 0) {
                    emailOptions.attachment = attachments;
                }
            }
            sendSmtpEmail = emailOptions;
            const status = await apiInstance.sendTransacEmail(sendSmtpEmail);
            console.log(status);
            return status.messageId;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
})