var XLSX = require('xlsx');

exports.excelUpload = async ({
  excel,
  translate,
  logger,
  CreateError,
  lang,
  db,
  UserFunction,
  DesignationFunction,
  InstitutionFunction,
}) => {
  const workbook = XLSX.readFile(excel[0].path);
  const sheet = workbook.Sheets['Sheet0'];
  const rows = XLSX.utils.sheet_to_json(sheet);

  function getNames(fullName) {
    const spaceIndex = fullName.indexOf(' ');
    const firstName =
      spaceIndex !== -1 ? fullName.substring(0, spaceIndex) : fullName;
    const secondName =
      spaceIndex !== -1 ? fullName.substring(spaceIndex + 1) : '';
    return [firstName, secondName];
  }

  const users = [];

  for (let index = 0; index < rows.length; index++) {
    const element = rows[index];
    const user = {
      firstName: null,
      secondName: null,
      role: null,
      department: { id: null, name: null },
      email: null,
      password: null,
      status: 'inactive',
      departmentName: null,
      designation: null,
      institution: null,
      employeeId: element['Employee Number'],
    };
    user.firstName = getNames(element['Employee Name'])[0];
    user.secondName = getNames(element['Employee Name'])[1];
    user.role = '649c0b5e6c1df0c8be08df98';
    user.department.id = '64f714fadd124fe8ad76ff5c';
    user.email = element['Email ID'];
    user.status = 'inactive';

    let designation = await DesignationFunction.findAll(
      1,
      10,
      element['Designation Name']
    );
    if (element['Designation Name'] === 'Assistant Professor(Grade I)') {
      user.designation = '64f720166493e8fca30c46a7';
    } else {
      if (designation.data.total === 0) {
        designation = await DesignationFunction.create({
          name: element['Designation Name'],
        });
        user.designation = designation.data.designation._id;
      } else {
        user.designation = designation.data.data[0]._id;
      }
    }

    let institution = await InstitutionFunction.findAll(
      1,
      10,
      element['Site Name']
    );
    if (institution.data.total === 0) {
      institution = await InstitutionFunction.create({
        name: element['Site Name'],
      });
      user.institution = institution.data.institution._id;
    } else {
      user.institution = institution.data.data[0]._id;
    }
    users.push(user);
  }

  return users;
};
