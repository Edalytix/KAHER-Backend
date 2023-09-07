exports.updateForm = ({
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
          title: null,
          createdAt: Date.now(),
          workflows: [],
          questions: [],
          status: 'inactive',
          order: null,
        };

        if (params.title) {
          entity.title = validate.title(params.title).data.value;
        } else {
          delete entity.title;
        }

        if (params.status) {
          entity.status = validate.status(params.status).data.value;
        } else {
          delete entity.status;
        }
        if (params.questions) {
          const arr = [];
          params.questions.forEach((element) => {
            arr.push(validate.validateQuestion(element).data.value);
          });
          entity.questions = arr;
        } else {
          delete entity.questions;
        }

        if (params.order) {
          entity.order = validate.number(params.order).data.value;
        } else {
          delete entity.order;
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
