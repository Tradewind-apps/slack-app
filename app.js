require('dotenv').config();

const {App} = require('@slack/bolt');
const {notifySalesOpenModal, notifySalesLoadFields, handleFormSubmit} = require('./src/shortcuts/notifySalesHandler');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.APP_TOKEN,
  socketMode: true,
});

app.shortcut('notifySalesModal', notifySalesOpenModal);
app.action('choose-action-notify-sales', notifySalesLoadFields);
app.view('notify-sales-modal', handleFormSubmit);

(async () => {
  await app.start();
  console.log('⚡️ Bolt app started');
})();