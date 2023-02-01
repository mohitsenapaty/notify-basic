const { pick } = require('lodash');
const clientid = require('order-id');
const uuidAPIKey = require('uuid-apikey');
const { secretkey } = require('../../config/vars');
// const { dynamoose } = require('../../config/dynamoose');
const dynamoose = require("dynamoose");
/**
 * Client Schema
 * @private
 */
const clientSchema = new dynamoose.Schema({
  _id: {
    type: String,
    maxlength: 50,
    required: true,
    unique: true,
    default: (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
      s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))
  },
  name: {
    type: String,
    maxlength: 50,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  apikey: {
    type: String,
    required: true,
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

const clientModel = dynamoose.model("Notify-Client", clientSchema);

clientModel.methods.set("createClient", async function (data) {
  const username = clientid(secretkey).generate();
  const { uuid } = uuidAPIKey.create();
  const c = await this.create({
    ...data,
    username,
    apikey: uuid,
  });
  return c;
});

clientModel.methods.set("updateClient", async function(query, data, resetKey = false) {
  const { uuid } = uuidAPIKey.create();

  const updatedData = {
    ...data,
    ...(resetKey && { apikey: uuid }),
  };
  const client = await this.findOneAndUpdate(query, updatedData, { new: true });
  return client;
});

clientModel.methods.document.set("verifyAPIKey", async(key) => {
  return uuidAPIKey.check(key, this.apikey);
});

clientModel.serializer.add("json", {
  "include": ['id', 'name', 'description', 'username'],
  "exclude": ['apiKey'],
  "modify": (temp, orig) => ({ ...temp, 'token': uuidAPIKey.toAPIKey(orig.apikey)}),
});
clientModel.serializer.default.set("json");
/**
 * @typedef Client
 */
module.exports = clientModel;