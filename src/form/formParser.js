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

module.exports = {parseFields};