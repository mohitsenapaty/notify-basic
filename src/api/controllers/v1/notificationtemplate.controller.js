const httpStatus = require('http-status');
const moment = require('moment');
const NotificationCategory = require('../models/notificationcategory.model');
const NotificationTemplate = require('../models/notificationtemplate.model');
const NotificationType = require('../models/notificationtype.model');

/**
 * Create NotificationTemplate
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const [cateogry, type] = await Promise.all([
      NotificationCategory.findOne({
        _id: req.body.category,
        archived: false,
      }),
      NotificationType.findOne({
        _id: req.body.type,
        archived: false,
      }),
    ]);
    if (!cateogry || !type) {
      return res.status(httpStatus.BAD_REQUEST).json({ code: httpStatus.BAD_REQUEST, message: 'Notification Category or/and Type invalid' });
    }

    const notificationtemplate = await NotificationTemplate.create(req.body);
    return res.status(httpStatus.CREATED).json({ code: httpStatus.CREATED, message: 'Notification Template created successfully', template: notificationtemplate });
  } catch (error) {
    return next(error);
  }
};

/**
 * Read NotificationTemplate
 * @public
 */
exports.read = async (req, res, next) => {
  try {
    const notificationtemplate = await NotificationTemplate.findOne({
      _id: req.params.id,
      archived: false,
    }).populate('type');

    if (notificationtemplate) {
      return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Notification Template fetched successfully', template: notificationtemplate });
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};

/**
 * List NotificationTemplate
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const notificationtemplates = await NotificationTemplate.find({ archived: false }).populate('type');

    return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Notification Template(s) fetched successfully', templates: notificationtemplates });
  } catch (error) {
    return next(error);
  }
};

/**
 * Update NotificationTemplate
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const notificationtemplate = await NotificationTemplate.findOneAndUpdate({
      _id: req.params.id,
      archived: false,
    }, req.body, {
      new: true,
    });

    if (notificationtemplate) {
      return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Notification Template updated successfully', template: notificationtemplate });
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete NotificationTemplate
 * @public
 */
exports.delete = async (req, res, next) => {
  try {
    const notificationtemplate = await NotificationTemplate.findOneAndUpdate({
      _id: req.params.id,
      archived: false,
    }, {
      archived: true,
      archivedAt: moment().toISOString(),
    });

    if (notificationtemplate) {
      return res.status(httpStatus.NO_CONTENT);
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};
