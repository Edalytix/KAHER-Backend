const generatePassword = require('generate-password');

exports.updateUser = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  lang,
  params,
}) => {
  return Object.freeze({
    async generate() {
      try {
        const validate = DataValidator({ CreateError, lang, translate });
        //const date = new Date();

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
          type: null,
          designation: null,
          institution: null,
          accountNumber: null,
          ifsc: null,
          profile_picture: null,
          phoneNumber: null,
          permAddress: null,
          presAddress: null,
          dob: null,
          employeeId: params.employeeId,
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
          if (params.status === 'active') {
            entity.statusActivation = Date.now();
          }
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

        if (params.accountNumber) {
          entity.accountNumber = validate.number(
            params.accountNumber
          ).data.value;
        } else {
          delete entity.accountNumber;
        }

        if (params.ifsc) {
          entity.ifsc = validate.ifsc(params.ifsc).data.value;
        } else {
          delete entity.ifsc;
        }

        if (params.phoneNumber) {
          entity.phoneNumber = validate.phone(params.phoneNumber).data.value;
        } else {
          delete entity.phoneNumber;
        }

        if (params.permAddress) {
          entity.permAddress = validate.address(params.permAddress).data.value;
        } else {
          delete entity.permAddress;
        }

        if (params.presAddress) {
          entity.presAddress = validate.address(params.presAddress).data.value;
        } else {
          delete entity.presAddress;
        }

        if (params.dob) {
          entity.dob = validate.dob(params.dob).data.value;
        } else {
          delete entity.dob;
        }

        if (params?.applications?.length > 0) {
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
        } else {
          delete entity.type;
        }

        if (params.password) {
          entity.password = validate.password(params.password).data.value;
        }

        if (params.profile_picture) {
          entity.profile_picture = params.profile_picture;
        } else {
          delete entity.profile_picture;
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
