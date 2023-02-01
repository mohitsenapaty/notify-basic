const express = require('express');
const { celebrate: validate } = require('celebrate');
const { authorizeKey } = require('../../middlewares/auth');
const controller = require('../../controllers/notification.controller');
const {
  read, retry,
} = require('../../validations/v1/notification.validation');

const router = express.Router();

router
  .route('/:id')
  /**
   * @api {get} api/v1/notifications/:id Read Notification
   * @apiDescription Read Notification
   * @apiVersion 1.0.0
   * @apiName Read
   * @apiGroup Notification
   * @apiPermission client
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} Notification
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only client can access the data
   */
  .get(validate(read), controller.read);

router
  .route('/retry/:id')
  /**
   * @api {get} api/v1/notifications/retry/:id Retry Notification
   * @apiDescription Retry Notification
   * @apiVersion 1.0.0
   * @apiName Retry
   * @apiGroup Notification
   * @apiPermission client
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} Notification
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only client can access the data
   */
  .post(validate(retry), controller.retry);

module.exports = router;
