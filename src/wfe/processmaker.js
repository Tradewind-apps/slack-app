const axios = require('axios');

const processmaker = {
  createRequest(processId, body) {
    axios.post(process.env.WFE_URL + `/process_events/${processId}`, {}, {
          headers: {
            Authorization: 'Bearer ' + process.env.WFE_AUTH_TOKEN,
          },
        },
    ).then(response => {
      console.log(response);
    }).catch(response => {
      console.error(response);
    });
  },
  getRequest() {

  },
};

module.exports = {processmaker};