const httpStatus = require('http-status');
const moment = require('moment');
const NotificationType = require('../../models/notificationtype.model');

/**
 * Create NotificationType
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const notificationtype = await NotificationType.createNotificationType(req.body);
    return res.status(httpStatus.CREATED).json({
      code: httpStatus.CREATED, message: 'Notification Type created successfully', type: notificationtype
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Read NotificationType
 * @public
 */
exports.read = async (req, res, next) => {
  try {
    const notificationtype = await NotificationType.get({
      _id: req.params.id,
    });

    if (notificationtype) {
      return res.status(httpStatus.OK).json({
        code: httpStatus.OK, message: 'Notification Type fetched successfully', type: notificationtype
      });
    }
    return res.status(httpStatus.NOT_FOUND).json({
      code: httpStatus.NOT_FOUND, message: 'Resource not found'
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * List NotificationType
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const notificationtypes = await NotificationType.scan({
      archived: false,
      name: { exists: true},
    }).exec();

    return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Notification Type(s) fetched successfully', types: notificationtypes });
  } catch (error) {
    return next(error);
  }
};

/**
 * Update NotificationType
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const notificationtype = await NotificationType.updateNotificationType({
      _id: req.params.id,
    }, req.body);

    if (notificationtype) {
      return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Notification Type updated successfully', type: notificationtype });
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete NotificationType
 * @public
 */
exports.delete = async (req, res, next) => {
  try {
    const notificationtype = await NotificationType.updateNotificationType({
      _id: req.params.id,
    }, {
      archived: true,
      archivedAt: moment().valueOf(),
    });

    if (notificationtype) {
      return res.status(httpStatus.NO_CONTENT);
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};
