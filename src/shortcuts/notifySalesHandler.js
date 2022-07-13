const selectActionView = require('../templates/sales-notify/select-action.json');
const agentReadyForWebsiteBuildView = require('../templates/sales-notify/agent-ready-for-website-build.json');
const agentReadyForLeadsView = require('../templates/sales-notify/agent-ready-for-leads.json');
const {processmaker} = require('../wfe/processmaker');

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
  try {
    validateFields(fields)
  }catch (error)
  {

  }
  // processmaker.createRequest(40,view.state);
};

const parseFields = (fields) => {
  let parsed = {};
  Object.values(fields).forEach((value, key) => {
    parsed[Object.keys(value)[0]] = getValueFromInput(Object.values(value)[0]);
  });

  return parsed;
};
const getValueFromInput = (inputObj) => {
  if (inputObj.value) {
    return inputObj.value;
  }
  if (inputObj.selected_option && inputObj.selected_option.value) {
    return inputObj.selected_option.value;
  }
  return '';
};

const validateFields = () => {

};
module.exports = {notifySalesOpenModal, notifySalesLoadFields, handleFormSubmit};