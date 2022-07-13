const selectActionView = require('../templates/sales-notify/select-action.json');
const agentReadyForWebsiteBuildView = require('../templates/sales-notify/agent-ready-for-website-build.json');
const agentReadyForLeadsView = require('../templates/sales-notify/agent-ready-for-leads.json');
const {processmaker} = require('../wfe/processmaker');
const {parseFields} = require('../form/formParser');
const {fieldValidateEnum} = require('../form/fieldValidateEnum');

const notifySalesOpenModal = async ({shortcut, ack, body, client, logger}) => {
  await ack();
  try {
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: selectActionView,
    });
  } catch (error) {
    logger.error(error);
  }
};

const notifySalesLoadFields = async ({ack, body, client, action}) => {
  await ack();

  const selectedOption = action.selected_option.value;
  let fieldsView = null;

  switch (selectedOption) {
    case 'agent-ready-for-website-build':
      fieldsView = agentReadyForWebsiteBuildView;
      break;
    case 'agent-ready-for-leads':
      fieldsView = agentReadyForLeadsView;
      break;
    default:
      throw 'View ' + selectedOption + ' not found';
  }

  const result = client.views.update({
    view_id: body.view.id,
    view: fieldsView,
  });
};

const handleFormSubmit = async ({ack, view}) => {
  await ack();
  const fields = parseFields(view.state.values);
  let formHandler;
  console.log(fields);
  switch (fields['choose-action-notify-sales']) {
    case 'agent-ready-for-website-build':
      formHandler = agentReadyForWebsiteBuildHandler;
      break;
    case 'agent-ready-for-leads':
      formHandler = agentReadyForLeadsHandler;
      break;
    default:
      throw 'View ' + fields['choose-action-notify-sales'] + ' not found';
  }
  try {
    let result = formHandler(fields);
  } catch (error) {
    console.log(error);
  }
  // processmaker.createRequest(40,view.state);
};

const agentReadyForWebsiteBuildHandler = (fields) => {
  //ValidateFields
  let errors = [];
  if (!fields.agent_phone.match(fieldValidateEnum.phone)) {
    throw `Number ${fields.agent_phone} is not valid`;
  }

  if (!fields.agent_email.match(fieldValidateEnum.email)) {
    throw `Email ${fields.agent_email} is not valid`;
  }
  return 'Valid';
};

const agentReadyForLeadsHandler = (fields) => {
  //ValidateFields
  let errors = [];
  if (!fields.agent_phone.match(fieldValidateEnum.phone)) {
    throw `Number ${fields.agent_phone} is not valid`;
  }

  if (!fields.agent_email.match(fieldValidateEnum.email)) {
    throw `Email ${fields.agent_email} is not valid`;
  }
  return 'Valid';
};

module.exports = {notifySalesOpenModal, notifySalesLoadFields, handleFormSubmit};