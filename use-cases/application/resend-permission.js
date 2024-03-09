const fromEntities = require('../../entity');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
exports.ResendPermission = ({
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

        const res = await ApplicationFunction.findById(id);
        const application = res.data.application;

        const loggedInApproverID = application.workflow.approvals[0].approvalBy;

        let loggedInApprover = {};

        if (loggedInApproverID.user) {
          loggedInApprover = (
            await UserFunction.findById(loggedInApproverID.user)
          ).data.user;
        } else {
          loggedInApprover = (
            await UserFunction.findByDepartmentRole({
              'department.id': loggedInApproverID.department,
              role: loggedInApproverID.role,
            })
          ).data.user;
        }

        const applicant = (await UserFunction.findById(application.user)).data
          .user;

        if (application.level === 'approved') {
          let attachments = [];
          for (let form_data of application?.workflow?.forms || []) {
            let form = form_data?.form;
            let response = form_data?.response;
            if (!form) continue;

            if (
              form?.title !==
                'FINANCIAL ASSISTANCE TO FACULTY MEMBERS FOR PRESENTATION / INVITED TALK / ORATION / GUEST SPEAKER / RESOURCE PERSON ONCE IN A THREE YEAR OUTSIDE INDIA' &&
              form?.title !==
                'ASSISTANCE TO FACULTY MEMBERS FOR PRESENTATION / INVITED TALK / ORATION / GUEST SPEAKER / RESOURCE PERSON ONCE IN A YEAR WITHIN INDIA'
            )
              continue;

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
              if (answer?.quid == event_to_date_id) event_to_date = answer.date;
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
              to: request.body.email ? request.body.email : applicant.email,
              applicationName: application.title,
              workflowName: application.workflow.name,
              applicantName: `${applicant.firstName} ${applicant.secondName}`,
              approverName: `${loggedInApprover.firstName} ${loggedInApprover.secondName}`,
              approvedAmount: application.approvedAmount,
              type: 'ApplicationApprovedForApplicant',
              attachments: attachments,
            },
          });
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
