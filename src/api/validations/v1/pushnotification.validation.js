const { Joi, Segments } = require('celebrate');

module.exports = {
  // POST /api/v1/notifications/push
  create: {
    [Segments.BODY]: {
      customer: {
        id: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
        receiver: Joi.string().required(),
      },
      category: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      type: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      provider: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      template: {
        id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
        data: Joi.object().required(),
      },
      options: {
        attachments: Joi.array().items(Joi.object({
          filename: Joi.string(),
          data: Joi.string(),
        })),
      },
      debug: Joi.boolean(),
      correlationid: Joi.string().required(),
      callbackurl: Joi.string(),
    },
  },
};
