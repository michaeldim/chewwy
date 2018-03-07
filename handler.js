const axios = require('axios');
// const fs = require('fs');

const urls = [
  'http://vatsim-data.hardern.net/vatsim-data.txt',
  'http://wazzup.flightoperationssystem.com/vatsim/vatsim-data.txt',
  'http://vatsim.aircharts.org/vatsim-data.txt',
  'http://data.vattastic.com/vatsim-data.txt',
  'http://info2.vroute.net/vatsim-data.txt',
];

const randomUrl = urls[Math.floor(Math.random() * urls.length)];

module.exports.fetch = (event, context, callback) => {
  axios
    .get(randomUrl)
    .then((res) => {
      const contents = res.data;
      let route = [];

      const index = contents.indexOf('Matthew Smith');
      route[0] = 'No route data available';

      if (index !== -1) {
        const tempString = contents.substring(0, index);
        const lineNumber = tempString.split('\n').length;
        const lines = contents.split('\n');

        for (let i = 0; i < lines.length; i += 1) {
          if (i === lineNumber - 1 && lines[i].indexOf('Matthew Smith')) {
            console.log(lines[i]);
            route = lines[i]
              .split('/:')
              .pop()
              .split(':');
            break;
          }
        }
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
//     const index = contents.indexOf('Matthew Smith');
//     const tempString = contents.substring(0, index);
//     const lineNumber = tempString.split('\n').length;

//     const lines = contents.split('\n');
//     let findRoute;
//     for (let i = 0; i < lines.length; i += 1) {
//       if (i === lineNumber - 1) {
//         // const colonSplit = lines[i].split(':');
//         findRoute = lines[i]
//           .split('/t/:')
//           .pop()
//           .split(':');
//       }
//     }
//     const route = findRoute[0];

//     const response = {
//       statusCode: 200,
//       body: route,
//       headers: { 'content-type': 'text/plain' },
//     };
//     callback(null, response);
//   });
