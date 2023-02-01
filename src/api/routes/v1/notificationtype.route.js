const express = require('express');
const { celebrate: validate } = require('celebrate');
const { authorize, authorizeKey } = require('../../middlewares/auth');
const controller = require('../../controllers/notificationtype.controller');
const {
  create,
  read,
  update,
  remove,
} = require('../../validations/v1/notificationtype.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} api/v1/types Create Notification Type
   * @apiDescription Create Notification Type
   * @apiVersion 1.0.0
   * @apiName Create
   * @apiGroup NotificationStatus
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} NotificationType
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .post(validate(create), controller.create);

router
  .route('/')
  /**
   * @api {get} api/v1/types List Notification Type
   * @apiDescription List Notification Type
   * @apiVersion 1.0.0
   * @apiName List
   * @apiGroup NotificationType
   * @apiPermission client
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Array} NotificationTypes
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only client can access the data
   */
  .get(authorizeKey(), controller.list);

router
  .route('/:id')
  /**
   * @api {get} api/v1/types/:id Read Notification Type
   * @apiDescription Read Notification Type
   * @apiVersion 1.0.0
   * @apiName Read
   * @apiGroup NotificationType
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} NotificationType
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .get(validate(read), authorize(['admin']), controller.read);

router
  .route('/:id')
  /**
   * @api {put} api/v1/types/:id Update Notification Type
   * @apiDescription Update Notification Type
   * @apiVersion 1.0.0
   * @apiName Update
   * @apiGroup NotificationType
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} NotificationStatus
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .put(validate(update), authorize(['admin']), controller.update);

router
  .route('/:id')
  /**
   * @api {delete} api/v1/types/:id Delete Notification Type
   * @apiDescription Delete Notification Type
   * @apiVersion 1.0.0
   * @apiName Delete
   * @apiGroup NotificationType
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} sucess/failure
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .delete(validate(remove), authorize(['admin']), controller.delete);

module.exports = router;
