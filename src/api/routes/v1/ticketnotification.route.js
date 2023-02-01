const express = require('express');
const { celebrate: validate } = require('celebrate');
const { authorizeKey } = require('../../middlewares/auth');
const controller = require('../../controllers/ticketnotification.controller');
const {
  create,
} = require('../../validations/v1/ticketnotification.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} api/v1/notifications/ticket Create Ticket Notification
   * @apiDescription Create Ticket Notification
   * @apiVersion 1.0.0
   * @apiName Create
   * @apiGroup TicketNotification
   * @apiPermission client
   *
   * @apiSuccess {Object} TicketNotification
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only client can access the data
   */
  .post(validate(create), authorizeKey(), controller.create);

module.exports = router;
