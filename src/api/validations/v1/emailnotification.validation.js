const { Joi, Segments } = require('celebrate');

module.exports = {
  // POST /api/v1/notifications/email
  create: {
    [Segments.BODY]: {
      user: {
        id: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
        email: Joi.string(),
      },
      category: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      type: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      provider: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      template: {
        id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
        data: Joi.object().required(),
      },
      debug: Joi.boolean(),
      referenceid: Joi.string(),
      callbackurl: Joi.object().unknown(true),
      options: {
        subject: Joi.string().required(),
        cc: Joi.array().items(Joi.string()),
        attachments: Joi.array().items(Joi.object({
          filename: Joi.string(),
          data: Joi.string(),
        })),
      },
    },
  },
};
