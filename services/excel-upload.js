var XLSX = require('xlsx');

exports.excelUpload = async ({
  excel,
  translate,
  logger,
  CreateError,
  lang,
  db,
}) => {
  const workbook = XLSX.readFile(excel[0].path);
  const sheet = workbook.Sheets['Sheet0'];
  const rows = XLSX.utils.sheet_to_json(sheet);
  console.log(rows);

  for (let index = 0; index < rows.length; index++) {
    const element = rows[index];
  }
};
