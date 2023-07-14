exports.addComment = ({
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
          name: null,
          uid: null,
          content: null,
          type: null,
          referlink: [],
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

        if (params.content) {
          entity.content = validate.content(params.content).data.value;
        } else {
          delete entity.content;
        }

        if (params.type) {
          entity.type = validate.actionType(params.type).data.value;
        } else {
          delete entity.type;
        }

        if (params.picture) {
          entity.referlink.push({
            type: 'file-link',
            link: params.picture,
          });
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
