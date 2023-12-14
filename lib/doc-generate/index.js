const financial_assistance_doc = require('./financial_assistance_doc.js');

module.exports.docGenrator = {
    financialAssistanceDoc: financial_assistance_doc().genDocs
};