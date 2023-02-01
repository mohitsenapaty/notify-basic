const TelegramBot = require('node-telegram-bot-api');

exports.send = async ({
  password, receiver, message,
}) => {
  const bot = new TelegramBot(password);
  const response = await bot.sendMessage(receiver, message, {
    parse_mode: 'Markdown',
  });
  return {
    trackingid: response.message_id,
  };
};

exports.details = () => ({
  status: 'success',
});
