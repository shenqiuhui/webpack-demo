const fs = require('fs');
const path = require('path');
const { runLoaders } = require('loader-runner');

runLoaders({
  resource: './loaders/index.css',
  loaders: [
    path.join(__dirname, './loaders/sprite-loader')
  ],
  context: { minimize: true },
  readResource: fs.readFile.bind(fs)
}, function (err, result) {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
});
