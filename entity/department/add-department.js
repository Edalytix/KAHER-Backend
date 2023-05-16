exports.addDepartment = ({
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