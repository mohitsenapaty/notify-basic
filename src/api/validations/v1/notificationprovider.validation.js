const { Joi, Segments } = require('celebrate');

module.exports = {
  // POST /api/v1/providers
  create: {
    [Segments.BODY]: {
      name: Joi.string().alphanum().min(3).max(50)
        .required(),
      description: Joi.string().allow(''),
      type: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      url: Joi.string().allow(''),
      key: Joi.string().allow(''),
      password: Joi.string().required(),
      custom: Joi.object(),
    },
  },
  // GET /api/v1/providers/:id
  read: {
    [Segments.PARAMS]: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
  // PUT /api/v1/providers/:id
  update: {
    [Segments.PARAMS]: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
    [Segments.BODY]: {
      name: Joi.string().alphanum().min(3).max(50),
      description: Joi.string().allow(''),
      type: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
      url: Joi.string().allow(''),
      key: Joi.string().allow(''),
      password: Joi.string(),
      custom: Joi.object(),
    },
  },
  // DELETE /api/v1/providers/:id
  remove: {
    [Segments.PARAMS]: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
