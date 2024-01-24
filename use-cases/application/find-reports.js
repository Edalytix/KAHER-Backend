const fromEntities = require('../../entity');
const { ObjectId } = require('mongodb');

exports.findReports = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  request,
  db,
  ac,
  accessManager,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.locals.lang;
        const email = request.locals.email;
        const userUID = request.locals.uid;
        const role = request.locals.role;
        const institution = request.queryParams.institution;
        const designation = request.queryParams.designation;
        const department = request.queryParams.department;
        const startRange = request.queryParams.startRange;
        const endRange = request.queryParams.endRange;
        const appStatus = request.queryParams.status;
        const resubmission = request.queryParams.resubmission;
        const level = request.queryParams.level;
        const formId = request.queryParams.formId;
        const pendingPrincipal = request.queryParams.pendingPrincipal || false;
        const pendingFinance = request.queryParams.pendingFinance || false;
        const pendingRegistrar = request.queryParams.pendingRegistrar || false;

        const acesssRes = await accessManager({
          translate,
          logger,
          CreateError,
          lang,
          role,
          db,
          useCase: 'forms:view',
        });

        const ApplicationFunction = db.methods.Application({
          translate,
          logger,
          CreateError,
          lang,
        });

        const res = await ApplicationFunction.findReports({
          institution,
          designation,
          department,
          startRange,
          endRange,
          status: appStatus,
          resubmission,
          level,
          formId,
          pendingPrincipal,
          pendingFinance,
          pendingRegistrar,
        });

        return {
          msg: translate(lang, 'created_mood'),
          data: res,
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(`Failed to signup: %s`, error);

        throw new Error(error.message);
      }
    },
  });
};
