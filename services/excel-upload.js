exports.excelUpload = async ({
  excel,
  translate,
  logger,
  CreateError,
  lang,
  db,
}) => {
  const workbook = XLSX.readFile('Recipe171.xlsx');
  const sheet = workbook.Sheets['Amisha'];
  const rows = XLSX.utils.sheet_to_json(sheet);
  console.log(rows);
};
