const request = require("request");

const promisifiedRequest = (options) => {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (response) {
        return resolve(response);
      }
      if (error) {
        return reject(error);
      }
    });
  });
};

module.exports = {
  promisifiedRequest,
};
