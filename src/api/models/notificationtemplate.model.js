const { pick } = require('lodash');
const mongoose = require('mongoose');
const mustache = require('mustache');

/**
 * NotificationTemplate Schema
 * @private
 */
const notificationTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'NotificationCategory',
    required: true,
  },
  type: {
    type: mongoose.Schema.ObjectId,
    ref: 'NotificationType',
    required: true,
  },
  content: {
    type: Buffer,
    required: true,
    get: (data) => Buffer.from(data).toString('utf8'),
  },
  sender: {
    type: String,
    required: true,
  },
  customdata: {
    type: Object,
    required: false,
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

/**
 * Methods
 */
notificationTemplateSchema.method({
  render(data) {
    const msg = mustache.render(Buffer.from(this.content).toString('utf8'), data);
    return msg;
  },
});

notificationTemplateSchema.set('toJSON', {
  virtuals: true,
  transform: (doc) => pick(doc, ['id', 'name', 'description', 'type', 'sender', 'content', 'customdata']),
});

/**
 * @typedef NotificationTemplate
 */
module.exports = mongoose.model('NotificationTemplate', notificationTemplateSchema);
