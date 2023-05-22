exports.updateDepartment = ({
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
                    name: null,
                    status: 'inactive',
                    users: [],
                    applications: [],

                };

                if (params.name) {
                    entity.name = validate.name(params.name).data.value;
                  } else {
                    delete entity.name;
                  }

                  if (params.status) {
                    entity.status = validate.status(params.status).data.value;
                  }else {
                    delete entity.status;
                  }
                  
                  if (params.users) {
                    const arr = []
                    params.users.forEach(element => {
                       arr.push(validate.mongoid(element).data.value);
                    }); 
                    const removeDuplicates = (arr) => [...new Set(arr)];
                    entity.users = removeDuplicates(arr);
                  }else {
                    delete entity.users;
                  }

                  if (params.applications) {
                    const arr = []
                    params.applications.forEach(element => {
                       arr.push(validate.mongoid(element).data.value);
                    }); 
                    entity.applications = arr;
                  }else {
                    delete entity.applications;
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