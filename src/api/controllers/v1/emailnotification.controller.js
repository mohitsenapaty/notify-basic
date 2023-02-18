const httpStatus = require('http-status');
const moment = require('moment');
const { omit } = require('lodash');
const Notification = require('../../models/notification.model');
const NotificationCategory = require('../../models/notificationcategory.model');
const NotificationProvider = require('../../models/notificationprovider.model');
const NotificationType = require('../../models/notificationtype.model');
const NotificationTemplate = require('../../models/notificationtemplate.model');
// const NotificationStatus = require('../../models/notificationstatus.model');
const SNSService = require('../../services/sns.service');
const { logger } = require('../../../config/logger');
const APIError = require('../../utils/APIError');
const { maxRetryAttempt, awsConfig } = require('../../../config/vars');

/**
 * Read Notification
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const [category, provider, template, type] = await Promise.all([
      NotificationCategory.get({
        _id: req.body.category,
      }),
      NotificationProvider.get({
        _id: req.body.provider,
      }),
      NotificationTemplate.get({
        _id: req.body.template.id,
      }),
      NotificationType.get({
        _id: req.body.type,
      }),
    ]);
    if (!category || category.archived || !provider || provider.archived ||
        !template || template.archived || !type || type.archived) {
      return res.status(httpStatus.BAD_REQUEST).json({
        code: httpStatus.BAD_REQUEST,
        message: 'Notification Category/Provider/Template/Type invalid'
      });
    }

    if (provider.type != type._id || template.type != type._id || template.category != category._id) {
      return res.status(httpStatus.BAD_REQUEST).json({
        code: httpStatus.BAD_REQUEST,
        message: 'Notification Category/Provider/Template/Type invalid'
      });
    }

    // render template
    const content = await template.render(req.body.template.data);
    const notification = await Notification.createNotification({
      ...omit(req.body, ['options', 'user', 'template']),
      client: req.user.id,
      content,
      template: req.body.template.id,
      user: req.body.user._id,
      specifics: {
        ...req.body.options,
        email: req.body.user.email,
      },
      typeobject: type,
      templateobject: template,
      status: "created",
    });
    return res.status(httpStatus.CREATED).json({ code: httpStatus.CREATED, message: 'Notification created successfully', notification });
  } catch (error) {
    return next(error);
  }
};

/*
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
*/
