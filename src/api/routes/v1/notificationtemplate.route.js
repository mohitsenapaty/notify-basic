const express = require('express');
const { celebrate: validate } = require('celebrate');
const { authorize, authorizeKey } = require('../../middlewares/auth');
const controller = require('../../controllers/v1/notificationtemplate.controller');
const {
  create,
  read,
  update,
  remove,
} = require('../../validations/v1/notificationtemplate.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} api/v1/templates Create Notification Template
   * @apiDescription Create Notification Template
   * @apiVersion 1.0.0
   * @apiName Create
   * @apiGroup NotificationTemplate
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} NotificationTemplate
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .post(validate(create), authorize(['admin']), controller.create);

router
  .route('/')
  /**
   * @api {get} api/v1/templates List Notification Template
   * @apiDescription List Notification Template
   * @apiVersion 1.0.0
   * @apiName List
   * @apiGroup NotificationTemplate
   * @apiPermission client
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Array} NotificationTemplates
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only client can access the data
   */
  .get(authorizeKey(), controller.list);

router
  .route('/:id')
  /**
   * @api {get} api/v1/templates/:id Read Notification Template
   * @apiDescription Read Notification Template
   * @apiVersion 1.0.0
   * @apiName Read
   * @apiGroup NotificationTemplate
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} NotificationTemplate
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .get(validate(read), authorize(['admin']), controller.read);

router
  .route('/:id')
  /**
   * @api {put} api/v1/templates/:id Update Notification Template
   * @apiDescription Update Notification Template
   * @apiVersion 1.0.0
   * @apiName Update
   * @apiGroup NotificationTemplate
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} NotificationTemplate
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .put(validate(update), authorize(['admin']), controller.update);

router
  .route('/:id')
  /**
   * @api {delete} api/v1/templates/:id Delete Notification Template
   * @apiDescription Delete Notification Template
   * @apiVersion 1.0.0
   * @apiName Delete
   * @apiGroup NotificationTemplate
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
