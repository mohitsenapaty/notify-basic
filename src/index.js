const { port, env } = require('./config/vars');
const { logger } = require('./config/logger');

// eslint-disable-next-line global-require
if (env === 'production') require('newrelic');

const app = require('./config/express');
const dynamoose = require('./config/dynamoose');

// open dynamoose connection
dynamoose.init();

// listen to requests
app.listen(port, () => logger.info(`API Server started on port ${port} (${env})`)); // eslint-disable-line no-console

/**
* Exports express
* @public
*/
module.exports = app;
