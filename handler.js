const axios = require('axios');
// const fs = require('fs');

const urls = [
  'http://vatsim-data.hardern.net/vatsim-data.txt',
  'http://wazzup.flightoperationssystem.com/vatsim/vatsim-data.txt',
  'http://vatsim.aircharts.org/vatsim-data.txt',
  'http://data.vattastic.com/vatsim-data.txt',
  // 'http://info2.vroute.net/vatsim-data.txt', // dead link
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
      route[0] = 'No route data available';

      if (index !== -1) {
        const tempString = contents.substring(0, index);
        const lineNumber = tempString.split('\n').length;
        const lines = contents.split('\n');

        for (let i = 0; i < lines.length; i += 1) {
          if (i === lineNumber - 1) {
            console.log(lines[i]);
            route = lines[i]
              .split('/:')
              .pop()
              .split(':');
            break;
          }
        }
      }

      if (!route[0].includes(' ')) {
        route[0] = 'Flight plan not filed';
      }

      const response = {
        statusCode: 200,
        body: route[0],
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
//     route[0] = 'No route data available';

//     if (index !== -1) {
//       const tempString = contents.substring(0, index);
//       const lineNumber = tempString.split('\n').length;
//       const lines = contents.split('\n');

//       for (let i = 0; i < lines.length; i += 1) {
//         if (i === lineNumber - 1) {
//           console.log(lines[i]);
//           route = lines[i]
//             .split('/:')
//             .pop()
//             .split(':');
//           break;
//         }
//       }
//     }

//     const response = {
//       statusCode: 200,
//       body: route[0],
//       headers: { 'content-type': 'text/plain' },
//     };
//     callback(null, response);
//   });
// };
