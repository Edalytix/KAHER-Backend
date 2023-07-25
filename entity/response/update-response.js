exports.updateResponse = ({
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

        let entity = {
          fuid: null,
          ruid: null,
          wuid: null,
          uid: params.userUID,
          auid: null,
          createdAt: Date.now(),
          responses: [],
        };

        if (params.fuid) {
          entity.fuid = validate.mongoid(params.fuid).data.value;
        } else {
          delete entity.fuid;
        }
        if (params.auid) {
          entity.auid = validate.mongoid(params.auid).data.value;
        } else {
          delete entity.auid;
        }
        if (params.ruid) {
          entity.ruid = validate.mongoid(params.ruid).data.value;
        } else {
          delete entity.ruid;
        }
        if (params.wuid) {
          entity.wuid = validate.mongoid(params.wuid).data.value;
        } else {
          delete entity.wuid;
        }
        if (params.responses) {
          const arr = [];
          params.responses.forEach((element) => {
            arr.push(validate.responses(element).data.value);
          });
          entity.responses = arr;
        } else {
          delete entity.responses;
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
