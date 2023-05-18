exports.addRole = ({
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
                    permissions: {
                        workflows: 'none',
                        users: 'none',
                        forms: 'none',
                        departments: 'none',
                        applications: 'none'
                      }

                };

                if (params.name) {
                    entity.name = validate.name(params.name).data.value;
                  } else {
                    delete entity.name;
                  }

                  if (params.status) {
                    entity.status = validate.status(params.status).data.value;
                  }
                  if (params.permissions.workflows) {
                    entity.permissions.workflows = validate.permissions(params.permissions.workflows).data.value;
                  }else{
                    delete entity.permissions.workflows;
                  }
                  if (params.permissions.users) {
                    entity.permissions.users = validate.permissions(params.permissions.users).data.value;
                  }else{
                    delete entity.permissions.users;
                  }
                  if (params.permissions.forms) {
                    entity.permissions.forms = validate.permissions(params.permissions.forms).data.value;
                  }else{
                    delete entity.permissions.forms;
                  }
                  if (params.permissions.applications) {
                    entity.permissions.applications = validate.permissions(params.permissions.applications).data.value;
                  }else{
                    delete entity.permissions.applications;
                  }
                  if (params.permissions.departments) {
                    entity.permissions.departments = validate.permissions(params.permissions.departments).data.value;
                  }else{
                    delete entity.permissions.departments;
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