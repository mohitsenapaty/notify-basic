const { pick } = require('lodash');
const mongoose = require('mongoose');

/**
 * NotificationProvider Schema
 * @private
 */
const notificationProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  type: {
    type: mongoose.Schema.ObjectId,
    ref: 'NotificationType',
    required: true,
  },
  url: {
    type: String,
  },
  key: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  custom: {
    type: mongoose.Schema.Types.Mixed,
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

notificationProviderSchema.set('toJSON', {
  virtuals: true,
  transform: (doc) => pick(doc, ['id', 'name', 'description', 'url', 'key', 'type']),
});

/**
 * @typedef NotificationProvider
 */
module.exports = mongoose.model('NotificationProvider', notificationProviderSchema);
