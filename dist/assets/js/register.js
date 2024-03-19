/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/register/main.js":
/*!******************************!*\
  !*** ./src/register/main.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _header_header_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../header/header.css */ \"./src/header/header.css\");\n/* harmony import */ var _footer_footer_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../footer/footer.css */ \"./src/footer/footer.css\");\n/* harmony import */ var _landing_landing_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../landing/landing.css */ \"./src/landing/landing.css\");\n/* harmony import */ var _register_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./register.css */ \"./src/register/register.css\");\n\n\n\n\nfunction validateForm() {\n  var username = document.querySelector(\"form #username\").value;\n  var usernameRegex = /^(?!.*[ ]{2,})(?!^[ ]|[ ]$)([a-zA-Z0-9_ -]{2,16})$/;\n  if (!usernameRegex.test(username)) {\n    alert(\"Invalid username\\n\\nUsername Requirements:\\n2-16 Characters\\nAlphanumeric, Space, Underscore, or Hyphen\\nNo Consecutive Spaces\\nNo Leading or Trailing Spaces\\n\");\n    return false;\n  }\n  var password = document.querySelector(\"form #password\").value;\n  var confirm = document.querySelector(\"form #confirm\").value;\n  if (password != confirm) {\n    alert(\"Passwords do not match.\");\n    return false;\n  }\n  var passwordRegex = /^(?=.*[A-Z])(?=.*\\d)[\\s\\S]{8,}$/;\n  if (!passwordRegex.test(password)) {\n    alert(\"Invalid password\\n\\nPassword Requirements:\\n8 Characters\\nAt least 1 Letter\\nAt least 1 Number\\n\");\n    return false;\n  }\n  return true;\n}\ndocument.querySelector('main form').onsubmit = validateForm;\n\n//# sourceURL=webpack://my-webpack-project/./src/register/main.js?");

/***/ }),

/***/ "./src/footer/footer.css":
/*!*******************************!*\
  !*** ./src/footer/footer.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://my-webpack-project/./src/footer/footer.css?");

/***/ }),

/***/ "./src/header/header.css":
/*!*******************************!*\
  !*** ./src/header/header.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://my-webpack-project/./src/header/header.css?");

/***/ }),

/***/ "./src/landing/landing.css":
/*!*********************************!*\
  !*** ./src/landing/landing.css ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://my-webpack-project/./src/landing/landing.css?");

/***/ }),

/***/ "./src/register/register.css":
/*!***********************************!*\
  !*** ./src/register/register.css ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://my-webpack-project/./src/register/register.css?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/register/main.js");
/******/ 	
/******/ })()
;