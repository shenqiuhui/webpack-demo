const fs = require('fs');
const path = require('path');
const { runLoaders } = require('loader-runner');

runLoaders({
  resource: path.join(__dirname, './src/demo.txt'),
  loaders: [
    {
      loader: path.join(__dirname, './src/raw-loader.js'),
      options: {
        name: 'test'
      }
    }
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
