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
                    employeeId: null,
                    type: 'admin'

                };


                const getRandomString = (length) => Array.from({length}, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('');


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

                  // if (params.employeeId) {
                  //   entity.employeeId = validate.employeeId(params.employeeId).data.value;
                  // } else {
                  //   delete entity.employeeId;
                  // }

                  entity.employeeId = getRandomString(10);

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

                  if (params.applications) {
                    const arr = [];
                    params.applications.forEach(element => {
                      arr.push(validate.mongoid(element).data.value)
                    });
                    entity.applications = arr;
                  } else {
                    delete entity.applications;
                  }

                  if (params.type) {
                    entity.type = validate.userType(params.type).data.value;
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