const httpStatus = require('http-status');
const NotificationCategory = require('../models/notificationcategory.model');
const NotificationProvider = require('../models/notificationprovider.model');
const NotificationStatus = require('../models/notificationstatus.model');
const NotificationTemplate = require('../models/notificationtemplate.model');
const NotificationType = require('../models/notificationtype.model');
const PushNotification = require('../models/pushnotification.model');

/**
 * Create NotificationCategory
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const [category, provider, template, type] = await Promise.all([
      NotificationCategory.findOne({
        _id: req.body.category,
        archived: false,
      }),
      NotificationProvider.findOne({
        _id: req.body.provider,
        type: req.body.type,
        archived: false,
      }),
      NotificationTemplate.findOne({
        _id: req.body.template.id,
        type: req.body.type,
        category: req.body.category,
        archived: false,
      }),
      NotificationType.findOne({
        _id: req.body.type,
        archived: false,
      }),
    ]);
    if (!category || !provider || !template || !type) {
      return res.status(httpStatus.BAD_REQUEST).json({ code: httpStatus.BAD_REQUEST, message: 'Notification Category/Provider/Template/Type invalid' });
    }

    const statuses = await NotificationStatus.find({
      name: { $in: ['created'] },
      archived: false,
    });
    const statusMap = statuses.reduce((result, item) => {
      result[item.name] = item.id; // eslint-disable-line no-param-reassign
      return result;
    }, {});

    // render template
    const content = template.render(req.body.template.data);

    const notification = await PushNotification.createNotification({
      ...req.body,
      client: req.user.id,
      content,
      type,
    }, statusMap);
    return res.status(httpStatus.CREATED).json({ code: httpStatus.CREATED, message: 'Notification created successfully', notification });
  } catch (error) {
    return next(error);
  }
};
