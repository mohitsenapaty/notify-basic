const express = require('express');
const { celebrate: validate } = require('celebrate');
const { authorizeKey } = require('../../middlewares/auth');
const controller = require('../../controllers/emailnotification.controller');
const {
  create,
} = require('../../validations/v1/emailnotification.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} api/v1/notifications/email Create Email Notification
   * @apiDescription Create Email Notification
   * @apiVersion 1.0.0
   * @apiName Create
   * @apiGroup EmailNotification
   * @apiPermission client
   *
   * @apiSuccess {Object} EmailNotification
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only client can access the data
   */
  .post(validate(create), authorizeKey(), controller.create);

module.exports = router;
