const fromEntities = require('../../entity');
const mongoose = require('mongoose');
const excelUpload = require('../../services/excel-upload').excelUpload;

exports.CreateUserExcel = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  request,
  db,
  accessManager,
  mailer,
  store,
  token,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.locals.lang;
        const email = request.locals.email;
        const userUID = request.locals.uid;
        const role = request.locals.role;

        const tokenGenerator = token.jwt({
          CreateError,
          translate,
          lang,
          logger,
        });

        const acesssRes = await accessManager({
          translate,
          logger,
          CreateError,
          lang,
          role,
          db,
          useCase: 'users:edit',
        });
        if (!acesssRes) {
          throw new CreateError(translate(lang, 'forbidden'), 403);
        }

        const UserFunction = db.methods.User({
          translate,
          logger,
          CreateError,
          lang,
        });

        const DesignationFunction = db.methods.Designation({
          translate,
          logger,
          CreateError,
          lang,
        });

        const InstitutionFunction = db.methods.Institution({
          translate,
          logger,
          CreateError,
          lang,
        });

        const excel = request.body.files.excel;
        const array = await excelUpload({
          excel,
          fromEntities,
          UserFunction,
          DesignationFunction,
          InstitutionFunction,
        });

        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          let user = await UserFunction.findByEmail({ email: element.email });

          if (user.data.user !== null) {
            continue;
          }

          let entity = (
            await fromEntities.entities.User.addUser({
              CreateError,
              DataValidator,
              logger,
              translate,
              crypto,
              lang,
              params: { ...element, userUID },
            }).generate()
          ).data.entity;

          const hashedPassword = (
            await crypto
              .PasswordHash({
                CreateError,
                translate,
                logger,
                password: entity.password,
              })
              .hashPassword()
          ).data.hashedPassword;

          entity.password = hashedPassword;

          const DepartmentFunction = db.methods.Department({
            translate,
            logger,
            CreateError,
            lang,
          });

          const department = await DepartmentFunction.findById(
            entity.department.id
          );
          if (!department.data.department) {
            throw new CreateError('Department not found', 403);
          }
          entity.department.name = department.data.department.name;
          const createduser = await UserFunction.create(entity);

          const refreshToken = (
            await tokenGenerator.generateRefreshToken({
              _id: createduser.data.user._id,
              email: entity.email,
              firstname: entity.firstName,
              lastname: entity.secondName,
              ua: request.locals.ua,
            })
          ).data.token;

          const otp = getOTP(10);
          const storeOtpStatus = await store
            .Store({ translate, logger, lang, CreateError })
            .storeResetOtp({ otp, email: entity.email });

          //send mail with otp
          const mail = await mailer({
            CreateError,
            translate,
            logger,
            lang,
            lang: request.locals.lang,
            params: {
              to: entity.email,
              otp: otp,
              token: refreshToken,
              type: 'SetPassword',
            },
          });
        }
        return {
          msg: translate(lang, 'created_mood'),
          data: {
            res: {
              msg: 'Successfully uploaded',
              data: {},
            },
          },
        };
      } catch (error) {
        console.log('message', error.message);
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(`Failed to signup: %s`, error);
      }
    },
  });
};

function getOTP(len, charSet) {
  len = 10 || len;
  charSet =
    charSet ||
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%*';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}
