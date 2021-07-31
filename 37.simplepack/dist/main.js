(function (modules) {
      function require(filename) {
        var fn = modules[filename];
        var module = { exports: {} };

        fn(require, module, module.exports);

        return module.exports;
      }

      require('/Users/shenqiuhui/Demo/webpack-demo/37.simplepack/src/index.js');
    })({'/Users/shenqiuhui/Demo/webpack-demo/37.simplepack/src/index.js': function (require, module, exports) { "use strict";

var _greeting = require("./greeting.js");

document.write((0, _greeting.greeting)('Shen')); },'./greeting.js': function (require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.greeting = greeting;

var _country = require("./country.js");

function greeting(name) {
  return "Hello " + name + ", I'm from " + (0, _country.china)() + "!";
} },'./country.js': function (require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.china = china;
function china() {
  return 'China';
} },});