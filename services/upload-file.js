const path = require('path');

exports.uploadFile = async ({ file }) => {
  const Minio = require('minio');

  const minioClient = new Minio.Client({
    endPoint: 'storage.edalytics.com',
    port: 443,
    useSSL: true,
    accessKey: 'edalyticsminio',
    secretKey: 'edalyticsminio#1215',
  });

  const bucketName = 'kaher';

  let fileName = file?.originalname?.split('.');
  fileName[0] = file?.originalname?.replace(/ /g, '_');
  fileName[1] = file?.mimetype?.split('/')[1];

  const objectName = `${fileName[0]}`;
  const metaData = {
    'Content-Type': file.mimetype,
  };

  const filePath = path.join(
    __dirname + '/../lib/temp-file' + `/${file.filename}`
  );

  console.log(filePath);

  try {
    minioClient
      .fPutObject(bucketName, objectName, filePath, metaData)
      .catch((e) => {
        console.log('Error while creating object from file data: ', e);
        throw e;
      });

    presignedUrl = await minioClient.presignedUrl(
      'GET',
      bucketName,
      objectName,
      24 * 60 * 60 * 7
    );
  } catch (error) {
    console.log('error is', error);
  }

  return { url: presignedUrl, name: file.originalname, type: file.mimetype };
};
