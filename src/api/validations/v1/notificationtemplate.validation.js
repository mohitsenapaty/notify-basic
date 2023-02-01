const { Joi, Segments } = require('celebrate');

module.exports = {
  // POST /api/v1/templates
  create: {
    [Segments.BODY]: {
      name: Joi.string().alphanum().min(3).max(50)
        .required(),
      description: Joi.string().allow(''),
      category: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      type: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      content: Joi.string().required(),
      sender: Joi.string().required(),
      customdata: Joi.object().optional(),
    },
  },

  // GET /api/v1/templates/:id
  read: {
    [Segments.PARAMS]: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PUT /api/v1/templates/:id
  update: {
    [Segments.PARAMS]: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
    [Segments.BODY]: {
      name: Joi.string().alphanum().min(3).max(50),
      description: Joi.string().allow(''),
      category: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
      type: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
      content: Joi.string(),
      sender: Joi.string(),
    },
  },

  // DELETE /api/v1/templates/:id
  remove: {
    [Segments.PARAMS]: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
