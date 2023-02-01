const httpStatus = require('http-status');
const moment = require('moment');
const NotificationCategory = require('../models/notificationcategory.model');

/**
 * Create NotificationCategory
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const notificationcategory = await NotificationCategory.create(req.body);
    return res.status(httpStatus.CREATED).json({ code: httpStatus.CREATED, message: 'Notification Category created successfully', category: notificationcategory });
  } catch (error) {
    return next(error);
  }
};

/**
 * Read NotificationCategory
 * @public
 */
exports.read = async (req, res, next) => {
  try {
    const notificationcategory = await NotificationCategory.findOne({
      _id: req.params.id,
      archived: false,
    });

    if (notificationcategory) {
      return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Notification Category fetched successfully', category: notificationcategory });
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};

/**
 * List NotificationCategory
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const notificationcategories = await NotificationCategory.find({ archived: false });

    return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Notification Category(s) fetched successfully', categories: notificationcategories });
  } catch (error) {
    return next(error);
  }
};

/**
 * Update NotificationCategory
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const notificationcategories = await NotificationCategory.findOneAndUpdate({
      _id: req.params.id,
      archived: false,
    }, req.body, {
      new: true,
    });

    if (notificationcategories) {
      return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Notification Category updated successfully', category: notificationcategories });
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete NotificationCategory
 * @public
 */
exports.delete = async (req, res, next) => {
  try {
    const notificationcategories = await NotificationCategory.findOneAndUpdate({
      _id: req.params.id,
      archived: false,
    }, {
      archived: true,
      archivedAt: moment().toISOString(),
    });

    if (notificationcategories) {
      return res.status(httpStatus.NO_CONTENT);
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};
