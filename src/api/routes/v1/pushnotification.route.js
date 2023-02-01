const express = require('express');
const { celebrate: validate } = require('celebrate');
const { authorizeKey } = require('../../middlewares/auth');
const controller = require('../../controllers/pushnotification.controller');
const {
  create,
} = require('../../validations/v1/pushnotification.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} api/v1/notifications/push Create Push Notification
   * @apiDescription Create Push Notification
   * @apiVersion 1.0.0
   * @apiName Create
   * @apiGroup PushNotification
   * @apiPermission client
   *
   * @apiSuccess {Object} PushNotification
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only client can access the data
   */
  .post(validate(create), authorizeKey(), controller.create);

module.exports = router;
