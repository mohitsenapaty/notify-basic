const express = require('express');
const { celebrate: validate } = require('celebrate');
const { authorize, authorizeKey } = require('../../middlewares/auth');
const controller = require('../../controllers/notificationcategory.controller');
const {
  create,
  read,
  update,
  remove,
} = require('../../validations/v1/notificationcategory.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} api/v1/categories Create Notification Category
   * @apiDescription Create Notification Category
   * @apiVersion 1.0.0
   * @apiName Create
   * @apiGroup NotificationCategory
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} NotificationCategory
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .post(validate(create), authorize(['admin']), controller.create);

router
  .route('/')
  /**
   * @api {get} api/v1/categories List Notification Category
   * @apiDescription List Notification Category
   * @apiVersion 1.0.0
   * @apiName List
   * @apiGroup NotificationCategory
   * @apiPermission client
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Array} NotificationCategories
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only client can access the data
   */
  .get(authorizeKey(), controller.list);

router
  .route('/:id')
  /**
   * @api {get} api/v1/categories/:id Read Notification Category
   * @apiDescription Read Notification Category
   * @apiVersion 1.0.0
   * @apiName Read
   * @apiGroup NotificationCategory
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} NotificationCategory
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .get(validate(read), authorize(['admin']), controller.read);

router
  .route('/:id')
  /**
   * @api {put} api/v1/categories/:id Update Notification Category
   * @apiDescription Update Notification Category
   * @apiVersion 1.0.0
   * @apiName Update
   * @apiGroup NotificationCategory
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object} NotificationCategory
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admin can access the data
   */
  .put(validate(update), authorize(['admin']), controller.update);

router
  .route('/:id')
  /**
   * @api {delete} api/v1/categories/:id Delete Notification Category
   * @apiDescription Delete Notification Category
   * @apiVersion 1.0.0
   * @apiName Delete
   * @apiGroup NotificationCategory
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
