const { Joi, Segments } = require('celebrate');

module.exports = {
  // POST /api/v1/clients
  create: {
    [Segments.BODY]: {
      name: Joi.string().alphanum().min(3).max(50)
        .required(),
      description: Joi.string().allow(''),
    },
  },
  // GET /api/v1/clients/:id
  read: {
    [Segments.PARAMS]: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
    },
  },
  // PUT /api/v1/clients/:id
  update: {
    [Segments.PARAMS]: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
    [Segments.BODY]: {
      name: Joi.string().alphanum().min(3).max(50),
      description: Joi.string().allow(''),
      reset: Joi.boolean(),
    },
  },
  // DELETE /api/v1/clients/:id
  remove: {
    [Segments.PARAMS]: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};