exports.addForms = ({
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
                    forms: [],
                };

                  if (params.forms) {
                    const arr = [];
                    params.forms.forEach(element => {
                       validate.mongoid(element.form).data.value
                       arr.push(element)
                    });
                    entity.forms = arr;
                  } else {
                    delete entity.forms;
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