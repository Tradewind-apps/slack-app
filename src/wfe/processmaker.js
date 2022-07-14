const axios = require('axios');

const processmaker = {
  async createRequest(processId, body) {
    let result = {};
    axios.post(process.env.WFE_URL + `/process_events/${processId}`, body, {
          headers: {
            Authorization: 'Bearer ' + process.env.WFE_AUTH_TOKEN,
          },
        },
    ).then(response => {
      console.log('Created Request: '+ response.data.id);
    }).catch(response => {
      console.error(response);
    });

    return result;
  },
  getRequest() {

  },
};

module.exports = {processmaker};