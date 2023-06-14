exports.addComment = ({
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
                    uid: null,
                    comment: null,
                };

                if (params.name) {
                    entity.name = validate.firstname(params.name).data.value;
                  } else {
                    delete entity.name;
                  }

                  if (params.uid) {
                    entity.uid = validate.mongoid(params.uid).data.value;
                  } else {
                    delete entity.uid;
                  }

                  if (params.comment) {
                    entity.comment = validate.comment(params.comment).data.value;
                  } else {
                    delete entity.comment;
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