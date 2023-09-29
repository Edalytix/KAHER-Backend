const fromEntities = require('../../entity');
const models = require('../../lib/database/models').models;
const User = models.User;

exports.approverDashboard = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  request,
  db,
  accessManager,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.locals.lang;
        const email = request.locals.email;
        const userUID = request.locals.uid;
        const role = request.locals.role;
        const page = parseInt(request.queryParams.page);
        const limit = parseInt(request.queryParams.limit);
        const search = request.queryParams.search;
        const statusQuery = request.queryParams.status;

        // const acesssRes = await accessManager({
        //   translate,
        //   logger,
        //   CreateError,
        //   lang,
        //   role,
        //   db,
        //   useCase: 'users:view',
        // });
        // if (!acesssRes) {
        //   throw new CreateError(translate(lang, 'forbidden'), 403);
        // }

        const UserFunction = db.methods.User({
          translate,
          logger,
          CreateError,
          lang,
        });
        const ApplicationFunction = db.methods.Application({
          translate,
          logger,
          CreateError,
          lang,
        });
        const res = await UserFunction.findAll(
          page,
          limit,
          search,
          statusQuery
        );
        console.log(res.data.total);

        const InstitutionFunction = db.methods.Institution({
          translate,
          logger,
          CreateError,
          lang,
        });
        const institutionUsers = [];
        const institutions = await InstitutionFunction.findAll(
          page,
          limit,
          search,
          statusQuery
        );
        institutions.data.data.forEach(async (element) => {
          const resInstitution = await UserFunction.findByParams({
            institution: element._id,
          });
          institutionUsers.push({
            institution: element,
            usersCount: resInstitution.data.length,
          });
        });

        function generateMonthRanges() {
          const today = new Date();
          const currentYear = today.getFullYear();
          const monthRanges = [];

          for (let month = 0; month < 12; month++) {
            const startOfMonth = new Date(currentYear, month, 1);
            const endOfMonth = new Date(currentYear, month + 1, 0);
            monthRanges.push({
              month: month + 1,
              start: startOfMonth,
              end: endOfMonth,
            });
          }

          return monthRanges;
        }

        // Usage
        const monthRanges = generateMonthRanges();
        async function applicationsCount(level) {
          const monthlyApplication = [];
          const quaterlyApplication = [];
          let yearlyApplication = 0;
          let prevQuarter = 0;
          for (let index = 1; index <= monthRanges.length; index++) {
            const element = monthRanges[index - 1];

            const resMonthly = await ApplicationFunction.findByParams({
              createdAt: {
                $gte: element.start,
                $lte: element.end,
              },
              level,
            });

            yearlyApplication = yearlyApplication + resMonthly.data.length;
            if (index % 3 == 0) {
              quaterlyApplication.push({
                quarter: index / 3,
                applications: yearlyApplication - prevQuarter,
              });
              prevQuarter = yearlyApplication;
            }
            monthlyApplication.push({
              month: element.month,
              users: resMonthly.data.length,
            });
          }
          console.log({
            monthlyApplication: monthlyApplication,
            quarterly: quaterlyApplication,
            yearlyApplication,
          });
          return {
            monthlyApplication: monthlyApplication,
            quarterly: quaterlyApplication,
            yearlyApplication,
          };
        }

        return {
          msg: translate(lang, 'created_mood'),
          data: {
            totalUsers: res.data.total,
            institutionUsers: institutionUsers,
            approved: await applicationsCount('approved'),
            applied: await applicationsCount('waiting'),
            rejected: await applicationsCount('rejected'),
          },
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
