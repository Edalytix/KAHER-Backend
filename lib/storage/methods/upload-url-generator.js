const CONFIG = require('../../../config/obs.config.json');
const client = require('../connection');

const env = process.env.NODE_ENV || 'development';

exports.GenerateUploadURL = ({
    lang = 'de',
    CreateError,
    translate,
    logger,
    type,
    userUID,
    fileName,
    isAppointment
}) => {
    try {
        fileName = fileName.split('.');

        let expires = CONFIG[env].s3.expiry;
        const folders = {
            insurance: `insurance`,
            personal: `documents`,
        }

        let folderName;
        if (isAppointment) {
            folderName = 'appointments/' + type;
            expires = CONFIG[env].s3.extendedExpiry;
        } else {
            folderName = folders[type]
        }


        const bucketName = CONFIG[env].s3.bucket;
        const objectKey = `${userUID}/${folderName}/${fileName[0]}_${new Date().getTime()}.${fileName[1]}`

        const url = client.createV4SignedUrlSync({
            Method: 'PUT',
            Bucket: bucketName,
            Expires: expires,
            Key: objectKey,
        });

        return {
            msg: 'success',
            data: {
                headers: {
                    ...url['ActualSignedRequestHeaders']
                },
                url: url['SignedUrl']
            }
        }

    } catch (error) {
        if (error instanceof CreateError) {
            throw error
        }
        logger.error(`Failed to generate upload URL: %s`, error);
        throw new Error(translate(lang, 'error_unknown'));
    }
}