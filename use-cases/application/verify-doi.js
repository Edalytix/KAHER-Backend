const fromEntities = require('../../entity');
const axios = require('axios')

exports.VerifyDOI = ({
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
        const role = request.locals.role;
        const { doi } = request.body;
        let res = {
          valid: false,
          unique: false
        }
        const ResponseFunction = db.methods.Response({
          translate,
          logger,
          CreateError,
          lang,
        });

        try {
          let response = await axios("https://api.crossref.org/works/" + doi);
          if (response.status == 200) {
            res.valid = true;
          }
        } catch (error) {
          console.log(error.message)
        }

        if (res.valid) {
          const response = await ResponseFunction.findByField(
            {
              doi: doi
            }
          );
          if (response?.data?.length === 0) {
            res.unique = true;
          }
        }

        return {
          msg: translate(lang, 'created_mood'),
          data: res,
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(`Failed to verify: %s`, error);

        throw new Error(error.message);
      }
    },
  });
};
