const { pick } = require('lodash');
const mongoose = require('mongoose');

/**
 * NotificationCategory Schema
 * @private
 */
const notificationCategorySchema = new mongoose.Schema({
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

notificationCategorySchema.set('toJSON', {
  virtuals: true,
  transform: (doc) => pick(doc, ['id', 'name', 'description']),
});

/**
 * @typedef NotificationCategory
 */
module.exports = mongoose.model('NotificationCategory', notificationCategorySchema);
