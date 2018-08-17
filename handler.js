const axios = require('axios');
// const fs = require('fs');

const urls = [
  'http://vatsim-data.hardern.net/vatsim-data.txt',
  'http://vatsim.aircharts.org/vatsim-data.txt',
  'http://data.vattastic.com/vatsim-data.txt',
  'http://info.vroute.net/vatsim-data.txt',
];

const randomUrl = urls[Math.floor(Math.random() * urls.length)];

module.exports.fetch = (event, context, callback) => {
  axios
    .get(randomUrl)
    .then((res) => {
      const contents = res.data;
      let route = [];
      // search on pilot ID plus partial first name for unique identifier as
      // pilot names can be changed eg. Matthew Smith / Matt Smith
      // and pilot ID alone may indexed elsewhere in text
      const index = contents.indexOf(':1239164:Mat');

      if (index !== -1) {
        const tempString = contents.substring(0, index);
        const lineNumber = tempString.split('\n').length;
        const lines = contents.split('\n');

        for (let i = 0; i < lines.length; i += 1) {
          if (i === lineNumber - 1) {
            console.log(lines[i]);
            route = lines[i].split(':');
            break;
          }
        }
      }

      // index '30' of route array == route information
      let message;
      if (route[30] === '' || index === -1) {
        message = 'Flight plan not filed on VATSIM or Chewwy94 is flying offline';
      } else {
        message = route[30].toString();
      }

      const response = {
        statusCode: 200,
        body: message,
      };
      callback(null, response);
    })
    .catch((err) => {
      console.error(`Error: ' ${err}`);
      callback(`Error: Unable to fetch vatsim data from: ${randomUrl}`);
    });
};

// for testing against local data file
// module.exports.fetch = (event, context, callback) => {
//   fs.readFile('vatsim-data.txt', 'utf-8', (err, contents) => {
//     let route = [];
//     // search on pilot ID plus partial first name for unique identifier as
//     // pilot names can be changed eg. Matthew Smith / Matt Smith
//     // and pilot ID alone may indexed elsewhere in text
//     const index = contents.indexOf(':1239164:Mat');

//     if (index !== -1) {
//       const tempString = contents.substring(0, index);
//       const lineNumber = tempString.split('\n').length;
//       const lines = contents.split('\n');

//       for (let i = 0; i < lines.length; i += 1) {
//         if (i === lineNumber - 1) {
//           console.log(lines[i]);
//           route = lines[i].split(':');
//           break;
//         }
//       }
//     }

//     const message = route[30] === '' ? 'Flight plan not filed on VATSIM' : route[30].toString();

//     const response = {
//       statusCode: 200,
//       body: message,
//       headers: { 'content-type': 'text/plain' },
//     };
//     callback(null, response);
//   });
// };
