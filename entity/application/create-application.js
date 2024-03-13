exports.createApplication = ({
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
          user: null,
          status: 'inactive',
          level: 'draft',
          department: null,
          workflow: null,
          workflowUid: null,
          comments: [],
          activities: [],
          createdAt: Date.now(),
          order: params.order,
        };

        if (params.title) {
          entity.title = validate.title(params.title).data.value;
        } else {
          delete entity.title;
        }

        if (params.user) {
          entity.user = validate.mongoid(params.userUID).data.value;
        } else {
          delete entity.user;
        }

        if (params.department) {
          entity.department = validate.mongoid(params.department).data.value;
        } else {
          delete entity.department;
        }

        if (params.workflow) {
          entity.workflow = validate.mongoid(params.workflow).data.value;
        } else {
          delete entity.workflow;
        }

        if (params.workflowUid) {
          entity.workflowUid = params.workflowUid;
        } else {
          delete entity.workflowUid;
        }

        if (params.status) {
          entity.status = validate.status(params.status).data.value;
        }

        // if (params.level) {
        //   entity.level = validate.applicationlevel(params.level).data.value;
        // }

        if (params.comments) {
          const arr = [];
          params.comments.forEach((element) => {
            validate.mongoid(element.id).data.value;
            validate.comment(element.comment).data.value;
            //validate.timestamp(element.date).data.value;
            arr.push(element);
          });
          entity.comments = arr;
        } else {
          delete entity.comments;
        }

        if (params.activities) {
          const arr = [];
          params.activities.forEach((element) => {
            validate.mongoid(element.id).data.value;
            validate.activitylevel(element.level).data.value;
            //validate.timestamp(element.date).data.value;
            validate.activity(element.activity).data.value;
            arr.push(element);
          });
          entity.activities = arr;
        } else {
          delete entity.activities;
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
