const generatePassword = require('generate-password');

exports.addUser = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    crypto,
    lang,
    params
}) => {
    return Object.freeze({
        async generate() {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    firstName: null,
                    secondName: null,
                    department: {
                        name: null,
                        id: null
                    },
                    status: 'inactive',
                    statusActivation: null,
                    role: null,
                    email: null,
                    applications: [],

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
                    entity.role = validate.name(params.role).data.value;
                  } else {
                    delete entity.role;
                  }

                  if (params.department) {
                    entity.department.name = validate.name(params.department.name).data.value;
                    entity.department.id = validate.mongoid(params.department.id).data.value;
                  } else {
                    delete entity.department;
                  }
                  if(params.password)
                  {
                    entity.password = validate.password(params.password).data.value;
                  }
                  else{
                    entity.password = generatePassword.generate({ length: 10, numbers: true })
                  }
                  

                

                return {
                    msg: translate(lang, 'success'),
                    data: { entity }
                }
            } catch (error) {
                logger.error('Failed to create exercise entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}