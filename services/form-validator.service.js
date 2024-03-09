'use strict';
const moment = require('moment');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

/*
    Validates the filed and normalizes the data
*/
const roles = {
  admin: 'Administrator',
  superadmin: 'Super administrator',
  patient: 'Patients',
  doctor: 'Doctors',
  staff: 'Internal staff',
};

const questionTypes = {
  text: 'Text based questions',
  single: 'Single answer questions with options',
  multi: 'Muli answer questions with options',
};

const consultationStatusEnum = {
  open: 'Open appointments for doctors booking',
  scheduled: 'Consultations available for the doctors',
  review: 'Consultations under review',
  completed: 'Consultations completed',
  cancelled: 'Consultations cancelled',
};

const inviteTypeEnum = {
  INCOMING: 'Incoming calls',
  OUTGOING: 'Outgoing calls',
};

exports.DataValidator = ({ CreateError, lang, translate }) => {
  return Object.freeze({
    //Kaher App
    name(x) {
      x = String(x);
      if (/^\D{3,200}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_firstname'), 422);
      }
    },
    status(x) {
      x = String(x).trim();
      const options = ['active', 'inactive'];
      if (options.includes(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_goal_status'), 422);
      }
    },
    level(x) {
      x = String(x).trim();
      const options = ['draft', 'published'];
      if (options.includes(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_goal_status'), 422);
      }
    },
    applicationlevel(x) {
      x = String(x).trim();
      const options = ['approved', 'rejected', 'waiting', 'draft', 'rWaiting'];
      if (options.includes(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_goal_status'), 422);
      }
    },
    activitylevel(x) {
      x = String(x).trim();
      const options = ['status change', 'comment'];
      if (options.includes(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_goal_status'), 422);
      }
    },
    ifsc(x) {
      x = String(x);
      if (/^[\s\S]{6,15}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_ifsc'), 422);
      }
    },
    userType(x) {
      x = String(x).trim();
      const options = ['admin', 'user'];
      if (options.includes(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_goal_status'), 422);
      }
    },
    permissions(x) {
      x = String(x).trim();
      const options = ['view', 'edit', 'none'];
      if (options.includes(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_goal_status'), 422);
      }
    },
    uuid(x) {
      if (
        /^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$/.test(
          x
        )
      ) {
        return { msg: 'Valid', data: { value: x } };
      }
      throw new CreateError(translate(lang, 'invalid_uid'), 422);
    },
    firstname(x) {
      x = String(x);
      if (/^\D{1,100}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_firstname'), 422);
      }
    },
    secondname(x) {
      x = String(x);
      if (/^\D{1,100}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_secondname'), 422);
      }
    },
    role(x) {
      x = String(x);
      if (/^\D{1,20}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_secondname'), 422);
      }
    },
    email(x) {
      x = String(x).toLowerCase().trim();
      if (/^([+.-\w]+)([@])([\w+.-]+\w)([.])(\w+)$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_email'), 422);
      }
    },
    mongoid(x) {
      if (mongoose.Types.ObjectId.isValid(x)) {
        return { msg: 'Valid', data: { value: new ObjectId(x) } };
      } else {
        throw new CreateError(translate(lang, 'invalid_salute'), 422);
      }
    },
    password(x) {
      x = String(x).trim();
      if (
        x.match(/[a-z]/g) &&
        x.match(/[A-Z]/g) &&
        x.match(/[0-9]/g) &&
        x.match(/[^a-zA-Z\d]/g) &&
        x.length >= 8 &&
        x.length <= 30
      ) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(
          translate(lang, 'invalid_password_criteria'),
          422
        );
      }
    },
    title(x) {
      x = String(x);
      if (/^[\s\S]{2,300}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_title'), 422);
      }
    },
    content(x) {
      x = String(x);
      if (/^[\s\S]{1,300}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_firstname'), 422);
      }
    },
    actionType(x) {
      x = String(x).trim();
      const options = ['activity', 'comment', 'approval', 'rejection'];
      if (options.includes(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_goal_status'), 422);
      }
    },
    activity(x) {
      x = String(x);
      if (/^\D{3,200}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_firstname'), 422);
      }
    },
    timestamp(x) {
      const dateString = new Date(x);
      if (dateString === 'Invalid Date') {
        throw new CreateError(translate(lang, 'invalid_timestamp'), 422);
      }

      const time = new Date(x).getTime();
      if (isNaN(time)) {
        throw new CreateError(translate(lang, 'invalid_timestamp'), 422);
      }

      return {
        msg: 'Valid',
        data: { value: moment(new Date(dateString)).toISOString() },
      };
    },
    validateQuestion(x) {
      x.question = String(x.question);
      if (!/^[\s\S]{3,1000}$/.test(x.question)) {
        throw new CreateError(translate(lang, 'invalid_title'), 422);
      }
      if (!/^[\s\S]{0,1000}$/.test(x.label)) {
        throw new CreateError(translate(lang, 'invalid_title'), 422);
      }
      if (typeof x.required !== 'boolean') {
        throw new Error(
          'Label and Value must be between 3 and 20 characters long'
        );
      }
      if (x.options) {
        x.options.forEach((element) => {
          this.validateFormQuestionOption(element);
        });
      }
      return { msg: 'Valid', data: { value: x } };
    },
    responses(x) {
      x.type = String(x.type).trim();
      const options = [
        'string',
        'file',
        'number',
        'date',
        'singleChoice',
        'dropDown',
        'multipleChoice',
        'longString',
        'department',
        'user',
        'doi',
        'array',
      ];
      if (!options.includes(x.type)) {
        throw new CreateError(translate(lang, 'invalid_goal_status'), 422);
      }
      if (x.string) {
        this.questionResponseString(x.string);
      }
      if (x.longString) {
        this.questionResponseLongString(x.longString);
      }
      if (x.number) {
        if (isNaN(x.number)) {
          throw new CreateError(translate(lang, 'invalid_title'), 422);
        }
      }
      if (x.date) {
        var date = new Date(x.date);
        if (isNaN(date.getTime())) {
          throw new CreateError(translate(lang, 'invalid_title'), 422);
        }
      }
      if (x.singeleChoice) {
        this.validateFormQuestionOption(x.singeleChoice);
      }
      if (x.multipleChoice) {
        x.multipleChoice.forEach((element) => {
          this.validateFormQuestionOption(element);
        });
      }
      return { msg: 'Valid', data: { value: x } };
    },
    questionResponseString(x) {
      x = String(x);
      if (/^[\s\S]{1,1000}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_title'), 422);
      }
    },
    questionResponseLongString(x) {
      x = String(x);
      if (/^[\s\S]{3,1000}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_title'), 422);
      }
    },
    validateFormQuestionOption(x) {
      if (
        typeof x !== 'object' ||
        x === null ||
        typeof x.id !== 'number' ||
        typeof x.value !== 'string'
      ) {
        throw new Error('Invalid input');
      }

      const trimmedValue = x.value.trim();

      if (trimmedValue.length < 1 || trimmedValue.length > 1000) {
        throw new Error('Value must be between 1 and 20 characters long');
      }
      return { msg: 'Valid', data: { value: x } };
    },
    boolean(x) {
      x = Boolean(x);
      return { msg: 'Valid', data: { value: x } };
    },
    number(x) {
      if (isNaN(x)) {
        throw new CreateError(translate(lang, 'invalid_title'), 422);
      }
      return { msg: 'Valid', data: { value: x } };
    },

    //Breakdown

    salute(x) {
      if (/^(Mr\.|Mrs\.|other)$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_salute'), 422);
      }
    },

    language(x) {
      x = String(x).toLowerCase().trim();
      if (x === 'de' || x === 'en' || x === 'ru' || x === 'tr') {
        return { msg: 'Valid', data: { value: x } };
      }
      throw new CreateError(translate(lang, 'invalid_lang'), 422);
    },
    dob(x) {
      if (
        /^(?:\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}\/\d{2}\/\d{4})$/.test(
          x
        )
      ) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_dob'), 422);
      }
    },
    phone(x) {
      if (/^[0-9]{1}[0-9]{6,16}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_phone'), 422);
      }
    },
    address(x) {
      x = String(x);
      if (x.length < 150) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_address'), 422);
      }
    },
    city(x) {
      x = String(x);
      if (x.length < 50) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_city'), 422);
      }
    },
    state(x) {
      x = String(x);
      if (x.length < 50) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_state'), 422);
      }
    },
    country(x) {
      x = String(x);
      if (x.length < 50) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_country'), 422);
      }
    },
    postalCode(x) {
      if (/^[0-9]{3,8}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_postal'), 422);
      }
    },
    role(x) {
      x = String(x).trim();
      if (roles.hasOwnProperty(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_role'), 422);
      }
    },
    specialization(x) {
      if (Array.isArray(x)) {
        if (x.length === 0) {
          throw new CreateError(
            translate(lang, 'required_specialization'),
            422
          );
        }
        if (x.length > 10) {
          throw new CreateError(
            translate(lang, 'too_many_specializations'),
            422
          );
        }
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_datatype_array'), 422);
      }
    },
    biography(x) {
      x = String(x).trim();
      if (/^\D{3,400}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      }
      throw new CreateError(translate(lang, 'invalid_biography'), 422);
    },
    qualification(x) {
      x = String(x);
      if (/^\D{3,100}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_qualification'), 422);
      }
    },
    experience(x) {
      if (/^[0-9]*$/.test(x)) {
        return { msg: 'Valid', data: { value: parseInt(x) } };
      }
      throw new CreateError(translate(lang, 'invalid_experience'), 422);
    },
    lanr(x) {
      x = String(x).trim();
      if (/^[\D\d]{9}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      }
      throw new CreateError(translate(lang, 'invalid_lanr'), 422);
    },
    bsnr(x) {
      x = String(x).trim();
      if (/^[\D\d]{9}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      }
      throw new CreateError(translate(lang, 'invalid_bsnr'), 422);
    },
    url(x) {
      if (/^(https:\/\/)[\w\W]*$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      }
      throw new CreateError(translate(lang, 'invalid_url'), 422);
    },
    boolean(x) {
      x = Boolean(x);
      return { msg: 'Valid', data: { value: x } };
    },
    fullname(x) {
      x = String(x);
      if (/^\D{3,50}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_fullname'), 422);
      }
    },
    link(x) {
      x = String(x);
      if (/https?:\/\/[^\s/$.?#].[^\s]*/g.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_link'), 422);
      }
    },
    conversationId(x) {
      x = String(x);
      if (/^[\D\d]{3,50}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_conversation_id'), 422);
      }
    },
    toString(x) {
      x = String(x);
      if (/^[\d\D]{1,1000}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_string'), 422);
      }
    },
    categories(x) {
      if (Array.isArray(x)) {
        if (x.length === 0) {
          throw new CreateError(translate(lang, 'required_category'), 422);
        }
        if (x.length > 50) {
          throw new CreateError(translate(lang, 'too_many_categories'), 422);
        }
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_datatype_array'), 422);
      }
    },
    documents(x) {
      if (Array.isArray(x)) {
        if (x.length === 0) {
          throw new CreateError(translate(lang, 'required_documents'), 422);
        }
        if (x.length > 50) {
          throw new CreateError(translate(lang, 'too_many_documents'), 422);
        }
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_datatype_array'), 422);
      }
    },
    validateDocument(x) {
      return new Promise((resolve, reject) => {
        if (x.hasOwnProperty('url') && x.hasOwnProperty('name')) {
          resolve({
            url: x.url,
            name: String(x.name),
          });
        } else {
          reject(translate(lang, 'required_document_details'));
        }
      });
    },
    validateTranslation(item) {
      return new Promise((resolve, reject) => {
        if (item.hasOwnProperty('en') && item.hasOwnProperty('de')) {
          if (!item.en) {
            reject(translate(lang, 'required_en_translation'));
          }
          if (!item.de) {
            reject(translate(lang, 'required_de_translation'));
          }
          resolve(item);
        } else {
          reject(translate(lang, 'required_translations'));
        }
      });
    },
    categories(x) {
      if (Array.isArray(x)) {
        if (x.length === 0) {
          throw new CreateError(translate(lang, 'required_category'), 422);
        }
        if (x.length > 50) {
          throw new CreateError(translate(lang, 'too_many_categories'), 422);
        }
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_datatype_array'), 422);
      }
    },
    documents(x) {
      if (Array.isArray(x)) {
        if (x.length === 0) {
          throw new CreateError(translate(lang, 'required_documents'), 422);
        }
        if (x.length > 50) {
          throw new CreateError(translate(lang, 'too_many_documents'), 422);
        }
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_datatype_array'), 422);
      }
    },
    validateDocument(x) {
      return new Promise((resolve, reject) => {
        if (x.hasOwnProperty('url') && x.hasOwnProperty('name')) {
          resolve({
            url: x.url,
            name: String(x.name),
          });
        } else {
          reject(translate(lang, 'required_document_details'));
        }
      });
    },
    validateTranslation(item) {
      return new Promise((resolve, reject) => {
        if (item.hasOwnProperty('en') && item.hasOwnProperty('de')) {
          if (!item.en) {
            reject(translate(lang, 'required_en_translation'));
          }
          if (!item.de) {
            reject(translate(lang, 'required_de_translation'));
          }
          resolve(item);
        } else {
          reject(translate(lang, 'required_translations'));
        }
      });
    },
    question(item) {
      return new Promise((resolve, reject) => {
        let validItem = {};

        if (item.type) {
          // validItem.type = await this.validateTranslation(item.type)
          //     .catch(error => { throw new CreateError(error) });
          validItem.type = item.type;
        } else {
          reject(translate(lang, 'required_question_type'));
        }

        if (item.question) {
          // validItem.question = await this.validateTranslation(item.question)
          //     .catch(error => { throw new CreateError(error) });
          validItem.question = item.question;
        } else {
          reject(translate(lang, 'required_question'));
        }

        if (item.type === 'single' || item.type === 'multi') {
          if (item.options) {
            if (Array.isArray(item.options)) {
              if (item.options.length === 0) {
                reject(translate(lang, 'required_options'));
              }
              if (item.options.length > 10) {
                reject(translate(lang, 'too_many_options'));
              }
              validItem.options = item.options;
            } else {
              reject(translate(lang, 'invalid_datatype_array'));
            }
          } else {
            reject(translate(lang, 'required_options'));
          }
        }

        resolve(validItem);
      });
    },
    questionResult(x) {
      x = String(x).trim();
      const answerOptions = ['Green', 'Red', 'Yellow'];
      if (answerOptions.includes(x) !== -1) {
        return { msg: 'Valid', data: { value: x } };
      }
      throw new CreateError(translate(lang, 'invalid_option'), 422);
    },
    timerange(x) {
      if (Array.isArray(x)) {
        if (x.length !== 2) {
          throw new CreateError(
            translate(lang, 'data_missing_time_range'),
            422
          );
        }

        const current = new Date().getTime();

        const from = new Date(x[0]).getTime();
        const to = new Date(x[1]).getTime();

        if (isNaN(from)) {
          throw new CreateError(translate(lang, 'invalid_from_range'), 422);
        }
        if (isNaN(to)) {
          throw new CreateError(translate(lang, 'invalid_to_range'), 422);
        }

        if (from < current) {
          throw new CreateError(translate(lang, 'invalid_from_past'), 422);
        }

        if (to < from) {
          throw new CreateError(translate(lang, 'invalid_to_range'), 422);
        }

        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_time_range'), 422);
      }
    },
    treatmentId(x) {
      const id = parseInt(x);
      if (isNaN(id)) {
        throw new CreateError(translate(lang, 'invalid_treatment_id'), 422);
      } else {
        return { msg: 'Valid', data: { value: id } };
      }
    },
    preferredLanguages(x) {
      if (Array.isArray(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_lang_preference'), 422);
      }
    },
    langArray(item) {
      return new Promise((resolve, reject) => {
        if (
          item.hasOwnProperty('en') &&
          item.hasOwnProperty('de') &&
          item.hasOwnProperty('ru')
        ) {
          if (!item.en) {
            reject(translate(lang, 'required_en_translation'));
          }
          if (!item.de) {
            reject(translate(lang, 'required_de_translation'));
          }
          if (!item.ru) {
            reject(translate(lang, 'required_ru_translation'));
          }
          if (!item.tr) {
            reject(translate(lang, 'required_tr_translation'));
          }
          resolve(item);
        } else {
          reject(translate(lang, 'required_translations'));
        }
      });
    },
    consultationStatus(x) {
      if (consultationStatusEnum.hasOwnProperty(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_status'));
      }
    },
    duration(x) {
      const n = parseInt(x);
      if (isNaN(n)) {
        throw new CreateError(
          translate(lang, 'invalid_treatment_duration'),
          422
        );
      } else {
        return { msg: 'Valid', data: { value: n } };
      }
    },
    diagnosisDataType(x) {
      if (Array.isArray(x)) {
        if (x.length > 10) {
          throw new CreateError(translate(lang, 'max_length_diagnosis'), 422);
        }

        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(
          translate(lang, 'invalid_diagnosis_details'),
          422
        );
      }
    },
    diagnosis(x) {
      return new Promise((resolve, reject) => {
        x = String(x);
        if (x.length < 150) {
          return resolve(x);
        } else {
          reject(translate(lang, 'invalid_diagnosis'));
        }

        // let n = {}

        // if (!x.hasOwnProperty('code')) {
        //     reject(translate(lang, 'required_diagnosis_code'));
        // } else {
        //     if (/^[\d\D]{1,100}$/.test(x.code)) {
        //         const code = String(x.code);
        //         n.code = code
        //     } else {
        //         reject(translate(lang, 'invalid_diagnosis_code'));
        //     }
        // }

        // if (!x.hasOwnProperty('display')) {
        //     reject(translate(lang, 'invalid_diagnosis_code'));
        // } else {
        //     if (/^[\d\D]{1,500}$/.test(x.display)) {
        //         const display = String(x.display);
        //         n.display = display
        //     } else {
        //         reject(translate(lang, 'invalid_diagnosis_display'));
        //     }
        // }

        return resolve(n);
      });
    },
    inviteType(x) {
      if (inviteTypeEnum.hasOwnProperty(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_invite_type'));
      }
    },
    invoiceItemDesc(x) {
      x = String(x);
      if (/^[\d\D]{1,100}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(
          translate(lang, 'invalid_invoice_item_desc'),
          422
        );
      }
    },
    insuranceProvider(x) {
      x = String(x);
      if (/^[\d\D]{1,50}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(
          translate(lang, 'invalid_insurance_provider'),
          422
        );
      }
    },
    insuranceBranchCode(x) {
      x = String(x);
      if (/^[\d\D]{1,50}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(
          translate(lang, 'invalid_insurance_branch_code'),
          422
        );
      }
    },
    insuranceCode(x) {
      x = String(x);
      if (/^[\d\D]{1,50}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_insurance_code'), 422);
      }
    },
    insuranceValidity(x) {
      const dateString = new Date(x).toLocaleDateString();
      if (dateString === 'Invalid Date') {
        throw new CreateError(
          translate(lang, 'invalid_insurance_validity'),
          422
        );
      }
      return {
        msg: 'Valid',
        data: { value: moment(new Date(dateString)).format('YYYY-MM-DD') },
      };
    },
    medicine(x) {
      return new Promise((resolve, reject) => {
        if (x.hasOwnProperty('name') && x.hasOwnProperty('intake')) {
          if (/^[\d\D]{0,100}$/.test(x.name)) {
            if (/^[\d\D]{0,50}$/.test(x.intake)) {
              return resolve(x);
            } else {
              return reject(translate(lang, 'invalid_medicine_intake'));
            }
          } else {
            return reject(translate(lang, 'invalid_medicine_name'));
          }
        }
        return reject(translate(lang, 'invalid_medicine'));
      });
    },
    telephone(x) {
      x = String(x);
      if (/^[\d\D]{0,20}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_telephone'), 422);
      }
    },
    practiceName(x) {
      x = String(x);
      if (/^[\d\D]{1,100}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_practice_name'), 422);
      }
    },
    website(x) {
      x = String(x);
      if (/^[\d\D]{1,100}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_practice_name'), 422);
      }
    },
    kbv(x) {
      x = String(x);
      if (/^[\d\D]{1,100}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_practice_name'), 422);
      }
    },
    association(x) {
      x = String(x);
      if (/^[\d\D]{1,100}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_practice_name'), 422);
      }
    },
    medicalRateCode(x) {
      x = String(x);
      if (/^[\d\D]{1,10}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(
          translate(lang, 'invalid_medical_rate_code'),
          422
        );
      }
    },
    medicalRateDescription(x) {
      if (x.hasOwnProperty('en') && x.hasOwnProperty('de')) {
        if (!x.en) {
          throw new CreateError(translate(lang, 'required_en_translation'));
        }
        if (!x.de) {
          throw new CreateError(translate(lang, 'required_de_translation'));
        }
        x.en = String(x.en);
        x.de = String(x.de);
        if (/^[\d\D]{1,450}$/.test(x.en) && /^[\d\D]{1,450}$/.test(x.de)) {
          return { msg: 'Valid', data: { value: x } };
        } else {
          throw new CreateError(
            translate(lang, 'invalid_medical_rate_description'),
            422
          );
        }
      } else {
        throw new CreateError(translate(lang, 'required_translations'));
      }
    },
    medicalRateCharge(x) {
      x = String(x);
      if (/^[\d]{1,10}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(
          translate(lang, 'invalid_medical_rate_charge'),
          422
        );
      }
    },
    medicalRateTotal(x) {
      x = String(x);
      if (/^[\d]{1,10}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(
          translate(lang, 'invalid_medical_rate_total'),
          422
        );
      }
    },
    medicalRateMultiplier(x) {
      x = parseInt(x);
      if (/^[\d]{1,10}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(
          translate(lang, 'invalid_medical_rate_Multipler'),
          422
        );
      }
    },
    otpValidator(x) {
      x = String(x).trim();
      if (/^[0123456789]{4,15}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_otp'), 422);
      }
    },
    account_institution_name(x) {
      x = String(x);
      if (/^\D{1,200}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(
          translate(lang, 'invalid_bank_account_name'),
          422
        );
      }
    },
    account_holder_name(x) {
      x = String(x);
      if (/^\D{1,200}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(
          translate(lang, 'invalid_account_holder_name'),
          422
        );
      }
    },
    account_iban(x) {
      x = String(x);
      if (/^[a-zA-Z0-9]{22}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_iban'), 422);
      }
    },
    account_bic(x) {
      x = String(x);
      if (/^[a-zA-Z0-9]{1,11}$/.test(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_bic'), 422);
      }
    },
    height(x) {
      let y = String(x);
      if (/^\d*\.?\d*$/.test(y) && parseInt(x) <= 230 && parseInt(x) >= 100) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_height'), 422);
      }
    },
    weight(x) {
      let y = String(x);
      if (/^\d*\.?\d*$/.test(y) && parseInt(x) <= 500 && parseInt(x) >= 50) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_weight'), 422);
      }
    },
    age(x) {
      if (/^[0-9]*$/.test(x)) {
        return { msg: 'Valid', data: { value: parseInt(x) } };
      }
      throw new CreateError(translate(lang, 'invalid_age'), 422);
    },
    gender(x) {
      x = String(x).trim();
      const options = ['Male', 'Female', 'Others', 'male', 'female', 'others'];
      if (options.includes(x) !== -1) {
        if (x === 'male') x = 'Male';
        if (x === 'female') x = 'Female';
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_gender'), 422);
      }
    },
    sportstime(x) {
      if (/^[0-9]*$/.test(x)) {
        return { msg: 'Valid', data: { value: parseInt(x) } };
      }
      throw new CreateError(translate(lang, 'invalid_time'), 422);
    },
    walkingtime(x) {
      if (/^[0-9]*$/.test(x)) {
        return { msg: 'Valid', data: { value: parseInt(x) } };
      }
      throw new CreateError(translate(lang, 'invalid_time'), 422);
    },
    standingtime(x) {
      if (/^[0-9]*$/.test(x)) {
        return { msg: 'Valid', data: { value: parseInt(x) } };
      }
      throw new CreateError(translate(lang, 'invalid_time'), 422);
    },
    sittingstime(x) {
      if (/^[0-9]*$/.test(x)) {
        return { msg: 'Valid', data: { value: parseInt(x) } };
      }
      throw new CreateError(translate(lang, 'invalid_time'), 422);
    },
    lyingtime(x) {
      if (/^[0-9]*$/.test(x)) {
        return { msg: 'Valid', data: { value: parseInt(x) } };
      }
      throw new CreateError(translate(lang, 'invalid_time'), 422);
    },
    sleeptime(x) {
      if (/^[0-9]*$/.test(x)) {
        return { msg: 'Valid', data: { value: parseInt(x) } };
      }
      throw new CreateError(translate(lang, 'invalid_time'), 422);
    },
    preference(x) {
      x = String(x).trim();
      const options = ['Live Lighter', 'Live Healthier', 'Gain Muscle'];
      if (options.includes(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_preference'), 422);
      }
    },
    diet(x) {
      x = String(x).trim();
      const options = [
        'Omnivore',
        'Vegetarian',
        'Lacto-Vegetarian',
        'Ovo-Vegetarian',
        'Pescetarians',
        'Vegan',
      ];
      if (options.includes(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_diet'), 422);
      }
    },
    waist_circumference(x) {
      let y = String(x);
      if (/^\d*\.?\d*$/.test(y)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_circumference'), 422);
      }
    },
    hip_circumference(x) {
      let y = String(x);
      if (/^\d*\.?\d*$/.test(y)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_circumference'), 422);
      }
    },
    bmi(x) {
      let y = String(x);
      if (/^\d*\.?\d*$/.test(y)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_bmi'), 422);
      }
    },
    waist_hip_ratio(x) {
      let y = String(x);
      if (/^\d*\.?\d*$/.test(y)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_waist_hip_ratio'), 422);
      }
    },
    username(x) {
      x = String(x);
      if (x.length <= 30) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_username'), 422);
      }
    },
    meals_type(x) {
      x = String(x);
      if (
        x === 'breakfast' ||
        x === 'lunch' ||
        x === 'snacks' ||
        x === 'dinner'
      ) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_meals_type'), 422);
      }
    },
    breakfast(x) {
      if (/^[0-9]*$/.test(x)) {
        return { msg: 'Valid', data: { value: parseInt(x) } };
      }
      throw new CreateError(translate(lang, 'invalid_food'), 422);
    },
    lunch(x) {
      if (/^[0-9]*$/.test(x)) {
        return { msg: 'Valid', data: { value: parseInt(x) } };
      }
      throw new CreateError(translate(lang, 'invalid_food'), 422);
    },
    dinner(x) {
      if (/^[0-9]*$/.test(x)) {
        return { msg: 'Valid', data: { value: parseInt(x) } };
      }
      throw new CreateError(translate(lang, 'invalid_food'), 422);
    },
    snacks(x) {
      if (/^[0-9]*$/.test(x)) {
        return { msg: 'Valid', data: { value: parseInt(x) } };
      }
      throw new CreateError(translate(lang, 'invalid_food'), 422);
    },
    exercise(x) {
      if (/^[0-9]*$/.test(x)) {
        return { msg: 'Valid', data: { value: parseInt(x) } };
      }
      throw new CreateError(translate(lang, 'invalid_exercise'), 422);
    },
    calorie_consumption_goal(x) {
      if (/^[0-9]*$/.test(x)) {
        return { msg: 'Valid', data: { value: parseInt(x) } };
      }
      throw new CreateError(translate(lang, 'invalid_calorie_count'), 422);
    },
    weight_goal(x) {
      if (/^[0-9]*$/.test(x)) {
        return { msg: 'Valid', data: { value: parseInt(x) } };
      }
      throw new CreateError(translate(lang, 'invalid_weight'), 422);
    },
    consumed_water(x) {
      if (
        /^[0-9]*$/.test(x) &&
        parseInt(x) * 0.15 <= 4 &&
        parseInt(x) * 0.15 >= 0
      ) {
        return { msg: 'Valid', data: { value: parseInt(x) } };
      }
      throw new CreateError(translate(lang, 'invalid_consumed_water'), 422);
    },
    exercise_duration(x) {
      if (/^[0-9]*$/.test(x) && parseInt(x) <= 600 && parseInt(x) >= 5) {
        return { msg: 'Valid', data: { value: parseInt(x) } };
      }
      throw new CreateError(translate(lang, 'invalid_entry'), 422);
    },
    mood(x) {
      x = String(x).trim();
      const options = ['Happy', 'Indifferent', 'Unhappy'];
      if (options.includes(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_mood'), 422);
      }
    },
    goalStatus(x) {
      x = String(x).trim();
      const options = ['active', 'inactive'];
      if (options.includes(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_goal_status'), 422);
      }
    },
    goalPreference(x) {
      x = String(x).trim();
      const options = ['Live Lighter', 'Stay Healthy', 'Gain Muscle'];
      if (options.includes(x)) {
        return { msg: 'Valid', data: { value: x } };
      } else {
        throw new CreateError(translate(lang, 'invalid_goal_preference'), 422);
      }
    },
    feeling(x) {
      const options = [
        'Excited',
        'Agitated',
        'Balanced',
        'Well rested',
        'Energetic',
        'Relaxed',
        'Cold',
        'Exhausted',
        'Happy',
        'Joint Pain',
        'Happy',
        'Hungry',
        'Concentrated',
        'Boredom',
        'Lovesickness',
        'Tired',
        'Nervous',
        'Gluttony',
        'Private stress',
        'Problems with friends/family',
        'Slept badly',
        'Stress at work',
        'Sad',
        'Nausea',
        'Unhappy',
        'Vacation',
        'Hungover',
        'In love',
        'Feeling of fullness',
        'Insatiable',
        'Stress-Self',
        'Full Tummy',
        'Upset',
      ];
      x.forEach((element) => {
        let strx = String(element).trim();
        if (!options.includes(strx)) {
          throw new CreateError(translate(lang, 'invalid_feeling'), 422);
        }
      });
      return { msg: 'Valid', data: { value: x } };
    },
  });
};
