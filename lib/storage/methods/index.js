const fromGeneratorUrl = require('./upload-url-generator');
const fromDownloadGenerator = require('./download-url-generator');

module.exports = {
    GenerateUploadURL: fromGeneratorUrl.GenerateUploadURL,
    GenerateDownloadURL: fromDownloadGenerator.GenerateDownloadURL
}