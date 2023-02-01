const express = require('express');
const httpStatus = require('http-status');

const router = express.Router();

router
  .route('/health')
  /**
       * @api {get} app/health Health check
       * @apiDescription Health check API
       * @apiVersion 1.0.0
       * @apiGroup Health
       * @apiSuccess {Object} success
       */
  .get((req, res) => res.status(httpStatus.OK).json({ statusCode: httpStatus.OK, status: 'OK' }));

router
  .route('/deephealth')
  /**
       * @api {get} app/deephealth Deep Health check
       * @apiDescription Deep Health check API
       * @apiVersion 1.0.0
       * @apiGroup Health
       * @apiSuccess {Object} success
       */
  .get((req, res) => res.status(httpStatus.OK).json({ statusCode: httpStatus.OK, status: 'OK' }));

module.exports = router;
