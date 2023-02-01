const { map, join } = require('lodash');
const AWS = require('aws-sdk');

const generateRawEmail = (options) => {
  let sesMail = `From: ${options.from}\n`;
  sesMail += options.to ? `To: ${options.to}\n` : '';
  sesMail += options.cc.length > 0 ? `CC: ${options.cc.join(', ')}\n` : '';
  sesMail += `Subject: ${options.subject}\n`;
  sesMail += 'MIME-Version: 1.0\n';
  sesMail += 'Content-Type: multipart/mixed; boundary="NextPart"\n\n';
  sesMail += '--NextPart\n';
  sesMail += 'Content-Type: text/html; charset=us-ascii\n\n';
  sesMail += `${options.content}\n\n`;
  sesMail += join(map(options.attachments, (attachment) => {
    let attachmentContent = '--NextPart\n';
    attachmentContent += `Content-Disposition: attachment; filename="${attachment.filename}"\n`;
    attachmentContent += 'Content-Transfer-Encoding: base64\n\n';
    attachmentContent += `${attachment.data}\n\n`;

    return attachmentContent;
  }), '');
  sesMail += '--NextPart--';

  return sesMail;
};

exports.send = async ({
  key, password, sender, to, message, subject, cc, attachments,
}) => {
  // update config
  AWS.config.update({
    accessKeyId: key,
    secretAccessKey: password,
    region: 'ap-south-1',
  });
  const ses = new AWS.SES();

  const options = {
    subject,
    from: sender,
    to,
    cc,
    content: message,
    attachments,
  };
  const rawEmail = generateRawEmail(options);

  const params = {
    RawMessage: {
      Data: Buffer.from(rawEmail),
    },
    Source: sender,
  };
  const response = await ses.sendRawEmail(params).promise();
  return {
    trackingid: response.MessageId,
  };
};

exports.details = () => ({
  status: 'success',
});
