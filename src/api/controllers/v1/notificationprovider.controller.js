const httpStatus = require('http-status');
const moment = require('moment');
const NotificationProvider = require('../models/notificationprovider.model');
const NotificationType = require('../models/notificationtype.model');

/**
 * Create NotificationProvider
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const notificationtype = await NotificationType.findOne({
      _id: req.body.type,
      archived: false,
    });
    if (!notificationtype) {
      return res.status(httpStatus.BAD_REQUEST).json({ code: httpStatus.BAD_REQUEST, message: 'Notification Type is invalid' });
    }

    const notificationprovider = await NotificationProvider.create(req.body);
    return res.status(httpStatus.CREATED).json({ code: httpStatus.CREATED, message: 'Notification Provider created successfully', provider: notificationprovider });
  } catch (error) {
    return next(error);
  }
};

/**
 * Read NotificationProvider
 * @public
 */
exports.read = async (req, res, next) => {
  try {
    const notificationprovider = await NotificationProvider.findOne({
      _id: req.params.id,
      archived: false,
    }).populate('type');

    if (notificationprovider) {
      return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Notification Provider fetched successfully', provider: notificationprovider });
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};

/**
 * List NotificationProviders
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const notificationproviders = await NotificationProvider.find({ archived: false }).populate('type');

    return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Notification Provider(s) fetched successfully', providers: notificationproviders });
  } catch (error) {
    return next(error);
  }
};

/**
 * Update NotificationProvider
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const notificationprovider = await NotificationProvider.findOneAndUpdate({
      _id: req.params.id,
      archived: false,
    }, req.body, {
      new: true,
    });

    if (notificationprovider) {
      return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Notification Provider updated successfully', provider: notificationprovider });
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete NotificationProvider
 * @public
 */
exports.delete = async (req, res, next) => {
  try {
    const notificationprovider = await NotificationProvider.findOneAndUpdate({
      _id: req.params.id,
      archived: false,
    }, {
      archived: true,
      archivedAt: moment().toISOString(),
    });

    if (notificationprovider) {
      return res.status(httpStatus.NO_CONTENT);
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};
