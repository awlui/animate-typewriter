/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed: Error: Cannot remove \\\"babel-plugin-transform-es2015-modules-commonjs\\\" from the plugin list. (While processing preset: \\\"/Users/andylui/Desktop/Git/webpackPractice/node_modules/babel-preset-es2015-webpack/index.js\\\")\\n    at Object.<anonymous> (/Users/andylui/Desktop/Git/webpackPractice/node_modules/babel-preset-es2015-webpack/index.js:35:11)\\n    at Module._compile (module.js:570:32)\\n    at Object.Module._extensions..js (module.js:579:10)\\n    at Module.load (module.js:487:32)\\n    at tryModuleLoad (module.js:446:12)\\n    at Function.Module._load (module.js:438:3)\\n    at Module.require (module.js:497:17)\\n    at require (internal/module.js:20:19)\\n    at /Users/andylui/Desktop/Git/webpackPractice/node_modules/babel-core/lib/transformation/file/options/option-manager.js:296:17\\n    at Array.map (native)\\n    at OptionManager.resolvePresets (/Users/andylui/Desktop/Git/webpackPractice/node_modules/babel-core/lib/transformation/file/options/option-manager.js:275:20)\\n    at OptionManager.mergePresets (/Users/andylui/Desktop/Git/webpackPractice/node_modules/babel-core/lib/transformation/file/options/option-manager.js:264:10)\\n    at OptionManager.mergeOptions (/Users/andylui/Desktop/Git/webpackPractice/node_modules/babel-core/lib/transformation/file/options/option-manager.js:249:14)\\n    at OptionManager.init (/Users/andylui/Desktop/Git/webpackPractice/node_modules/babel-core/lib/transformation/file/options/option-manager.js:368:12)\\n    at File.initOptions (/Users/andylui/Desktop/Git/webpackPractice/node_modules/babel-core/lib/transformation/file/index.js:212:65)\\n    at new File (/Users/andylui/Desktop/Git/webpackPractice/node_modules/babel-core/lib/transformation/file/index.js:135:24)\\n    at Pipeline.transform (/Users/andylui/Desktop/Git/webpackPractice/node_modules/babel-core/lib/transformation/pipeline.js:46:16)\\n    at transpile (/Users/andylui/Desktop/Git/webpackPractice/node_modules/babel-loader/lib/index.js:48:20)\\n    at Object.module.exports (/Users/andylui/Desktop/Git/webpackPractice/node_modules/babel-loader/lib/index.js:163:20)\");\n\n//////////////////\n// WEBPACK FOOTER\n// ./js/app.js\n// module id = 0\n// module chunks = 0\n\n//# sourceURL=webpack:///./js/app.js?");

/***/ })
/******/ ]);