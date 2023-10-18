const CONFIG = require('../../../config/obs.config.json');
const client = require('../connection');
const dotenv = require('dotenv');
dotenv.config();
const env = process.env.NODE_ENV || 'development';

exports.GenerateDownloadURL = ({
  lang = 'de',
  CreateError,
  translate,
  logger,
  path,
}) => {
  try {
    const expires = CONFIG[env].s3.downloadExpiry;
    const bucketName = CONFIG[env].s3.bucket;

    let objectKey = path.split(`t-systems.com/${bucketName}/`)[1];

    if (!objectKey) {
      objectKey = path.split(`t-systems.com/`)[1];
    }

    const url = client.createV4SignedUrlSync({
      Method: 'GET',
      Bucket: bucketName,
      Expires: expires,
      Key: objectKey,
    });

    console.log(url);

    return {
      msg: 'success',
      data: {
        headers: {
          ...url['ActualSignedRequestHeaders'],
        },
        url: url['SignedUrl'],
      },
    };
  } catch (error) {
    if (error instanceof CreateError) {
      throw error;
    }
    logger.error(`Failed to generate download URL: %s`, error);
    throw new Error(translate(lang, 'error_unknown'));
  }
};
