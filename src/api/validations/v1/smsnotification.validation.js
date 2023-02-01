const { Joi, Segments } = require('celebrate');

module.exports = {
  // POST /api/v1/notifications/sms
  create: {
    [Segments.BODY]: {
      customer: {
        id: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
        phone: Joi.string().length(10).required(),
      },
      category: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      type: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      provider: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      template: {
        id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
        data: Joi.object().required(),
      },
      debug: Joi.boolean(),
      correlationid: Joi.string().required(),
      callbackurl: Joi.string(),
    },
  },
};
