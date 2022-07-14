const selectActionView = require('../templates/sales-notify/select-action.json');
const agentReadyForWebsiteBuildView = require('../templates/sales-notify/agent-ready-for-website-build.json');
const agentReadyForLeadsView = require('../templates/sales-notify/agent-ready-for-leads.json');
const {processmaker} = require('../wfe/processmaker');
const {parseFields} = require('../form/formParser');
const {fieldValidateEnum} = require('../form/fieldValidateEnum');

const notifySalesOpenModal = async ({shortcut, ack, body, client, logger}) => {
  await ack();
  try {
    await client.views.open({
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

  const fields = parseFields(view.state.values);
  let formHandler;

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
    await ack()
  } catch (error) {
    console.log(error);
    await ack(error);
  }
};

const  agentReadyForWebsiteBuildHandler = async (fields) => {
  //ValidateFields
  let errors = {};

  if (!fields.agent_phone.match(fieldValidateEnum.phone)) {
    errors.agent_phone = `Number ${fields.agent_phone} is not valid`;
  }

  if (!fields.agent_email.match(fieldValidateEnum.email)) {
    errors.agent_email = `Email ${fields.agent_email} is not valid`;
  }

  if (Object.keys(errors).length) {
    throw {'response_action': 'errors', errors: errors};
  }

  processmaker.createRequest(40);
};

const agentReadyForLeadsHandler = (fields) => {
  //ValidateFields
  let errors = {};

  if (!fields.agent_phone.match(fieldValidateEnum.phone)) {
    errors.agent_phone = `Number ${fields.agent_phone} is not valid`;
  }

  if (!fields.agent_email.match(fieldValidateEnum.email)) {
    errors.agent_email = `Email ${fields.agent_email} is not valid`;
  }

  if (Object.keys(errors).length) {
    throw {'response_action': 'errors', errors: errors};
  }
  processmaker.createRequest(40);
};

module.exports = {notifySalesOpenModal, notifySalesLoadFields, handleFormSubmit};