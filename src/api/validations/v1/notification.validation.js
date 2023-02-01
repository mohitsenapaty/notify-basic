const { Joi, Segments } = require('celebrate');

module.exports = {
  // GET /api/v1/notifications/:id
  read: {
    [Segments.PARAMS]: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // POST /api/v1/notifications/retry/:id
  retry: {
    [Segments.PARAMS]: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
