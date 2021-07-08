if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/lager-number.min.js');
} else {
  module.exports = require('./dist/lager-number.js');
}
