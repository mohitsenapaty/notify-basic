const { pick } = require('lodash');
const dynamoose = require("dynamoose");

/**
 * NotificationType Schema
 * @private
 */
const notificationTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  archivedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

const notificationTypeModel = dynamoose.model("Notify-NotificationType", notificationTypeSchema);
/**
 * @typedef NotificationType
 */
module.exports = mongoose.model('NotificationType', notificationTypeModel);
