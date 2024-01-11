const models = require('../models').models;
const Op = require('../connection').operators;
const Application = models.Application;
const Workflow = models.Workflow;
const Form = models.Form;
const Comment = models.Comment;
const User = models.User;
const Response = models.Response;
const Institution = models.Institution;
const paginate = require('../paginate').paginateArray;
const mongoose = require('mongoose');

exports.Application = ({ translate, logger, CreateError, lang }) => {
  return Object.freeze({
    create: async (params) => {
      try {
        const constructedParams = load(params);

        const application = new Application(constructedParams.updateParams);
        const updatedWorkflow = await Workflow.findByIdAndUpdate(
          application.workflow,
          { $push: { applications: application._id } }
        );

        try {
          await application.save();
          console.log('Application created successfully!');
        } catch (err) {
          if (err.message.includes('duplicate key error collection')) {
            throw Error('Duplicate key error');
          }
        }
        return {
          msg: `Created application successfully`,
          data: { application: unload(application) },
        };
      } catch (error) {
        if (error.message.includes('Duplicate key error')) {
          throw new CreateError(translate(lang, 'duplicate_application'), 409);
        }
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to create application details: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },

    findAll: async (page, limit, searchQuery = '', statusQuery) => {
      try {
        let applications = await Application.find({
          title: { $regex: searchQuery, $options: 'i' },
          level: { $ne: 'draft' },
          status: statusQuery ? statusQuery : ['active', 'inactive'],
        })
          .sort({ _id: -1 })
          .populate('user')
          .populate('department')
          .populate('workflow')
          .populate({
            path: 'user',
            populate: {
              path: 'institution',
              model: 'Institution',
            },
          })
          .exec();

        const res = await Application.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              approved: {
                $sum: {
                  $cond: [{ $eq: ['$level', 'approved'] }, 1, 0],
                },
              },
              rejected: {
                $sum: {
                  $cond: [{ $eq: ['$level', 'rejected'] }, 1, 0],
                },
              },
              onHold: {
                $sum: {
                  $cond: [{ $eq: ['$level', 'on-hold'] }, 1, 0],
                },
              },
              lastMonth: {
                $sum: {
                  $cond: [
                    {
                      $gt: [
                        '$createdAt',
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
              lastQuarter: {
                $sum: {
                  $cond: [
                    {
                      $gt: [
                        '$createdAt',
                        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ]);

        applications = paginate(applications, page, limit);
        applications.total = res[0]?.total;
        applications.approved = res[0]?.approved;
        applications.rejected = res[0]?.rejected;
        applications.onHold = res[0]?.onHold;
        applications.lastMonth = res[0]?.lastMonth;
        applications.lastQuarter = res[0]?.lastQuarter;
        return {
          msg: `Find applications result`,
          data: applications,
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find mood by uid: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findAllOfUsers: async (page, limit, uid, searchQuery = '') => {
      try {
        let applications = await Application.find({
          user: uid,
          title: { $regex: searchQuery, $options: 'i' },
        })
          .populate('user')
          .populate('department')
          .populate('workflow')
          .exec();
        applications = paginate(applications, page, limit);
        return {
          msg: `Find applications result`,
          data: applications,
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find mood by uid: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },

    deleteByEmail: async ({ email }) => {
      try {
        const res = await Application.deleteOne({ email });
        if (res.deletedCount !== 1) {
          throw Error('Application not deleted.');
        }
        return {
          msg: `delete application`,
          data: {},
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to delete mood by uid: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    update: async ({ id, params }) => {
      try {
        const Params = load(params);

        const update = await Application.findByIdAndUpdate(
          id,
          Params.updateParams
        );

        return {
          msg: `Updated application details successfully`,
          data: {},
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to update mood details: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    submit: async ({ id, params }) => {
      try {
        const Params = load(params);

        const update = await Application.findByIdAndUpdate(
          id,
          Params.updateParams,
          { new: true }
        );
        const creator = await User.findOne({ _id: update.user });

        const workflow = await Workflow.findOne({ _id: update.workflow });
        const tags = [
          {
            name: creator.firstName,
            uid: creator._id,
          },
        ];
        for (const element of workflow.approvals) {
          if (element.approvalBy.user) {
            const user = await User.findOne({ _id: element.approvalBy.user });

            tags.push({
              name: user?.firstName,
              uid: user?._id,
            });
          } else {
            const user = await User.findOne({
              'department.id': element.approvalBy.department,
              role: element.approvalBy.role,
            });
            tags.push({
              name: user?.firstName,
              uid: user?._id,
            });
          }
        }
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const document = await Comment.findOneAndUpdate(
          { applicationId: id },
          { applicationId: id, tags: tags },
          options
        );

        return {
          msg: `Updated application details successfully`,
          data: { update },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to update mood details: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findById: async (id) => {
      try {
        const application = await Application.findById(id)
          .populate({ path: 'user', select: '-password' })
          .populate('department')
          .populate('workflow')
          .populate({
            path: 'workflow',
            populate: {
              path: 'forms.form',
              model: 'Form',
            },
          })
          .populate('stages')
          .populate({
            path: 'user',
            populate: {
              path: 'designation',
              model: 'Designation',
            },
          })
          .populate({
            path: 'user',
            populate: {
              path: 'institution',
              model: 'Institution',
            },
          })
          .exec();

        let arr = [];

        for (const element of application.workflow.forms) {
          const response = await Response.findOne({
            auid: application?._id,
            wuid: application?.workflow?._id,
            fuid: element?.form?._id,
          }).populate({
            path: 'responses.user responses.department',
            select: '-password', // exclude password field from User and Department documents
          });

          arr.push({
            form: element.form,
            response: response,
          });
        }
        return {
          msg: `Find applications result`,
          data: {
            application: {
              ...application._doc,
              workflow: {
                ...application.workflow._doc,
                forms: arr,
              },
            },
          },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to find application by id: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findReports: async ({
      institution,
      designation,
      department,
      startRange,
      endRange,
      status,
      resubmission,
      level,
      formId,
    }) => {
      try {
        const filterValues = {
          institution: institution,
          designation: designation,
          department: department,
          startDate: startRange, // Replace with your start date or undefined
          endDate: endRange, // Replace with your end date or undefined
          level: level,
          status: status,
          resubmission: resubmission,
          formId: formId,
        };
        const pipeline = [
          {
            $lookup: {
              from: 'users', // The name of the "users" collection
              localField: 'user',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unwind: '$user',
          },
          {
            $lookup: {
              from: 'departments',
              localField: 'department',
              foreignField: '_id',
              as: 'department',
            },
          },
          {
            $unwind: '$department',
          },
          // {
          //   $project: {
          //     'department.name': 1,
          //     _id: 0,
          //     // Include the "name" field from the "products" collection
          //     // Exclude the "_id" field if you don't want it in the output
          //   },
          // },
          {
            $lookup: {
              from: 'workflows',
              localField: 'workflow',
              foreignField: '_id',
              as: 'workflow',
            },
          },
          {
            $unwind: '$workflow',
          },
          {
            $lookup: {
              from: 'forms',
              localField: 'workflow.forms.form',
              foreignField: '_id',
              as: 'workflow.forms.form',
            },
          },
          {
            $unwind: '$workflow.forms.form',
          },
          {
            $lookup: {
              from: 'stages',
              localField: 'stages',
              foreignField: '_id',
              as: 'stages',
            },
          },
          {
            $lookup: {
              from: 'designations',
              localField: 'user.designation',
              foreignField: '_id',
              as: 'user.designation',
            },
          },
          {
            $unwind: '$user.designation',
          },
          {
            $lookup: {
              from: 'institutions',
              localField: 'user.institution',
              foreignField: '_id',
              as: 'user.institution',
            },
          },
          {
            $unwind: '$user.institution',
          },
        ];

        //Add $match stages conditionally based on provided values
        if (filterValues.formId) {
          pipeline.push({
            $match: { 'workflow.forms.form.uuid': filterValues.formId },
          });
        }

        if (filterValues.institution) {
          const institutionId = new mongoose.Types.ObjectId(
            filterValues.institution
          );
          pipeline.push({
            $match: { 'user.institution._id': institutionId },
          });
        }

        if (filterValues.designation) {
          const designationId = new mongoose.Types.ObjectId(
            filterValues.designation
          );

          pipeline.push({
            $match: { 'user.designation._id': designationId },
          });
        }

        if (filterValues.department) {
          pipeline.push({
            $match: { 'user.department.id': filterValues.department },
          });
        }

        if (filterValues.startDate && filterValues.endDate) {
          pipeline.push({
            $match: {
              createdAt: {
                $gte: new Date(filterValues.startDate),
                $lte: new Date(filterValues.endDate),
              },
            },
          });
        } else {
          pipeline.push({
            $match: {
              createdAt: {
                $gte: new Date('2011-01-01T06:51:52.660Z'),
                $lte: new Date(`2090-01-01T06:51:52.660Z`),
              },
            },
          });
        }

        if (filterValues.level) {
          pipeline.push({
            $match: { level: filterValues.level },
          });
        }
        if (filterValues.status) {
          pipeline.push({
            $match: { status: filterValues.status },
          });
        }

        if (filterValues.resubmission) {
          pipeline.push({
            $match: { resubmission: filterValues.resubmission === 'true' },
          });
        }

        const application = await Application.aggregate(pipeline);

        return {
          msg: `Find applications result`,
          data: {
            application,
          },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to find application by id: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findByUserID: async (uid) => {
      try {
        const userId = new mongoose.Types.ObjectId(uid);
        const pipeline = [
          {
            $match: { user: userId },
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: '$approvedAmount' },
            },
          },
        ];
        const totalApprovedGrant = (await Application.aggregate(pipeline))[0]
          .totalAmount;
        const application = await Application.find({ user: uid })
          .populate({ path: 'user', select: '-password' })
          .populate('department')
          .populate('workflow')
          .populate({
            path: 'workflow',
            populate: {
              path: 'forms.form',
              model: 'Form',
            },
          })
          .populate('stages')
          .populate({
            path: 'user',
            populate: {
              path: 'designation',
              model: 'Designation',
            },
          })
          .populate({
            path: 'user',
            populate: {
              path: 'institution',
              model: 'Institution',
            },
          })
          .exec();

        let arr = [];

        // for (const element of application.workflow.forms) {
        //   const response = await Response.findOne({
        //     auid: application?._id,
        //     wuid: application?.workflow?._id,
        //     fuid: element?.form?._id,
        //   }).populate({
        //     path: 'responses.user responses.department',
        //     select: '-password', // exclude password field from User and Department documents
        //   });

        //   arr.push({
        //     form: element.form,
        //     response: response,
        //   });
        // }

        return {
          msg: `Find applications result`,
          data: {
            application,
            totalApprovedGrant: totalApprovedGrant,
          },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to find application by id: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findUsers: async (id, searchQuery, statusQuery) => {
      try {
        const application = await Application.findOne({
          _id: id,
          status: statusQuery ? statusQuery : ['active', 'inactive'],
        })
          .populate('users')
          .exec();

        return {
          msg: `Find applications result`,
          data: { application },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to find application by id: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findAllAssignedApps: async (id, searchQuery = '', statusQuery) => {
      try {
        const user = await User.findOne({
          _id: id,
          status: statusQuery ? statusQuery : ['active', 'inactive'],
        });
        const userId = user?._id; // Replace with the user ID to match
        const objectIdArray = user.applications;
        const departmentIds = [
          new mongoose.Types.ObjectId(user?.department.id),
        ]; // Replace with the department ID to match
        const roleId = user?.role; // Replace with the role ID to match

        const applications = await Application.aggregate([
          {
            $lookup: {
              from: 'workflows',
              localField: 'workflow',
              foreignField: '_id',
              as: 'workflow',
            },
          },
          {
            $match: {
              $and: [
                {
                  title: {
                    $regex: searchQuery,
                    $options: 'i', // Case-insensitive search
                  },
                },
                {
                  level: { $ne: 'draft' },
                },
                {
                  workflowUid: {
                    $in: objectIdArray,
                  },
                },
              ],
            },
          },
        ]);

        const populatedApplications = await Application.populate(applications, [
          { path: 'user' },
          { path: 'department' },
          { path: 'workflow.forms.form', model: 'Form' },
          { path: 'stages' },
        ]);

        console.log(populatedApplications.length);

        return {
          msg: `Find applications result`,
          data: { populatedApplications },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to find application by id: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findAllAssignedAppsForRegistrar: async (
      id,
      searchQuery = '',
      statusQuery
    ) => {
      try {
        const user = await User.findOne({
          _id: id,
          status: statusQuery ? statusQuery : ['active', 'inactive'],
        });
        const userId = user?._id; // Replace with the user ID to match
        const departmentIds = [
          new mongoose.Types.ObjectId(user?.department.id),
        ]; // Replace with the department ID to match
        const roleId = user?.role; // Replace with the role ID to match

        const applications = await Application.aggregate([
          {
            $lookup: {
              from: 'workflows',
              localField: 'workflow',
              foreignField: '_id',
              as: 'workflow',
            },
          },
          {
            $match: {
              $and: [
                {
                  title: {
                    $regex: searchQuery,
                    $options: 'i', // Case-insensitive search
                  },
                },
                {
                  level: { $ne: 'draft' },
                },
              ],
            },
          },
        ]);

        const populatedApplications = await Application.populate(applications, [
          { path: 'user' },
          { path: 'department' },
          { path: 'workflow.forms.form', model: 'Form' },
          { path: 'stages' },
        ]);

        console.log(populatedApplications.length);

        return {
          msg: `Find applications result`,
          data: { populatedApplications },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to find application by id: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    findAllAssignedAppsForInstitution: async (
      id,
      searchQuery = '',
      statusQuery,
      institutionId
    ) => {
      try {
        const user = await User.findOne({
          _id: id,
          status: statusQuery ? statusQuery : ['active', 'inactive'],
        });
        const userId = user?._id; // Replace with the user ID to match
        const departmentIds = [
          new mongoose.Types.ObjectId(user?.department.id),
        ]; // Replace with the department ID to match
        const roleId = user?.role; // Replace with the role ID to match
        const objectIdArray = user.applications;
        const applications = await Application.aggregate([
          {
            $lookup: {
              from: 'workflows',
              localField: 'workflow',
              foreignField: '_id',
              as: 'workflow',
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $match: {
              $and: [
                {
                  title: {
                    $regex: searchQuery,
                    $options: 'i', // Case-insensitive search
                  },
                },
                {
                  level: { $ne: 'draft' },
                },
                { 'user.institution': institutionId },
                {
                  // $or: [
                  //   { 'workflow.approvals.approvalBy.user': userId },
                  //   {
                  //     $and: [
                  //       {
                  //         'workflow.approvals.approvalBy.department': {
                  //           $in: departmentIds,
                  //         },
                  //       },
                  //       {
                  //         'workflow.approvals.approvalBy.role': roleId,
                  //       },
                  //     ],
                  //   },
                  // ],
                  workflowUid: {
                    $in: objectIdArray,
                  },
                },
              ],
            },
          },
        ]);

        const populatedApplications = await Application.populate(applications, [
          { path: 'user' },
          { path: 'department' },
          { path: 'workflow.forms.form', model: 'Form' },
        ]);

        console.log(populatedApplications.length);

        return {
          msg: `Find applications result`,
          data: { populatedApplications },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to find application by id: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    updateApproval: async ({ id, params }) => {
      try {
        const Params = load(params);
        // if (Params.updateParams.status === 'approved') {
        //   const updateWorkflow = await Workflow.findByIdAndUpdate(id, {});
        // }
        const update = await Application.findByIdAndUpdate(id, {
          $set: { users: Params.updateParams.users },
        });
        return {
          msg: `Updated application details successfully`,
          data: {},
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to update mood details: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    addUsers: async ({ id, params }) => {
      try {
        const Params = load(params);
        const update = await Application.findByIdAndUpdate(id, {
          $set: { users: Params.updateParams.users },
        });
        return {
          msg: `Updated application details successfully`,
          data: {},
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to update mood details: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    removeUser: async ({ id, userid }) => {
      try {
        const update = await Application.findByIdAndUpdate(id, {
          $pull: { users: userid },
        });

        return {
          msg: `Updated application details successfully`,
          data: {},
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to update mood details: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    deleteById: async (id) => {
      try {
        const res = await Application.deleteOne({ _id: id });
        if (res.deletedCount !== 1) {
          throw Error('Application not deleted.');
        }

        return {
          msg: `delete application`,
          data: {},
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error(
          'Failed to delete mood by uid: %s %s',
          error.message,
          error
        );
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    registrarReport: async (userUID) => {
      try {
        let applications = await Application.aggregate([
          {
            $match: {
              level: 'approved',
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              totalApprovedAmount: { $sum: '$approvedAmount' },
            },
          },
          {
            $project: {
              _id: 0,
              count: 1,
              totalApprovedAmount: 1,
            },
          },
        ]);

        let totalApplications = await Application.aggregate([
          {
            $group: {
              _id: 1,
              total: {
                $sum: {
                  $cond: [{ $ne: ['$level', 'draft'] }, 1, 0],
                },
              },
              approved: {
                $sum: {
                  $cond: [{ $eq: ['$level', 'approved'] }, 1, 0],
                },
              },
              rWaiting: {
                $sum: {
                  $cond: [{ $eq: ['$resubmission', true] }, 1, 0],
                },
              },
              waiting: {
                $sum: {
                  $cond: [{ $eq: ['$level', 'waiting'] }, 1, 0],
                },
              },
              rejected: {
                $sum: {
                  $cond: [{ $eq: ['$level', 'rejected'] }, 1, 0],
                },
              },
              onHold: {
                $sum: {
                  $cond: [{ $eq: ['$level', 'on-hold'] }, 1, 0],
                },
              },
            },
          },
        ]);

        let institutions = await Institution.find();
        const institutionArray = [];

        for (let index = 0; index < institutions.length; index++) {
          const element = institutions[index];
          const applications = await Application.aggregate([
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
              },
            },
            {
              $unwind: '$user',
            },
            {
              $match: {
                'user.institution': element._id,
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                totalApprovedAmount: { $sum: '$approvedAmount' },
              },
            },
            {
              $project: {
                _id: 0,
                count: 1,
                totalApprovedAmount: 1,
              },
            },
          ]);
          institutionArray.push({
            name: element.name,
            count: applications[0] || {},
          });
        }

        return {
          msg: `Find applications result`,
          data: {
            applications,
            institutionArray,
            registrar: totalApplications[0] || {},
          },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find mood by uid: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
    financeReport: async (userUID) => {
      const user = await User.findOne({ _id: userUID });
      const objectIdArray = user.applications;
      try {
        let applications = await Application.aggregate([
          {
            $match: {
              level: 'approved',
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              totalApprovedAmount: { $sum: '$approvedAmount' },
            },
          },
          {
            $project: {
              _id: 0,
              count: 1,
              totalApprovedAmount: 1,
            },
          },
        ]);

        let totalApplications = await Application.aggregate([
          {
            $match: {
              workflowUid: {
                $in: objectIdArray,
              },
            },
          },
          {
            $group: {
              _id: 1,
              total: {
                $sum: {
                  $cond: [{ $ne: ['$level', 'draft'] }, 1, 0],
                },
              },
              approved: {
                $sum: {
                  $cond: [{ $eq: ['$level', 'approved'] }, 1, 0],
                },
              },
              rWaiting: {
                $sum: {
                  $cond: [{ $eq: ['$resubmission', true] }, 1, 0],
                },
              },
              waiting: {
                $sum: {
                  $cond: [{ $eq: ['$level', 'waiting'] }, 1, 0],
                },
              },
              rejected: {
                $sum: {
                  $cond: [{ $eq: ['$level', 'rejected'] }, 1, 0],
                },
              },
              onHold: {
                $sum: {
                  $cond: [{ $eq: ['$level', 'on-hold'] }, 1, 0],
                },
              },
            },
          },
        ]);

        let institutions = await Institution.find();
        const institutionArray = [];

        for (let index = 0; index < institutions.length; index++) {
          const element = institutions[index];
          const applications = await Application.aggregate([
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
              },
            },
            {
              $unwind: '$user',
            },
            {
              $match: {
                workflowUid: {
                  $in: objectIdArray,
                },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                totalApprovedAmount: { $sum: '$approvedAmount' },
              },
            },
            {
              $project: {
                _id: 0,
                count: 1,
                totalApprovedAmount: 1,
              },
            },
          ]);
          institutionArray.push({
            name: element.name,
            count: applications[0] || {},
          });
        }

        return {
          msg: `Find applications result`,
          data: {
            applications,
            institutionArray,
            finance: totalApplications[0] || {},
          },
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find mood by uid: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },

    findAllScript: async (page, limit, searchQuery = '', statusQuery) => {
      try {
        let applications = await Application.find()
          .sort({ _id: -1 })
          .populate('user')
          .populate('department')
          .populate('workflow')
          .populate({
            path: 'user',
            populate: {
              path: 'institution',
              model: 'Institution',
            },
          })
          .exec();

        const res = await Application.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              approved: {
                $sum: {
                  $cond: [{ $eq: ['$level', 'approved'] }, 1, 0],
                },
              },
              rejected: {
                $sum: {
                  $cond: [{ $eq: ['$level', 'rejected'] }, 1, 0],
                },
              },
              onHold: {
                $sum: {
                  $cond: [{ $eq: ['$level', 'on-hold'] }, 1, 0],
                },
              },
              lastMonth: {
                $sum: {
                  $cond: [
                    {
                      $gt: [
                        '$createdAt',
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
              lastQuarter: {
                $sum: {
                  $cond: [
                    {
                      $gt: [
                        '$createdAt',
                        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ]);

        applications = paginate(applications, page, limit);
        applications.total = res[0]?.total;
        applications.approved = res[0]?.approved;
        applications.rejected = res[0]?.rejected;
        applications.onHold = res[0]?.onHold;
        applications.lastMonth = res[0]?.lastMonth;
        applications.lastQuarter = res[0]?.lastQuarter;
        return {
          msg: `Find applications result`,
          data: applications,
        };
      } catch (error) {
        if (error instanceof CreateError) {
          throw error;
        }
        logger.error('Failed to find mood by uid: %s %s', error.message, error);
        throw Error(translate(lang, 'unknown_error_contact_support'));
      }
    },
  });
};
function unload(params) {
  const data = {
    title: params.title,
    user: params.user,
    status: params.status,
    level: params.level,
    department: params.department,
    workflow: params.workflow,
    workflowUid: params.workflowUid,
    comments: params.comments,
    activities: params.activities,
    currentApprover: params.currentApprover,
    stages: params.stages,
    order: params.order,
    resubmission: params.resubmission,
    approvedAmount: params.approvedAmount,
    _id: params._id,
    createdAt: params.createdAt,
    totalApplications: params.totalApplications,
  };

  return data;
}

function load(fields) {
  // param map

  const paramsMap = {
    title: 'title',
    user: 'user',
    status: 'status',
    level: 'level',
    department: 'department',
    workflow: 'workflow',
    workflowUid: 'workflowUid',
    comments: 'comments',
    currentApprover: 'currentApprover',
    stages: 'stages',
    resubmission: 'resubmission',
    order: 'order',
    approvedAmount: 'approvedAmount',
    activities: 'activities',
    createdAt: 'createdAt',
  };

  let updateParams = {};

  for (const param in fields) {
    const key = paramsMap[param];
    updateParams[key] = fields[param];
  }

  return { updateParams };
}
