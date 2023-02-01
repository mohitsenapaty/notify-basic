const { intersection } = require('lodash');
const Promise = require('bluebird');
const httpStatus = require('http-status');
const passport = require('passport');
const IdentityService = require('../services/identity.service');
const APIError = require('../utils/APIError');

const handleBasic = (req, res, next) => async (err, user, info) => {
  const error = err || info;
  req.logIn = Promise.promisify(req.logIn);
  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });

  try {
    if (error || !user) throw error;
    await req.logIn(user, {
      session: false,
    });
    req.user = user;

    return next();
  } catch (e) {
    return next(apiError);
  }
};

exports.authorize = (roles) => async (req, res, next) => {
  try {
    const user = await IdentityService.jwtvalidate(req.headers);

    if (intersection(roles, user.roles).length === 0) {
      const apiError = new APIError({
        message: 'Forbidden',
        status: httpStatus.FORBIDDEN,
      });
      return next(apiError);
    }

    req.user = user;

    return next();
  } catch (e) {
    return next(e);
  }
};

exports.authorizeKey = () => (req, res, next) => {
  passport.authenticate('basic', { session: false }, handleBasic(req, res, next))(req, res, next);
};
