const express = require('express');
const { celebrate: validate } = require('celebrate');
const { authorize, authorizeKey } = require('../../middlewares/auth');
const controller = require('../../controllers/notificationprovider.controller');
const {
  create,
  read,
  update,
  remove,
} = require('../../validations/v1/notificationprovider.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} api/v1/providers Create Notification Provider
   * @apiDescription Create Notification Provider
   * @apiVersion 1.0.0
   * @apiName Create
   * @apiGroup NotificationProvider
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} NotificationProvider
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .post(validate(create), authorize(['admin']), controller.create);

router
  .route('/')
  /**
   * @api {get} api/v1/providers List Notification Provider
   * @apiDescription List Notification Provider
   * @apiVersion 1.0.0
   * @apiName List
   * @apiGroup NotificationProvider
   * @apiPermission client
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Array} NotificationProviders
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only client can access the data
   */
  .get(authorizeKey(), controller.list);

router
  .route('/:id')
  /**
   * @api {get} api/v1/providers/:id Read Notification Provider
   * @apiDescription Read Notification Provider
   * @apiVersion 1.0.0
   * @apiName Read
   * @apiGroup NotificationProvider
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} NotificationProvider
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .get(validate(read), authorize(['admin']), controller.read);

router
  .route('/:id')
  /**
   * @api {put} api/v1/providers/:id Update Notification Provider
   * @apiDescription Update Notification Provider
   * @apiVersion 1.0.0
   * @apiName Update
   * @apiGroup NotificationProvider
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} NotificationProvider
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .put(validate(update), authorize(['admin']), controller.update);

router
  .route('/:id')
  /**
   * @api {delete} api/v1/providers/:id Delete Notification Provider
   * @apiDescription Delete Notification Provider
   * @apiVersion 1.0.0
   * @apiName Delete
   * @apiGroup NotificationProvider
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
