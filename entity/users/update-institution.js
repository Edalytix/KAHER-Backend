exports.updateInstitution = ({
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
        let entity = {
          name: null,
        };

        if (params.name) {
          entity.name = validate.name(params.name).data.value;
        } else {
          delete entity.name;
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
