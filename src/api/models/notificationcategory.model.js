const { compact, isEmpty, isBoolean } = require('lodash');
const dynamoose = require("dynamoose");

const id_gen = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
    s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))

/**
 * NotificationCategory Schema
 * @private
 */
const notificationCategorySchema = new dynamoose.Schema({
  _id: {
    type: String,
    maxlength: 50,
    required: true,
    unique: true,
    hashKey: true,
    default: id_gen
  },
  name: {
    type: String,
    maxlength: 50,
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

const notificationCategoryModel = dynamoose.model("Notify-NotificationCategory", notificationCategorySchema);
/**
 * @typedef NotificationCategory
 */

notificationCategoryModel.methods.set("createNotificationCategory", async function (params) {
  const createParams = {
    ...(params),
    _id: id_gen()
  }
  await dynamoose.transaction([
    this.transaction.create(createParams),
    this.transaction.create({_id: `name#${params.name}`}),
  ]);
  const notificationCategory = this.get({_id: createParams._id});
  return notificationCategory;
});

notificationCategoryModel.methods.set("updateNotificationCategory", async function (key, params) {
  const updateName = (!isEmpty(params.name)) ? true : false;
  const archived = params.archived;
  
  const prevNotificationCategory = await this.get(key);
  const create = isBoolean(archived) && archived == false && prevNotificationCategory.archived;
  await dynamoose.transaction(compact([
    this.transaction.update(key, params),
    updateName && this.transaction.delete({_id: `name#${prevNotificationCategory.name}`}),
    updateName && this.transaction.create({_id: `name#${params.name}`}),
    archived && this.transaction.delete({_id: `name#${prevNotificationCategory.name}`}),
    create && this.transaction.create({_id: `name#${prevNotificationCategory.name}`}),
  ]));
  const notificationCategory = await this.get(key);
  return notificationCategory;
});

module.exports = notificationCategoryModel;
