const httpStatus = require('http-status');
const moment = require('moment');
const NotificationStatus = require('../models/notificationstatus.model');

/**
 * Create NotificationStatus
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const notificationstatus = await NotificationStatus.create(req.body);
    return res.status(httpStatus.CREATED).json({ code: httpStatus.CREATED, message: 'Notification Status created successfully', status: notificationstatus });
  } catch (error) {
    return next(error);
  }
};

/**
 * Read NotificationStatus
 * @public
 */
exports.read = async (req, res, next) => {
  try {
    const notificationstatus = await NotificationStatus.findOne({
      _id: req.params.id,
      archived: false,
    });

    if (notificationstatus) {
      return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Notification Status fetched successfully', status: notificationstatus });
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};

/**
 * List NotificationStatus
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const notificationstatuses = await NotificationStatus.find({ archived: false });

    return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Notification Status(s) fetched successfully', statuses: notificationstatuses });
  } catch (error) {
    return next(error);
  }
};

/**
 * Update NotificationStatus
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const notificationstatus = await NotificationStatus.findOneAndUpdate({
      _id: req.params.id,
      archived: false,
    }, req.body, {
      new: true,
    });

    if (notificationstatus) {
      return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Notification Status updated successfully', status: notificationstatus });
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete NotificationStatus
 * @public
 */
exports.delete = async (req, res, next) => {
  try {
    const notificationstatus = await NotificationStatus.findOneAndUpdate({
      _id: req.params.id,
      archived: false,
    }, {
      archived: true,
      archivedAt: moment().toISOString(),
    });

    if (notificationstatus) {
      return res.status(httpStatus.NO_CONTENT);
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};
