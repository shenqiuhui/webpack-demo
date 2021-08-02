const loaderUtils = require('loader-utils');
const fs = require('fs');
const path = require('path');

module.exports = function (source) {
  const { name } = loaderUtils.getOptions(this);
  const callback = this.async();
  console.log('name', name);

  const json = source.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

  fs.readFile(path.join(__dirname, './async.txt'), 'utf-8', (err, data) => {
    if (err) {
      callback(err, '');
    }
    callback(null, json + data);
  });
  // throw new Error('Error');
  // this.callback(new Error('Error'), json);
  // return `export default ${json}`;
  // this.callback(null, json, 2, 3, 4); // 回传多个值
}
