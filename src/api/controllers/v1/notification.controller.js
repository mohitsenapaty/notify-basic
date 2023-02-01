const httpStatus = require('http-status');
const moment = require('moment');
const Notification = require('../models/notification.model');
const NotificationStatus = require('../models/notificationstatus.model');
const SNSService = require('../services/sns.service');
const { logger } = require('../../config/logger');
const APIError = require('../utils/APIError');
const { maxRetryAttempt, awsConfig } = require('../../config/vars');

/**
 * Read Notification
 * @public
 */
exports.read = async (req, res, next) => {
  try {
    const statuses = await NotificationStatus.find({
      name: { $in: ['processing', 'success', 'failure', 'cancelled'] },
      archived: false,
    });
    const statusMap = statuses.reduce((result, item) => {
      result[item.name] = item.id; // eslint-disable-line no-param-reassign
      return result;
    }, {});

    const notification = await Notification
      .findOne({
        _id: req.params.id,
        client: req.user.id,
      })
      .populate('category provider status template type');

    if (notification) {
      const transformedData = await notification.fetchDetails(statusMap);
      return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Notification fetched successfully', notification: transformedData });
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};

exports.retry = async (req, res, next) => {
  try {
    logger.info(`Retrying notification with id: ${req.params.id}`);
    const notification = await Notification
      .findOne({
        _id: req.params.id,
        client: req.user.id,
      })
      .populate('category provider status template type');
    if (!notification) {
      return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
    }

    logger.info(`notification retrieved for retry: ${JSON.stringify(notification)}`);
    // check if the retry limit is reached
    if (notification.retrycount === Number(maxRetryAttempt)) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: 'Max retry attempts exhausted',
      });
    }

    // fetch the latest status
    const statuses = await NotificationStatus.find({
      name: { $in: ['created', 'processing', 'success', 'failure', 'cancelled'] },
      archived: false,
    });
    const statusMap = statuses.reduce((result, item) => {
      result[item.name] = item.id; // eslint-disable-line no-param-reassign
      return result;
    }, {});
    const transformedData = await notification.fetchDetails(statusMap);
    logger.info(`transformedData with latest status: ${JSON.stringify(transformedData)}`);

    // check for failure status before retrying
    if (transformedData.status.name === 'failure') {
      const retryObj = {
        timestamp: moment().toISOString(),
        prevError: notification.error ? notification.error : undefined,
      };

      notification.retries.push(retryObj);
      notification.retrycount += 1;
      if (notification.error) {
        notification.error = undefined;
      }
      notification.status = statusMap.created;
      await notification.save();

      await SNSService.publish({
        topic: awsConfig.sns.topic,
        message: {
          id: notification._id,
        },
        attributes: {
          notificationtype: {
            DataType: 'String',
            StringValue: notification.type.name,
          },
        },
      });
      return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Notification retried successfully' });
    }
    throw new APIError({
      status: httpStatus.BAD_REQUEST,
      message: 'The notification being retried is already success',
    });
  } catch (error) {
    return next(error);
  }
};
