const { WebClient } = require('@slack/web-api');
const Promise = require('bluebird');

const processAttachment = async (client, receiver, attachment) => {
  const content = Buffer.from(attachment.data, 'base64').toString('utf8');
  await client.files.upload({
    content,
    filename: attachment.filename,
    channels: receiver,
    title: attachment.filename,
  });
};

exports.send = async ({
  password, receiver, message, attachments,
}) => {
  const web = new WebClient(password);
  if (attachments && attachments.length > 0) {
    await Promise.map(attachments, (attachment) => processAttachment(web, receiver, attachment));
  }
  const response = await web.chat.postMessage({
    text: message,
    channel: receiver,
  });
  return {
    trackingid: response.ts,
  };
};

exports.details = () => ({
  status: 'success',
});
