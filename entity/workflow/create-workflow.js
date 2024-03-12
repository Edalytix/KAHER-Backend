exports.createWorkflow = ({
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
          applications: [],
          createdAt: Date.now(),
          forms: [],
          approvals: [],
          color: null,
          level: 'draft',
          status: 'inactive',
          order: null,
        };

        if (params.name) {
          entity.name = validate.title(params.name).data.value;
        } else {
          delete entity.name;
        }

        if (params.status) {
          entity.status = validate.status(params.status).data.value;
        }
        if (params.applications) {
          const arr = [];
          params.applications.forEach((element) => {
            arr.push(validate.mongoid(element).data.value);
          });
          entity.applications = arr;
        } else {
          delete entity.applications;
        }
        if (params.level) {
          entity.level = validate.level(params.level).data.value;
        }

        if (params.color) {
          entity.color = validate.color(params.color).data.value;
        } else {
          delete entity.color;
        }
        if (params.forms) {
          const arr = [];
          params.forms.forEach((element) => {
            validate.mongoid(element.form).data.value;
            arr.push(element);
          });
          entity.forms = arr;
        } else {
          delete entity.forms;
        }
        if (params.approvals) {
          const arr = [];
          params.approvals.forEach((element) => {
            if (element.approvalBy.user) {
              validate.mongoid(element.approvalBy.user).data.value;
            } else if (element.approvalBy.department) {
              validate.mongoid(element.approvalBy.department).data.value;
              validate.mongoid(element.approvalBy.role).data.value;
            }
            arr.push(element);
          });
          entity.approvals = arr;
        } else {
          delete entity.approvals;
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
