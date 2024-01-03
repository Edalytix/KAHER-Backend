const fromEntities = require('../../entity');
const { ObjectId } = require('mongodb');

exports.ApprovalUpdate = ({
  CreateError,
  DataValidator,
  logger,
  translate,
  crypto,
  request,
  db,
  accessManager,
  mailer,
  docGenrator,
}) => {
  return Object.freeze({
    execute: async () => {
      try {
        const lang = request.locals.lang;
        const email = request.locals.email;
        const userUID = request.locals.uid;
        const role = request.locals.role;
        let id = request.queryParams.id;

        // const acesssRes = await accessManager({
        //   translate,
        //   logger,
        //   CreateError,
        //   lang,
        //   role,
        //   db,
        //   useCase: 'applications:edit',
        // });
        // if (!acesssRes) {
        //   throw new CreateError(translate(lang, 'forbidden'), 403);
        // }

        const ApplicationFunction = db.methods.Application({
          translate,
          logger,
          CreateError,
          lang,
        });

        const UserFunction = db.methods.User({
          translate,
          logger,
          CreateError,
          lang,
        });

        const WorkflowFunction = db.methods.Workflow({
          translate,
          logger,
          CreateError,
          lang,
        });

        const res = await ApplicationFunction.findById(id);
        const application = res.data.application;
        console.log(application.workflow.name);

        let currentApprover = 0;
        let approveGrant = false;

        const Workflow = (
          await WorkflowFunction.findById(res.data.application.workflow._id)
        ).data.workflow;
        let approver = {};

        for (const element of Workflow.approvals) {
          approveGrant = element.approveGrant;
          if (element.approvalBy.user) {
            if (element.approvalBy.user._id.toString() == userUID.toString()) {
              currentApprover = element.sequence;
              break;
            }
          } else {
            const user = await UserFunction.findByParams({
              _id: new ObjectId(userUID),
              role: element.approvalBy.role._id,
              'department.id': element.approvalBy.department._id.toString(),
            });

            if (user.data.length !== 0) {
              currentApprover = element.sequence;
              approver = user;
              break;
            }
          }
        }
        if (currentApprover !== application.currentApprover) {
          throw new CreateError(translate(lang, 'forbidden'), 403);
        }

        const StatusFunction = db.methods.Status({
          translate,
          logger,
          CreateError,
          lang,
        });

        const status = (await StatusFunction.findById(id)).data.status;

        const actionBody = {
          name: null,
          uid: userUID,
          content: null,
          type: null,
          referlink: [],
        };

        const loggedInApprover = (await UserFunction.findById(userUID)).data
          .user;

        const applicant = (await UserFunction.findById(application.user)).data
          .user;

        if (request.body.approval === 'approved') {
          if (approveGrant) {
            const res = await ApplicationFunction.update({
              id,
              params: {
                approvedAmount: request.body.approvedAmount,
              },
            });
          }
          if (application.currentApprover === Workflow.totalApprovers) {
            const res = await ApplicationFunction.update({
              id,
              params: {
                level: 'approved',
              },
            });

            let status = await StatusFunction.update(
              id,
              currentApprover,
              'status',
              'approved'
            );

            status = await StatusFunction.update(
              id,
              currentApprover + 1,
              'status',
              'approved'
            );

            let attachments = [];
            for (let form_data of application?.workflow?.forms || []) {
              let form = form_data?.form;
              let response = form_data?.response;
              if (!form) continue;

              if ((form?.title !== "FINANCIAL ASSISTANCE TO FACULTY MEMBERS FOR PRESENTATION / INVITED TALK / ORATION / GUEST SPEAKER / RESOURCE PERSON ONCE IN A THREE YEAR OUTSIDE INDIA") && (form?.title !== "ASSISTANCE TO FACULTY MEMBERS FOR PRESENTATION / INVITED TALK / ORATION / GUEST SPEAKER / RESOURCE PERSON ONCE IN A YEAR WITHIN INDIA")) continue

              let event_title_id = null;
              let event_place_id = null;
              let event_from_date_id = null;
              let event_to_date_id = null;
              for (let question_data of form?.questions || []) {
                if (question_data.question == 'Title of the Event')
                  event_title_id = String(question_data._id);
                if (question_data.question == 'Place/Venue of the Event')
                  event_place_id = String(question_data._id);
                if (question_data.question == 'From Date -')
                  event_from_date_id = String(question_data._id);
                if (question_data.question == 'To Date -')
                  event_to_date_id = String(question_data._id);
              }

              let event_title = null;
              let event_place = null;
              let event_from_date = null;
              let event_to_date = null;
              for (let answer of response?.responses || []) {
                if (answer?.quid == event_title_id) event_title = answer.string;
                if (answer?.quid == event_place_id) event_place = answer.string;
                if (answer?.quid == event_from_date_id)
                  event_from_date = answer.date;
                if (answer?.quid == event_to_date_id)
                  event_to_date = answer.date;
              }

              const currentDate = new Date();
              const options = {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              };
              const formattedDate = new Intl.DateTimeFormat(
                'en-US',
                options
              ).format(currentDate);

              let genratedDoc = await docGenrator.financialAssistanceDoc({
                approved_date: formattedDate,
                college: applicant?.institution?.name,
                fullName: `${applicant.firstName} ${applicant.secondName}`,
                designation: applicant?.designation?.name,
                department: applicant?.department?.name,
                event_title: event_title,
                event_place: event_place,
                duration:
                  event_from_date && event_to_date
                    ? `from ${new Intl.DateTimeFormat('en-US', options).format(
                      event_from_date
                    )} to ${new Intl.DateTimeFormat('en-US', options).format(
                      event_to_date
                    )}`
                    : null,
              });

              attachments.push({
                filename: id + '.pdf',
                content: genratedDoc.buffer,
              });
            }

            const mail = await mailer({
              CreateError,
              translate,
              logger,
              lang,
              lang: request.locals.lang,
              params: {
                to: applicant.email,
                applicationName: application.title,
                workflowName: application.workflow.name,
                applicantName: `${applicant.firstName} ${applicant.secondName}`,
                approverName: `${loggedInApprover.firstName} ${loggedInApprover.secondName}`,
                approvedAmount: application.approvedAmount,
                type: 'ApplicationApprovedForApplicant',
                attachments: attachments,
              },
            });

            for (const element of Workflow.approvals) {
              if (element.approvalBy.user) {
                const approver = (
                  await UserFunction.findById(element.approvalBy.user._id)
                ).data.user;
                const mail = await mailer({
                  CreateError,
                  translate,
                  logger,
                  lang,
                  lang: request.locals.lang,
                  params: {
                    to: approver.email,
                    applicationName: application.title,
                    workflowName: application.workflow.name,
                    approverName: `${approver.firstName} ${approver.secondName}`,
                    approvedAmount: application.approvedAmount,
                    type: 'ApplicationApprovedForApprover',
                  },
                });
              } else {
                const approvers = await UserFunction.findByParams({
                  role: element.approvalBy.role._id,
                  'department.id': element.approvalBy.department._id.toString(),
                  institution: applicant?.institution?._id
                });
                approvers.data.forEach(async (element) => {
                  const mail = await mailer({
                    CreateError,
                    translate,
                    logger,
                    lang,
                    lang: request.locals.lang,

                    params: {
                      to: element.email,
                      applicationName: application.title,
                      workflowName: application.workflow.name,
                      approverName: `${element.firstName} ${element.secondName}`,
                      approvedAmount: application.approvedAmount,
                      type: 'ApplicationApprovedForApprover',
                    },
                  });
                });
              }
            }
          } else {
            const res = await ApplicationFunction.update({
              id: application._id,
              params: {
                currentApprover: application.currentApprover + 1,
                level: 'waiting',
              },
            });

            const status = await StatusFunction.update(
              id,
              currentApprover,
              'status',
              'approved'
            );
            const mail = await mailer({
              CreateError,
              translate,
              logger,
              lang,
              lang: request.locals.lang,
              params: {
                to: applicant.email,
                applicationName: application.title,
                workflowName: application.workflow.name,
                currentApproverName: `${loggedInApprover.firstName} ${loggedInApprover.secondName}`,
                applicantName: `${applicant.firstName} ${applicant.secondName}`,
                type: 'ApplicationStatusChangeForApplicant',
              },
            });

            for (const element of Workflow.approvals) {
              if (element.approvalBy.user) {
                const approver = (
                  await UserFunction.findById(element.approvalBy.user._id)
                ).data.user;
                const mail = await mailer({
                  CreateError,
                  translate,
                  logger,
                  lang,
                  lang: request.locals.lang,
                  params: {
                    to: approver.email,
                    applicationName: application.title,
                    workflowName: application.workflow.name,
                    currentApproverName: `${loggedInApprover.firstName} ${loggedInApprover.secondName}`,
                    approverName: `${approver.firstName} ${approver.secondName}`,
                    type: 'ApplicationStatusChangeForApprover',
                  },
                });
              } else {
                const approvers = await UserFunction.findByParams({
                  role: element.approvalBy.role._id,
                  'department.id': element.approvalBy.department._id.toString(),
                  institution: applicant?.institution?._id
                });
                approvers.data.forEach(async (element) => {
                  const mail = await mailer({
                    CreateError,
                    translate,
                    logger,
                    lang,
                    lang: request.locals.lang,
                    params: {
                      to: element.email,
                      applicationName: application.title,
                      workflowName: application.workflow.name,
                      currentApproverName: `${loggedInApprover.firstName} ${loggedInApprover.secondName}`,
                      approverName: `${element.firstName} ${element.secondName}`,
                      type: 'ApplicationStatusChangeForApprover',
                    },
                  });
                });
              }
            }
          }
        } else if (request.body.approval === 'rejected') {
          const res = await ApplicationFunction.update({
            id,
            params: {
              level: 'rejected',
            },
          });

          const status = await StatusFunction.update(
            id,
            currentApprover,
            'status',
            'rejected'
          );
          const CommentFunction = db.methods.Comment({
            translate,
            logger,
            CreateError,
            lang,
          });
          let rejectedReason = '';
          const comment = (await CommentFunction.findById(application._id)).data
            .comment;
          if (comment) {
            comment.actions.forEach((element) => {
              if (element.type === 'rejection') {
                rejectedReason = element.content;
              }
            });
          }
          const mail = await mailer({
            CreateError,
            translate,
            logger,
            lang,
            lang: request.locals.lang,
            params: {
              to: applicant.email,
              applicationName: application.title,
              workflowName: application.workflow.name,
              applicantName: `${applicant.firstName} ${applicant.secondName}`,
              rejecterName: `${loggedInApprover.firstName} ${loggedInApprover.secondName}`,
              rejectionReason: rejectedReason,
              type: 'ApplicationRejectedForApplicant',
            },
          });

          for (const element of Workflow.approvals) {
            if (element.approvalBy.user) {
              const approver = (
                await UserFunction.findById(element.approvalBy.user._id)
              ).data.user;
              const mail = await mailer({
                CreateError,
                translate,
                logger,
                lang,
                lang: request.locals.lang,
                params: {
                  to: approver.email,
                  applicationName: application.title,
                  workflowName: application.workflow.name,
                  approverName: `${approver.firstName} ${approver.secondName}`,
                  rejecterName: `${loggedInApprover.firstName} ${loggedInApprover.secondName}`,
                  rejectionReason: rejectedReason,
                  type: 'ApplicationRejectedForApprover',
                },
              });
            } else {
              const approvers = await UserFunction.findByParams({
                role: element.approvalBy.role._id,
                'department.id': element.approvalBy.department._id.toString(),
                institution: applicant?.institution?._id
              });
              approvers.data.forEach(async (element) => {
                const mail = await mailer({
                  CreateError,
                  translate,
                  logger,
                  lang,
                  lang: request.locals.lang,

                  params: {
                    to: element.email,
                    applicationName: application.title,
                    workflowName: application.workflow.name,
                    approverName: `${element.firstName} ${element.secondName}`,
                    rejecterName: `${loggedInApprover.firstName} ${loggedInApprover.secondName}`,
                    rejectionReason: rejectedReason,
                    type: 'ApplicationRejectedForApprover',
                  },
                });
              });
            }
          }
        } else if (request.body.approval === 'on-hold') {
          const res = await ApplicationFunction.update({
            id,
            params: {
              level: 'on-hold',
            },
          });

          const status = await StatusFunction.update(
            id,
            currentApprover,
            'status',
            'on-hold'
          );
        } else {
          throw new CreateError('Invalid operation', 403);
        }

        return {
          msg: translate(lang, 'created_mood'),
          data: { res },
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
