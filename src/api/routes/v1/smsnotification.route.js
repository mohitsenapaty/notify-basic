const express = require('express');
const { celebrate: validate } = require('celebrate');
const { authorizeKey } = require('../../middlewares/auth');
const controller = require('../../controllers/smsnotification.controller');
const {
  create,
} = require('../../validations/v1/smsnotification.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} api/v1/notifications/sms Create SMS Notification
   * @apiDescription Create SMS Notification
   * @apiVersion 1.0.0
   * @apiName Create
   * @apiGroup SMSNotification
   * @apiPermission client
   *
   * @apiSuccess {Object} SMSNotification
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only client can access the data
   */
  .post(validate(create), authorizeKey(), controller.create);

module.exports = router;
