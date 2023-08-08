const generatePassword = require('generate-password');
exports.addUser = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  lang,
  params,
  num,
}) => {
  return Object.freeze({
    async generate() {
      try {
        const validate = DataValidator({ CreateError, lang, translate });
        function createStringWithNumber() {
          const numStr = (num + 1).toString().padStart(6, '0');
          return `EMPY${numStr}`;
        }

        let entity = {
          firstName: null,
          secondName: null,
          department: {
            name: null,
            id: null,
          },
          status: 'inactive',
          statusActivation: null,
          role: null,
          email: null,
          applications: [],
          employeeId: createStringWithNumber(),
          type: 'admin',
          designation: null,
          institution: null,
        };

        if (params.firstName) {
          entity.firstName = validate.firstname(params.firstName).data.value;
        } else {
          delete entity.firstName;
        }

        if (params.secondName) {
          entity.secondName = validate.secondname(params.secondName).data.value;
        } else {
          delete entity.secondName;
        }

        if (params.status) {
          entity.status = validate.status(params.status).data.value;
        }

        if (params.email) {
          entity.email = validate.email(params.email).data.value;
        } else {
          delete entity.email;
        }

        if (params.role) {
          entity.role = validate.mongoid(params.role).data.value;
        } else {
          delete entity.role;
        }

        if (params.department) {
          entity.department.id = validate.mongoid(params.department).data.value;
        } else {
          delete entity.department;
        }

        if (params.designation) {
          entity.designation = validate.mongoid(params.designation).data.value;
        } else {
          delete entity.designation;
        }
        if (params.institution) {
          entity.institution = validate.mongoid(params.institution).data.value;
        } else {
          delete entity.institution;
        }

        if (params.applications) {
          const arr = [];
          params.applications.forEach((element) => {
            arr.push(validate.mongoid(element).data.value);
          });
          entity.applications = arr;
        } else {
          delete entity.applications;
        }

        if (params.type) {
          entity.type = validate.userType(params.type).data.value;
        }

        if (params.password) {
          entity.password = validate.password(params.password).data.value;
        } else {
          entity.password = generatePassword.generate({
            length: 10,
            numbers: true,
          });
        }

        return {
          msg: translate(lang, 'success'),
          data: { entity },
        };
      } catch (error) {
        logger.error('Failed to create exercise entity: %s', error);
        if (error instanceof CreateError) {
          throw error;
        }
        throw new Error(translate(lang, 'error_unknown'));
      }
    },
  });
};
