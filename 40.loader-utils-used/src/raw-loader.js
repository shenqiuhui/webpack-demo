const loaderUtils = require('loader-utils');

module.exports = function (source) {
  const { name } = loaderUtils.getOptions(this);

  console.log('name', name);

  const json = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  // throw new Error('Error');
  // this.callback(new Error('Error'), json);
  // return `export default ${json}`;
  this.callback(null, json, 2, 3, 4); // 回传多个值
}
