const { isEmpty, compact, isBoolean } = require('lodash');
const dynamoose = require("dynamoose");

const id_gen = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
    s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))
/**
 * NotificationType Schema
 * @private
 */
const notificationTypeSchema = new dynamoose.Schema({
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

const notificationTypeModel = dynamoose.model("Notify-NotificationType", notificationTypeSchema);

notificationTypeModel.methods.set("createNotificationType", async function (params) {
  const createParams = {
    ...(params),
    _id: id_gen()
  }
  await dynamoose.transaction([
    this.transaction.create(createParams),
    this.transaction.create({_id: `name#${params.name}`}),
  ]);
  const notificationType = this.get({_id: createParams._id});
  return notificationType;
});

notificationTypeModel.methods.set("updateNotificationType", async function (key, params) {
  const updateName = (!isEmpty(params.name)) ? true : false;
  const archived = params.archived;
  
  const prevNotificationType = await this.get(key);
  const create = isBoolean(archived) && archived == false && prevNotificationType.archived;
  await dynamoose.transaction(compact([
    this.transaction.update(key, params),
    updateName && this.transaction.delete({_id: `name#${prevNotificationType.name}`}),
    updateName && this.transaction.create({_id: `name#${params.name}`}),
    archived && this.transaction.delete({_id: `name#${prevNotificationType.name}`}),
    create && this.transaction.create({_id: `name#${prevNotificationType.name}`}),
  ]));
  const notificationType = await this.get(key);
  return notificationType;
});

/**
 * @typedef NotificationType
 */
module.exports = notificationTypeModel;
