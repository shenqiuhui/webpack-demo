(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

;// CONCATENATED MODULE: ./src/common/index.js
function helloworld() {
  return 'Hello webpack';
}
function hiworld() {
  return 'Hi webpack';
}
;// CONCATENATED MODULE: ./src/common/scope-hoisting.js
function sum(a, b) {
  console.log('This func sum');
  return a + b;
}
;
function minus(a, b) {
  console.log('This func minus');
  return a - b;
}
;
;// CONCATENATED MODULE: ./src/pages/index/index-server.js


sum(2, 1);
minus(2, 1);
helloworld();
/******/ 	return __webpack_exports__;
/******/ })()
;
});