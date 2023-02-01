const { Joi, Segments } = require('celebrate');

module.exports = {
  // POST /api/v1/notifications/ticket
  create: {
    [Segments.BODY]: {
      customer: {
        id: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
        phone: Joi.string().length(10),
      },
      category: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      type: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      provider: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      template: {
        id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
        data: Joi.object().required(),
      },
      debug: Joi.boolean(),
      correlationid: Joi.string(),
      callbackurl: Joi.string(),
      custom: Joi.object(),
      options: {
        subject: Joi.string().required(),
        assignee: Joi.string(),
        department: Joi.string().required(),
      },
    },
  },
};
