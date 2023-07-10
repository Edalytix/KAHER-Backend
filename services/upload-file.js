exports.uploadFile = async ({ file }) => {
  const Minio = require('minio');

  const minioClient = new Minio.Client({
    endPoint: 'storage.edalytics.com',
    port: 9000,
    useSSL: false,
    accessKey: 'edalyticsminio',
    secretKey: 'edalyticsminio#1215',
  });
  const bucketName = 'file-images';

  let fileName = file?.originalname?.split('.');
  fileName[0] = file?.originalname?.replace(/ /g, '_');
  fileName[1] = file?.mimetype?.split('/')[1];

  const objectName = `${fileName[0]}_${new Date().getTime()}.${fileName[1]}`;
  const metaData = {
    'Content-Type': 'image/jpeg',
  };
  const filePath = '/../../lib/temp-file' + `/${file.filename}`;

  const submitFileDataResult = await minioClient
    .putObject(bucketName, objectName, filePath, metaData)
    .catch((e) => {
      console.log('Error while creating object from file data: ', e);
      throw e;
    });

  console.log('file is', submitFileDataResult);
  return submitFileDataResult;
};
