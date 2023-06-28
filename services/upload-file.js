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

  minioClient.fPutObject(
    bucketName,
    objectName,
    filePath,
    metaData,
    function (err, etag) {
      if (err) {
        return console.log(err);
      }
      console.log('File uploaded successfully.');
    }
  );
};
