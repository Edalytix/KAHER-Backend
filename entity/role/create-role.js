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
                  if (params.workflows) {
                    entity.permissions.workflows = validate.permissions(params.workflows).data.value;
                  }
                  if (params.users) {
                    entity.permissions.users = validate.permissions(params.users).data.value;
                  }
                  if (params.forms) {
                    entity.permissions.forms = validate.permissions(params.forms).data.value;
                  }
                  if (params.applications) {
                    entity.permissions.applications = validate.permissions(params.applications).data.value;
                  }
                  if (params.departments) {
                    entity.permissions.departments = validate.permissions(params.departments).data.value;
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