const fromEntities = require('../../entity');
const mongoose = require('mongoose');
const Minio = require('minio');
const minioConfig = require('../../config/minio.config.json');
exports.Create = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  request,
  db,
  accessManager,
  uploadFile,
  mailer,
  token,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.locals.lang;
        const email = request.locals.email;
        const userUID = request.locals.uid;
        const role = request.locals.role;

        const minioClient = new Minio.Client({
          endPoint: minioConfig.endPoint,
          port: minioConfig.port,
          useSSL: minioConfig.useSSL,
          accessKey: minioConfig.accessKey,
          secretKey: minioConfig.secretKey,
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
        // if (!acesssRes) {
        //   throw new CreateError(translate(lang, 'forbidden'), 403);
        // }

        const tokenGenerator = token.jwt({
          CreateError,
          translate,
          lang,
          logger,
        });

        const UserFunction = db.methods.User({
          translate,
          logger,
          CreateError,
          lang,
        });

        const RoleFunction = db.methods.Role({
          translate,
          logger,
          CreateError,
          lang,
        });

        const roleDetail = (await RoleFunction.findById(request.body.role)).data
          .role.permissions;

        const keys = Object.keys(roleDetail);

        request.body.type = 'user';
        for (let key of keys) {
          if (roleDetail[key] === 'edit') {
            request.body.type = 'admin';
          }
        }

        const users = (await UserFunction.findAll()).data.total;

        let entity = (
          await fromEntities.entities.User.addUser({
            CreateError,
            DataValidator,
            logger,
            translate,
            crypto,
            lang,
            params: { ...request.body, userUID },
            num: users,
          }).generate()
        ).data.entity;

        const imagePath = './utils/user.png'; // Replace with the actual path to your image file

        try {
          minioClient
            .fPutObject(
              minioConfig.bucketName,
              `${entity.email}_defaultpfp`,
              imagePath,
              {
                'Content-Type': 'image/png',
              }
            )
            .catch((e) => {
              console.log('Error while creating object from file data: ', e);
              throw e;
            });

          entity.profile_picture = `${entity.email}_defaultpfp`;
        } catch (error) {
          console.log('error is', error);
        }

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

        const preSetPassword = entity.password;
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

        const ApplicationFunction = db.methods.Application({
          translate,
          logger,
          CreateError,
          lang,
        });

        const applications = (await ApplicationFunction.findAll()).data.data;
        console.log(applications);
        const approverApplications = [];

        for (let index = 0; index < applications.length; index++) {
          const element = applications[index];

          for (
            let index = 0;
            index < element.workflow.approvals.length;
            index++
          ) {
            const approval = element.workflow.approvals[index];
            if (
              approval.approvalBy.department &&
              approval.approvalBy.department.toString() ===
                department.data.department._id.toString()
            ) {
              approverApplications.push(element._id);
            }
          }
        }

        entity.applications = approverApplications;
        const res = await UserFunction.create(entity);

        const refreshToken = (
          await tokenGenerator.generateRefreshToken({
            _id: res.data.user._id,
            status: res.data.user.status,
            email: entity.email,
            firstname: entity.firstName,
            lastname: entity.secondName,
            ua: request.locals.ua,
          })
        ).data.token;

        const mail = await mailer({
          CreateError,
          translate,
          logger,
          lang,
          lang: request.locals.lang,
          params: {
            to: entity.email,
            password: preSetPassword,
            token: refreshToken,
            type: 'SetPassword',
          },
        });

        return {
          msg: translate(lang, 'created_mood'),
          data: { res },
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
