const { logger } = require('../../../config/logger');
const httpStatus = require('http-status');
const moment = require('moment');
const Client = require('../../models/client.model');

/**
 * Create Client
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const client = await Client.createClient(req.body);
    logger.info(client);
    return res.status(httpStatus.CREATED).json({
      code: httpStatus.CREATED, message: 'Client created successfully', client
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Read Client
 * @public
 */
exports.read = async (req, res, next) => {
  try {
    const readClient = await Client.scan({ _id: req.params.id, archived: false }).exec();

    if (readClient) {
      return res.status(httpStatus.OK).json({
        code: httpStatus.OK, message: 'Client fetched successfully', readClient
      });
    }
    return res.status(httpStatus.NOT_FOUND).json({
      code: httpStatus.NOT_FOUND, message: 'Resource not found'
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * List Client
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    logger.info(req.query);
    const clients = Client.serializeMany(await Client.scan({
      ...(req.query.name) && {
        name: {eq: req.query.name}
      }
    }).exec());

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK, message: 'Client(s) fetched successfully', clients
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Update Client
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const client = await Client.updateClient({
      _id: req.params.id,
      archived: false,
    }, req.body, req.body.reset);

    if (client) {
      return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: 'Client updated successfully', client });
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete Client
 * @public
 */
exports.delete = async (req, res, next) => {
  try {
    const client = await Client.findOneAndUpdate({
      _id: req.params.id,
      archived: false,
    }, {
      archived: true,
      archivedAt: moment().toISOString(),
    });

    if (client) {
      return res.status(httpStatus.NO_CONTENT);
    }
    return res.status(httpStatus.NOT_FOUND).json({ code: httpStatus.NOT_FOUND, message: 'Resource not found' });
  } catch (error) {
    return next(error);
  }
};