exports.updateRole = ({
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
          status: 'inactive',
          permissions: {
            workflows: 'none',
            users: 'none',
            forms: 'none',
            departments: 'none',
            applications: 'none',
            roles: 'none',
          },
          type: null,
        };

        if (params.name) {
          entity.name = validate.title(params.name).data.value;
        } else {
          delete entity.name;
        }

        if (params.status) {
          entity.status = validate.status(params.status).data.value;
        } else {
          delete entity.status;
        }
        if (params.permissions.workflows) {
          entity.permissions.workflows = validate.permissions(
            params.permissions.workflows
          ).data.value;
        } else {
          delete entity.permissions.workflows;
        }
        if (params.permissions.users) {
          entity.permissions.users = validate.permissions(
            params.permissions.users
          ).data.value;
        } else {
          delete entity.permissions.users;
        }
        if (params.permissions.forms) {
          entity.permissions.forms = validate.permissions(
            params.permissions.forms
          ).data.value;
        } else {
          delete entity.permissions.forms;
        }
        if (params.permissions.applications) {
          entity.permissions.applications = validate.permissions(
            params.permissions.applications
          ).data.value;
        } else {
          delete entity.permissions.applications;
        }
        if (params.permissions.departments) {
          entity.permissions.departments = validate.permissions(
            params.permissions.departments
          ).data.value;
        } else {
          delete entity.permissions.departments;
        }

        if (params.permissions.roles) {
          entity.permissions.roles = validate.permissions(
            params.permissions.roles
          ).data.value;
        } else {
          delete entity.permissions.roles;
        }

        function isEqual(obj1, obj2) {
          const keys1 = Object.keys(obj1);
          const keys2 = Object.keys(obj2);

          if (keys1.length !== keys2.length) {
            return false;
          }

          for (let key of keys1) {
            if (obj1[key] !== obj2[key]) {
              return 'admin';
            }
          }

          return 'user';
        }

        entity.type = isEqual(
          {
            workflows: 'none',
            users: 'none',
            forms: 'none',
            departments: 'none',
            applications: 'none',
            roles: 'none',
          },
          entity.permissions
        );

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
