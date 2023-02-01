const express = require('express');
const { celebrate: validate } = require('celebrate');
const { authorize } = require('../../middlewares/auth');
const controller = require('../../controllers/notificationstatus.controller');
const {
  create,
  read,
  update,
  remove,
} = require('../../validations/v1/notificationstatus.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} api/v1/statuses Create Notification Status
   * @apiDescription Create Notification Status
   * @apiVersion 1.0.0
   * @apiName Create
   * @apiGroup NotificationStatus
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} NotificationStatus
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .post(validate(create), authorize(['admin']), controller.create);

router
  .route('/')
  /**
   * @api {get} api/v1/statuses List Notification Status
   * @apiDescription List Notification Status
   * @apiVersion 1.0.0
   * @apiName List
   * @apiGroup NotificationStatus
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Array} NotificationStatuses
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .get(authorize(['admin']), controller.list);

router
  .route('/:id')
  /**
   * @api {get} api/v1/statuses/:id Read Notification Status
   * @apiDescription Read Notification Status
   * @apiVersion 1.0.0
   * @apiName Read
   * @apiGroup NotificationStatus
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} NotificationStatus
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .get(validate(read), authorize(['admin']), controller.read);

router
  .route('/:id')
  /**
   * @api {put} api/v1/statuses/:id Update Notification Status
   * @apiDescription Update Notification Status
   * @apiVersion 1.0.0
   * @apiName Update
   * @apiGroup NotificationStatus
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
   * @api {delete} api/v1/statuses/:id Delete Notification Status
   * @apiDescription Delete Notification Status
   * @apiVersion 1.0.0
   * @apiName Delete
   * @apiGroup NotificationStatus
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
