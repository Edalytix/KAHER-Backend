exports.updateWorkflow = ({
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
                    applications: [],
                    createdAt: Date.now(),
                    approvals: [],
                    level: null,
                    status: null

                };

                if (params.name) {
                    entity.name = validate.title(params.name).data.value;
                  } else {
                    delete entity.name;
                  }

                  if (params.status) {
                    entity.status = validate.status(params.status).data.value;
                  }else {
                    delete entity.status;
                  }
                  if (params.applications) {
                    const arr = [];
                    params.applications.forEach(element => {
                        arr.push(validate.mongoid(element).data.value)
                    });
                    entity.applications = arr;
                  } else {
                    delete entity.applications;
                  }
                  if (params.level) {
                    entity.level = validate.level(params.level).data.value;
                  } else {
                    delete entity.level;
                  }
                  if (params.approvals) {
                    const arr = [];
                    params.approvals.forEach(element => {
                       validate.mongoid(element.approvalBy).data.value;
                       arr.push(element)
                    });
                    entity.approvals = arr;
                  } else {
                    delete entity.approvals;
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