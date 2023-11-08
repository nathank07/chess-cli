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

/***/ "./src/chess/board.js":
/*!****************************!*\
  !*** ./src/chess/board.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   loadGame: () => (/* binding */ loadGame)\n/* harmony export */ });\n/* harmony import */ var _pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pieces/piece.js */ \"./src/chess/pieces/piece.js\");\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\nfunction _iterableToArray(iter) { if (typeof Symbol !== \"undefined\" && iter[Symbol.iterator] != null || iter[\"@@iterator\"] != null) return Array.from(iter); }\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }\n\nvar chessGame = {\n  board: _toConsumableArray(Array(8)).map(function (e) {\n    return Array(8).fill(null);\n  }),\n  whitesMove: true,\n  whiteState: {\n    shortCastle: true,\n    longCastle: true\n  },\n  blackState: {\n    shortCastle: true,\n    longCastle: true\n  }\n};\nfunction renderBoard() {\n  var boardDiv = document.querySelector(\"#board\");\n  boardDiv.innerHTML = \"\";\n  var darkSquare = false;\n  chessGame.board.forEach(function (row) {\n    row.forEach(function (square) {\n      var div = document.createElement('div');\n      div.classList.add(\"square\");\n      darkSquare = !darkSquare;\n      if (darkSquare) {\n        div.classList.add('darkSquare');\n      }\n      var pieceSvg = square ? square.svg : false;\n      if (pieceSvg) {\n        var svg = document.createElement('img');\n        svg.src = pieceSvg;\n        (0,_pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__.makeDraggable)(square, svg, renderBoard);\n        div.appendChild(svg);\n      }\n      boardDiv.appendChild(div);\n    });\n    darkSquare = !darkSquare;\n  });\n  return document.querySelector(\"#board img\");\n}\nfunction loadGame() {\n  for (var i = 0; i < 8; i++) {\n    (0,_pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"pawn\", true, 1, i);\n    (0,_pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"pawn\", false, 6, i);\n  }\n  (0,_pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"rook\", true, 0, 0);\n  (0,_pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"rook\", true, 0, 7);\n  (0,_pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"rook\", false, 7, 7);\n  (0,_pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"rook\", false, 7, 0);\n  (0,_pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"knight\", true, 0, 1);\n  (0,_pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"knight\", true, 0, 6);\n  (0,_pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"knight\", false, 7, 6);\n  (0,_pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"knight\", false, 7, 1);\n  (0,_pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"bishop\", true, 0, 2);\n  (0,_pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"bishop\", true, 0, 5);\n  (0,_pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"bishop\", false, 7, 5);\n  (0,_pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"bishop\", false, 7, 2);\n  (0,_pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"queen\", true, 0, 4);\n  (0,_pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"king\", false, 7, 3);\n  (0,_pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"queen\", false, 7, 4);\n  (0,_pieces_piece_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"king\", true, 0, 3);\n  renderBoard();\n  console.log(chessGame);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (chessGame);\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/board.js?");

/***/ }),

/***/ "./src/chess/pieces/bishop.js":
/*!************************************!*\
  !*** ./src/chess/pieces/bishop.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Bishop)\n/* harmony export */ });\n/* harmony import */ var _piece_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./piece.js */ \"./src/chess/pieces/piece.js\");\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }\nfunction _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : \"undefined\" != typeof Symbol && arr[Symbol.iterator] || arr[\"@@iterator\"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i[\"return\"] && (_r = _i[\"return\"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\nfunction Bishop(_ref) {\n  var isWhite = _ref.isWhite,\n    xPos = _ref.xPos,\n    yPos = _ref.yPos,\n    game = _ref.game;\n  var piece = (0,_piece_js__WEBPACK_IMPORTED_MODULE_0__.Piece)({\n    name: \"bishop\",\n    isWhite: isWhite,\n    xPos: xPos,\n    yPos: yPos,\n    game: game,\n    standardMoves: function standardMoves() {\n      var directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];\n      var moves = [];\n      for (var _i = 0, _directions = directions; _i < _directions.length; _i++) {\n        var direction = _directions[_i];\n        var _direction = _slicedToArray(direction, 2),\n          dx = _direction[0],\n          dy = _direction[1];\n        var x = xPos + dx;\n        var y = yPos + dy;\n        while (!(0,_piece_js__WEBPACK_IMPORTED_MODULE_0__.outOfBounds)(x, y)) {\n          if (game.board[x][y] === null || piece.canCapture(game.board[x][y])) {\n            moves.push([x, y]);\n            if (piece.canCapture(game.board[x][y]) && game.board[x][y].name !== \"passant\") {\n              break;\n            }\n          } else {\n            break;\n          }\n          x += dx;\n          y += dy;\n        }\n      }\n      return moves;\n    }\n  });\n  return piece;\n}\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/pieces/bishop.js?");

/***/ }),

/***/ "./src/chess/pieces/king.js":
/*!**********************************!*\
  !*** ./src/chess/pieces/king.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ King)\n/* harmony export */ });\n/* harmony import */ var _piece_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./piece.js */ \"./src/chess/pieces/piece.js\");\n\nfunction King(_ref) {\n  var isWhite = _ref.isWhite,\n    xPos = _ref.xPos,\n    yPos = _ref.yPos,\n    game = _ref.game;\n  var piece = (0,_piece_js__WEBPACK_IMPORTED_MODULE_0__.Piece)({\n    name: \"king\",\n    isWhite: isWhite,\n    xPos: xPos,\n    yPos: yPos,\n    game: game,\n    standardMoves: function standardMoves() {\n      var moves = [];\n      var canCastle = game.whiteState === undefined ? false : checkCastleLegality(isWhite, game);\n      var castleState = isWhite ? game.whiteState : game.blackState;\n      var kingRow = isWhite ? 0 : 7;\n      for (var i = -1; i <= 1; i++) {\n        var x = i + xPos;\n        for (var j = -1; j <= 1; j++) {\n          var y = j + yPos;\n          if ((0,_piece_js__WEBPACK_IMPORTED_MODULE_0__.outOfBounds)(x, y)) {\n            continue;\n          }\n          if (game.board[x][y] === null || piece.canCapture(game.board[x][y])) {\n            moves.push([x, y, function () {\n              castleState.longCastle = false;\n              castleState.shortCastle = false;\n            }]);\n          }\n        }\n      }\n      if (canCastle) {\n        if (canCastle[\"short\"]) {\n          moves.push([kingRow, 1, function () {\n            castleState.longCastle = false;\n            castleState.shortCastle = false;\n            game.board[kingRow][0] = null;\n            createPiece(\"rook\", isWhite, kingRow, 2, game);\n          }]);\n        }\n        if (canCastle[\"long\"]) {\n          moves.push([kingRow, 5, function () {\n            castleState.longCastle = false;\n            castleState.shortCastle = false;\n            game.board[kingRow][7] = null;\n            createPiece(\"rook\", isWhite, kingRow, 4, game);\n          }]);\n        }\n      }\n      return moves;\n    }\n  });\n  piece.inCheck = function () {\n    for (var i = 0; i < 8; i++) {\n      for (var j = 0; j < 8; j++) {\n        if (game.board[i][j] && game.board[i][j].standardMoves().some(function (pos) {\n          return pos[0] === xPos && pos[1] === yPos;\n        })) {\n          return true;\n        }\n      }\n    }\n    return false;\n  };\n  return piece;\n}\nfunction checkCastleLegality(isWhite, game) {\n  var castleState = isWhite ? game.whiteState : game.blackState;\n  var kingRow = isWhite ? 0 : 7;\n  if (castleState === undefined || !castleState.shortCastle && !castleState.longCastle) {\n    return false;\n  }\n  // Get all of the moves here instead of isLegal because these don't have to be legal captures\n  var moves = [];\n  var boardClone = (0,_piece_js__WEBPACK_IMPORTED_MODULE_0__.cloneBoard)(game.board);\n  for (var i = 0; i < 8; i++) {\n    for (var j = 0; j < 8; j++) {\n      if (game.board[i][j] && game.board[i][j].isWhite === !isWhite) {\n        boardClone[i][j].standardMoves().map(function (move) {\n          return moves.push(move);\n        });\n      }\n    }\n  }\n  var _short = true;\n  var _long = true;\n  if (castleState.shortCastle) {\n    if (moves.some(function (move) {\n      return move[0] === kingRow && move[1] === 2;\n    }) || moves.some(function (move) {\n      return move[0] === kingRow && move[1] === 1;\n    })) {\n      _short = false;\n    }\n  }\n  if (castleState.longCastle) {\n    if (moves.some(function (move) {\n      return move[0] === kingRow && move[1] === 4;\n    }) || moves.some(function (move) {\n      return move[0] === kingRow && move[1] === 5;\n    })) {\n      _long = false;\n    }\n  }\n  return {\n    \"short\": _short,\n    \"long\": _long\n  };\n}\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/pieces/king.js?");

/***/ }),

/***/ "./src/chess/pieces/knight.js":
/*!************************************!*\
  !*** ./src/chess/pieces/knight.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Knight)\n/* harmony export */ });\n/* harmony import */ var _piece_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./piece.js */ \"./src/chess/pieces/piece.js\");\n\nfunction Knight(_ref) {\n  var isWhite = _ref.isWhite,\n    xPos = _ref.xPos,\n    yPos = _ref.yPos,\n    game = _ref.game;\n  var piece = (0,_piece_js__WEBPACK_IMPORTED_MODULE_0__.Piece)({\n    name: \"knight\",\n    isWhite: isWhite,\n    xPos: xPos,\n    yPos: yPos,\n    game: game,\n    standardMoves: function standardMoves() {\n      var moves = [];\n      var knightMoves = [[2, 1], [1, 2], [-2, 1], [-1, 2], [2, -1], [1, -2], [-2, -1], [-1, -2]];\n      knightMoves.forEach(function (move) {\n        var x = xPos + move[0];\n        var y = yPos + move[1];\n        if (!(0,_piece_js__WEBPACK_IMPORTED_MODULE_0__.outOfBounds)(x, y) && (game.board[x][y] === null || piece.canCapture(game.board[x][y]))) {\n          moves.push([x, y]);\n        }\n      });\n      return moves;\n    }\n  });\n  return piece;\n}\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/pieces/knight.js?");

/***/ }),

/***/ "./src/chess/pieces/pawn.js":
/*!**********************************!*\
  !*** ./src/chess/pieces/pawn.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Pawn)\n/* harmony export */ });\n/* harmony import */ var _piece_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./piece.js */ \"./src/chess/pieces/piece.js\");\n\nfunction Pawn(_ref) {\n  var isWhite = _ref.isWhite,\n    xPos = _ref.xPos,\n    yPos = _ref.yPos,\n    game = _ref.game;\n  var piece = (0,_piece_js__WEBPACK_IMPORTED_MODULE_0__.Piece)({\n    name: \"pawn\",\n    isWhite: isWhite,\n    xPos: xPos,\n    yPos: yPos,\n    game: game,\n    standardMoves: function standardMoves() {\n      var direction = isWhite ? 1 : -1;\n      var starting = isWhite ? xPos === 1 : xPos === 6;\n      var moves = [];\n      var _loop = function _loop() {\n        var x = xPos + direction;\n        var y = yPos + i;\n        if ((0,_piece_js__WEBPACK_IMPORTED_MODULE_0__.outOfBounds)(x, y)) {\n          return \"continue\";\n        }\n        if (i !== 0 && piece.canCapture(game.board[x][y])) {\n          if (game.board[x][y].name === \"passant\") {\n            moves.push([x, y, function () {\n              game.board[x - direction][y] = null;\n            }]);\n          }\n          moves.push([x, y]);\n        } else if (i === 0 && game.board[xPos + direction][y] == null) {\n          if (starting && game.board[xPos + direction * 2][y] == null) {\n            // add en passant object for this move\n            moves.push([xPos + direction * 2, y, function () {\n              (0,_piece_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(\"passant\", isWhite, xPos + direction, y, game);\n            }]);\n          }\n          moves.push([x, y]);\n        }\n      };\n      for (var i = -1; i <= 1; i++) {\n        var _ret = _loop();\n        if (_ret === \"continue\") continue;\n      }\n      return moves;\n    }\n  });\n  return piece;\n}\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/pieces/pawn.js?");

/***/ }),

/***/ "./src/chess/pieces/piece.js":
/*!***********************************!*\
  !*** ./src/chess/pieces/piece.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Piece: () => (/* binding */ Piece),\n/* harmony export */   cloneBoard: () => (/* binding */ cloneBoard),\n/* harmony export */   \"default\": () => (/* binding */ createPiece),\n/* harmony export */   makeDraggable: () => (/* binding */ makeDraggable),\n/* harmony export */   outOfBounds: () => (/* binding */ outOfBounds)\n/* harmony export */ });\n/* harmony import */ var _board_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../board.js */ \"./src/chess/board.js\");\n/* harmony import */ var _king_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./king.js */ \"./src/chess/pieces/king.js\");\n/* harmony import */ var _queen_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./queen.js */ \"./src/chess/pieces/queen.js\");\n/* harmony import */ var _rook_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./rook.js */ \"./src/chess/pieces/rook.js\");\n/* harmony import */ var _knight_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./knight.js */ \"./src/chess/pieces/knight.js\");\n/* harmony import */ var _bishop_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./bishop.js */ \"./src/chess/pieces/bishop.js\");\n/* harmony import */ var _pawn_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pawn.js */ \"./src/chess/pieces/pawn.js\");\n/* harmony import */ var _cburnett_bK_svg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../cburnett/bK.svg */ \"./src/chess/cburnett/bK.svg\");\n/* harmony import */ var _cburnett_wK_svg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../cburnett/wK.svg */ \"./src/chess/cburnett/wK.svg\");\n/* harmony import */ var _cburnett_bQ_svg__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../cburnett/bQ.svg */ \"./src/chess/cburnett/bQ.svg\");\n/* harmony import */ var _cburnett_wQ_svg__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../cburnett/wQ.svg */ \"./src/chess/cburnett/wQ.svg\");\n/* harmony import */ var _cburnett_bR_svg__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../cburnett/bR.svg */ \"./src/chess/cburnett/bR.svg\");\n/* harmony import */ var _cburnett_wR_svg__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../cburnett/wR.svg */ \"./src/chess/cburnett/wR.svg\");\n/* harmony import */ var _cburnett_bB_svg__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../cburnett/bB.svg */ \"./src/chess/cburnett/bB.svg\");\n/* harmony import */ var _cburnett_wB_svg__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../cburnett/wB.svg */ \"./src/chess/cburnett/wB.svg\");\n/* harmony import */ var _cburnett_bN_svg__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../cburnett/bN.svg */ \"./src/chess/cburnett/bN.svg\");\n/* harmony import */ var _cburnett_wN_svg__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../cburnett/wN.svg */ \"./src/chess/cburnett/wN.svg\");\n/* harmony import */ var _cburnett_bP_svg__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../cburnett/bP.svg */ \"./src/chess/cburnett/bP.svg\");\n/* harmony import */ var _cburnett_wP_svg__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../cburnett/wP.svg */ \"./src/chess/cburnett/wP.svg\");\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; return _typeof = \"function\" == typeof Symbol && \"symbol\" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && \"function\" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }, _typeof(obj); }\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }\nfunction _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\nfunction _toPropertyKey(arg) { var key = _toPrimitive(arg, \"string\"); return _typeof(key) === \"symbol\" ? key : String(key); }\nfunction _toPrimitive(input, hint) { if (_typeof(input) !== \"object\" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || \"default\"); if (_typeof(res) !== \"object\") return res; throw new TypeError(\"@@toPrimitive must return a primitive value.\"); } return (hint === \"string\" ? String : Number)(input); }\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\nfunction _iterableToArray(iter) { if (typeof Symbol !== \"undefined\" && iter[Symbol.iterator] != null || iter[\"@@iterator\"] != null) return Array.from(iter); }\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nvar blackPieces = {\n  \"pawn\": _cburnett_bP_svg__WEBPACK_IMPORTED_MODULE_17__,\n  \"king\": _cburnett_bK_svg__WEBPACK_IMPORTED_MODULE_7__,\n  \"queen\": _cburnett_bQ_svg__WEBPACK_IMPORTED_MODULE_9__,\n  \"bishop\": _cburnett_bB_svg__WEBPACK_IMPORTED_MODULE_13__,\n  \"knight\": _cburnett_bN_svg__WEBPACK_IMPORTED_MODULE_15__,\n  \"rook\": _cburnett_bR_svg__WEBPACK_IMPORTED_MODULE_11__\n};\nvar whitePieces = {\n  \"pawn\": _cburnett_wP_svg__WEBPACK_IMPORTED_MODULE_18__,\n  \"king\": _cburnett_wK_svg__WEBPACK_IMPORTED_MODULE_8__,\n  \"queen\": _cburnett_wQ_svg__WEBPACK_IMPORTED_MODULE_10__,\n  \"bishop\": _cburnett_wB_svg__WEBPACK_IMPORTED_MODULE_14__,\n  \"knight\": _cburnett_wN_svg__WEBPACK_IMPORTED_MODULE_16__,\n  \"rook\": _cburnett_wR_svg__WEBPACK_IMPORTED_MODULE_12__\n};\nfunction Piece(_ref) {\n  var name = _ref.name,\n    isWhite = _ref.isWhite,\n    xPos = _ref.xPos,\n    yPos = _ref.yPos,\n    standardMoves = _ref.standardMoves,\n    game = _ref.game;\n  return {\n    name: name,\n    isWhite: isWhite,\n    xPos: xPos,\n    yPos: yPos,\n    standardMoves: standardMoves,\n    game: game,\n    svg: isWhite ? whitePieces[name] || false : blackPieces[name] || false,\n    canCapture: function canCapture(capturedPiece) {\n      return capturedPiece ? isWhite !== capturedPiece.isWhite : false;\n    },\n    move: function move(toX, toY) {\n      var moves = filterLegal(xPos, yPos, isWhite, standardMoves(), game.board);\n      if (game.whitesMove === isWhite && moves.some(function (pos) {\n        return pos[0] === toX && pos[1] === toY;\n      })) {\n        var index = moves.findIndex(function (pos) {\n          return pos[0] === toX && pos[1] === toY;\n        });\n        // Remove any en passant remnants\n        for (var i = 0; i < 8; i++) {\n          if (game.board[2][i] && game.board[2][i].name === \"passant\") {\n            game.board[2][i] = null;\n            break;\n          }\n          if (game.board[5][i] && game.board[5][i].name === \"passant\") {\n            game.board[5][i] = null;\n            break;\n          }\n        }\n\n        // Move piece and change side's move\n        createPiece(name, isWhite, toX, toY, game);\n        game.board[xPos][yPos] = null;\n        game.whitesMove = !game.whitesMove;\n\n        // Any additional things you may want a piece to do\n        if (moves[index].length > 2) {\n          moves[index][2]();\n        }\n        return true;\n      }\n      return false;\n    }\n  };\n}\nfunction makeDraggable(square, svg, renderBoard) {\n  var drag;\n  var size = svg.offsetWidth;\n  svg.addEventListener('mousedown', function (e) {\n    e.preventDefault();\n    if (e.buttons === 1) {\n      drag = true;\n      // Set size here everytime in case user resizes window\n      size = svg.offsetWidth;\n      moveToCursor(e, svg, size);\n    } else {\n      drag = false;\n      renderBoard();\n    }\n  });\n  document.addEventListener('mousemove', function (e) {\n    e.preventDefault();\n    if (e.buttons === 1 && drag) {\n      moveToCursor(e, svg, size);\n    }\n  });\n  svg.addEventListener('mouseup', function (e) {\n    e.preventDefault();\n    drag = false;\n    var move = hoveredSquare(e);\n    if (move) {\n      square.move(move[0], move[1]);\n    }\n    renderBoard();\n  });\n}\nfunction moveToCursor(event, svg, size) {\n  // Using fixed style here instead of transform because \n  // transform did not work for some users\n  svg.style.position = \"fixed\";\n  svg.style.width = \"\".concat(size, \"px\");\n  svg.style.height = \"\".concat(size, \"px\");\n  var x = event.clientX - size / 2;\n  var y = event.clientY - size / 2;\n  svg.style.left = \"\".concat(x, \"px\");\n  svg.style.top = \"\".concat(y, \"px\");\n}\nfunction hoveredSquare(event) {\n  // Cannot use :hover because while dragging child div it will target parent div\n  // instead of div lower and pointer-style: none breaks event listeners\n  var board = document.querySelector(\"#board\").getBoundingClientRect();\n  var squareWidth = board.width / 8;\n  var x = event.clientX - board.left;\n  var y = event.clientY - board.top;\n  // If cursor not in the board return null\n  if (x > board.width || x < 0 || y > board.width || y < 0) {\n    return null;\n  }\n  return [Math.trunc(y / squareWidth), Math.trunc(x / squareWidth)];\n}\nfunction isLegal(fromX, fromY, toX, toY, isWhite, board) {\n  var boardClone = cloneBoard(board);\n  var piece = boardClone[fromX][fromY];\n  createPiece(piece.name, piece.isWhite, toX, toY, {\n    board: boardClone\n  });\n  boardClone[fromX][fromY] = null;\n  var kingSquare;\n  var moves = [];\n  for (var i = 0; i < 8; i++) {\n    for (var j = 0; j < 8; j++) {\n      if (boardClone[i][j]) {\n        var pieceMoves = boardClone[i][j].standardMoves();\n        var color = boardClone[i][j].isWhite;\n        if (boardClone[i][j].name == \"king\" && color == isWhite) {\n          kingSquare = [i, j];\n        }\n        if (color != isWhite) {\n          pieceMoves.map(function (move) {\n            return moves.push(move);\n          });\n        }\n      }\n    }\n  }\n  if (kingSquare && moves.some(function (move) {\n    return move[0] === kingSquare[0] && move[1] === kingSquare[1];\n  })) {\n    return false;\n  }\n  return true;\n}\nfunction filterLegal(xPos, yPos, isWhite, standardMoves, board) {\n  return standardMoves.filter(function (move) {\n    return isLegal(xPos, yPos, move[0], move[1], isWhite, board);\n  });\n}\nfunction cloneBoard(board) {\n  var newBoard = _toConsumableArray(Array(8)).map(function (e) {\n    return Array(8).fill(null);\n  });\n  for (var x = 0; x < 8; x++) {\n    for (var y = 0; y < 8; y++) {\n      if (board[x][y]) {\n        createPiece(board[x][y].name, board[x][y].isWhite, x, y, {\n          board: newBoard\n        });\n      }\n    }\n  }\n  return newBoard;\n}\nfunction outOfBounds(x, y) {\n  return x < 0 || y < 0 || x >= 8 || y >= 8;\n}\nfunction createPiece(piece, isWhite, xPos, yPos) {\n  var _Piece;\n  var game = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _board_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"];\n  var createdPiece = {};\n  var pieceInfo = {\n    isWhite: isWhite,\n    xPos: xPos,\n    yPos: yPos,\n    game: game\n  };\n  switch (piece) {\n    case \"pawn\":\n      createdPiece = (0,_pawn_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"])(pieceInfo);\n      break;\n    case \"king\":\n      createdPiece = (0,_king_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(pieceInfo);\n      break;\n    case \"knight\":\n      createdPiece = (0,_knight_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(pieceInfo);\n      break;\n    case \"rook\":\n      createdPiece = (0,_rook_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(pieceInfo);\n      break;\n    case \"bishop\":\n      createdPiece = (0,_bishop_js__WEBPACK_IMPORTED_MODULE_5__[\"default\"])(pieceInfo);\n      break;\n    case \"queen\":\n      createdPiece = (0,_queen_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(pieceInfo);\n      break;\n    default:\n      createdPiece = {\n        standardMoves: function standardMoves() {\n          return [];\n        }\n      };\n      break;\n  }\n  var genericPiece = Piece((_Piece = {\n    name: piece,\n    isWhite: isWhite,\n    xPos: xPos,\n    yPos: yPos\n  }, _defineProperty(_Piece, \"yPos\", yPos), _defineProperty(_Piece, \"standardMoves\", createdPiece.standardMoves), _defineProperty(_Piece, \"game\", game), _Piece));\n  game.board[xPos][yPos] = _objectSpread(_objectSpread({}, genericPiece), createdPiece);\n  return game.board[xPos][yPos];\n}\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/pieces/piece.js?");

/***/ }),

/***/ "./src/chess/pieces/queen.js":
/*!***********************************!*\
  !*** ./src/chess/pieces/queen.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Queen)\n/* harmony export */ });\n/* harmony import */ var _rook_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rook.js */ \"./src/chess/pieces/rook.js\");\n/* harmony import */ var _bishop_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bishop.js */ \"./src/chess/pieces/bishop.js\");\n/* harmony import */ var _piece_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./piece.js */ \"./src/chess/pieces/piece.js\");\n\n\n\nfunction Queen(_ref) {\n  var isWhite = _ref.isWhite,\n    xPos = _ref.xPos,\n    yPos = _ref.yPos,\n    game = _ref.game;\n  var piece = (0,_piece_js__WEBPACK_IMPORTED_MODULE_2__.Piece)({\n    name: \"queen\",\n    isWhite: isWhite,\n    xPos: xPos,\n    yPos: yPos,\n    game: game,\n    standardMoves: function standardMoves() {\n      var bishop = (0,_bishop_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n        isWhite: isWhite,\n        xPos: xPos,\n        yPos: yPos,\n        game: game\n      });\n      var rook = (0,_rook_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n        isWhite: isWhite,\n        xPos: xPos,\n        yPos: yPos,\n        game: game\n      });\n      return bishop.standardMoves().concat(rook.standardMoves());\n    }\n  });\n  return piece;\n}\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/pieces/queen.js?");

/***/ }),

/***/ "./src/chess/pieces/rook.js":
/*!**********************************!*\
  !*** ./src/chess/pieces/rook.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Rook)\n/* harmony export */ });\n/* harmony import */ var _piece_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./piece.js */ \"./src/chess/pieces/piece.js\");\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }\nfunction _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : \"undefined\" != typeof Symbol && arr[Symbol.iterator] || arr[\"@@iterator\"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i[\"return\"] && (_r = _i[\"return\"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\nfunction Rook(_ref) {\n  var isWhite = _ref.isWhite,\n    xPos = _ref.xPos,\n    yPos = _ref.yPos,\n    game = _ref.game;\n  var piece = (0,_piece_js__WEBPACK_IMPORTED_MODULE_0__.Piece)({\n    name: \"rook\",\n    isWhite: isWhite,\n    xPos: xPos,\n    yPos: yPos,\n    game: game,\n    standardMoves: function standardMoves() {\n      var directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];\n      var moves = [];\n      for (var _i = 0, _directions = directions; _i < _directions.length; _i++) {\n        var direction = _directions[_i];\n        var _direction = _slicedToArray(direction, 2),\n          dx = _direction[0],\n          dy = _direction[1];\n        var x = xPos + dx;\n        var y = yPos + dy;\n        while (!(0,_piece_js__WEBPACK_IMPORTED_MODULE_0__.outOfBounds)(x, y)) {\n          if (game.board[x][y] === null || piece.canCapture(game.board[x][y])) {\n            moves.push([x, y, function () {\n              if (xPos === 0 && yPos === 0) {\n                game.whiteState.shortCastle = false;\n              }\n              if (xPos === 0 && yPos === 7) {\n                game.whiteState.longCastle = false;\n              }\n              if (xPos === 7 && yPos === 0) {\n                game.blackState.shortCastle = false;\n              }\n              if (xPos === 7 && yPos === 7) {\n                game.blackState.longCastle = false;\n              }\n            }]);\n            if (piece.canCapture(game.board[x][y]) && game.board[x][y].name !== \"passant\") {\n              break;\n            }\n          } else {\n            break;\n          }\n          x += dx;\n          y += dy;\n        }\n      }\n      return moves;\n    }\n  });\n  return piece;\n}\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/pieces/rook.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.css */ \"./src/styles.css\");\n/* harmony import */ var _chess_board_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chess/board.js */ \"./src/chess/board.js\");\n\n\n(0,_chess_board_js__WEBPACK_IMPORTED_MODULE_1__.loadGame)();\n\n//# sourceURL=webpack://my-webpack-project/./src/main.js?");

/***/ }),

/***/ "./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://my-webpack-project/./src/styles.css?");

/***/ }),

/***/ "./src/chess/cburnett/bB.svg":
/*!***********************************!*\
  !*** ./src/chess/cburnett/bB.svg ***!
  \***********************************/
/***/ ((module) => {

eval("module.exports = \"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxnIGZpbGw9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ij48cGF0aCBkPSJNOSAzNmMzLjM5LS45NyAxMC4xMS40MyAxMy41LTIgMy4zOSAyLjQzIDEwLjExIDEuMDMgMTMuNSAyIDAgMCAxLjY1LjU0IDMgMi0uNjguOTctMS42NS45OS0zIC41LTMuMzktLjk3LTEwLjExLjQ2LTEzLjUtMS0zLjM5IDEuNDYtMTAuMTEuMDMtMTMuNSAxLTEuMzU0LjQ5LTIuMzIzLjQ3LTMtLjUgMS4zNTQtMS45NCAzLTIgMy0yeiIvPjxwYXRoIGQ9Ik0xNSAzMmMyLjUgMi41IDEyLjUgMi41IDE1IDAgLjUtMS41IDAtMiAwLTIgMC0yLjUtMi41LTQtMi41LTQgNS41LTEuNSA2LTExLjUtNS0xNS41LTExIDQtMTAuNSAxNC01IDE1LjUgMCAwLTIuNSAxLjUtMi41IDQgMCAwLS41LjUgMCAyeiIvPjxwYXRoIGQ9Ik0yNSA4YTIuNSAyLjUgMCAxIDEtNSAwIDIuNSAyLjUgMCAxIDEgNSAweiIvPjwvZz48cGF0aCBkPSJNMTcuNSAyNmgxME0xNSAzMGgxNW0tNy41LTE0LjV2NU0yMCAxOGg1IiBzdHJva2U9IiNlY2VjZWMiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48L2c+PC9zdmc+\";\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/cburnett/bB.svg?");

/***/ }),

/***/ "./src/chess/cburnett/bK.svg":
/*!***********************************!*\
  !*** ./src/chess/cburnett/bK.svg ***!
  \***********************************/
/***/ ((module) => {

eval("module.exports = \"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMi41IDExLjYzVjYiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMjIuNSAyNXM0LjUtNy41IDMtMTAuNWMwIDAtMS0yLjUtMy0yLjVzLTMgMi41LTMgMi41Yy0xLjUgMyAzIDEwLjUgMyAxMC41IiBmaWxsPSIjMDAwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjxwYXRoIGQ9Ik0xMS41IDM3YzUuNSAzLjUgMTUuNSAzLjUgMjEgMHYtN3M5LTQuNSA2LTEwLjVjLTQtNi41LTEzLjUtMy41LTE2IDRWMjd2LTMuNWMtMy41LTcuNS0xMy0xMC41LTE2LTQtMyA2IDUgMTAgNSAxMFYzN3oiIGZpbGw9IiMwMDAiLz48cGF0aCBkPSJNMjAgOGg1IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTMyIDI5LjVzOC41LTQgNi4wMy05LjY1QzM0LjE1IDE0IDI1IDE4IDIyLjUgMjQuNWwuMDEgMi4xLS4wMS0yLjFDMjAgMTggOS45MDYgMTQgNi45OTcgMTkuODVjLTIuNDk3IDUuNjUgNC44NTMgOSA0Ljg1MyA5IiBzdHJva2U9IiNlY2VjZWMiLz48cGF0aCBkPSJNMTEuNSAzMGM1LjUtMyAxNS41LTMgMjEgMG0tMjEgMy41YzUuNS0zIDE1LjUtMyAyMSAwbS0yMSAzLjVjNS41LTMgMTUuNS0zIDIxIDAiIHN0cm9rZT0iI2VjZWNlYyIvPjwvZz48L3N2Zz4=\";\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/cburnett/bK.svg?");

/***/ }),

/***/ "./src/chess/cburnett/bN.svg":
/*!***********************************!*\
  !*** ./src/chess/cburnett/bN.svg ***!
  \***********************************/
/***/ ((module) => {

eval("module.exports = \"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMiAxMGMxMC41IDEgMTYuNSA4IDE2IDI5SDE1YzAtOSAxMC02LjUgOC0yMSIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik0yNCAxOGMuMzggMi45MS01LjU1IDcuMzctOCA5LTMgMi0yLjgyIDQuMzQtNSA0LTEuMDQyLS45NCAxLjQxLTMuMDQgMC0zLTEgMCAuMTkgMS4yMy0xIDItMSAwLTQuMDAzIDEtNC00IDAtMiA2LTEyIDYtMTJzMS44OS0xLjkgMi0zLjVjLS43My0uOTk0LS41LTItLjUtMyAxLTEgMyAyLjUgMyAyLjVoMnMuNzgtMS45OTIgMi41LTNjMSAwIDEgMyAxIDMiIGZpbGw9IiMwMDAiLz48cGF0aCBkPSJNOS41IDI1LjVhLjUuNSAwIDEgMS0xIDAgLjUuNSAwIDEgMSAxIDB6bTUuNDMzLTkuNzVhLjUgMS41IDMwIDEgMS0uODY2LS41LjUgMS41IDMwIDEgMSAuODY2LjV6IiBmaWxsPSIjZWNlY2VjIiBzdHJva2U9IiNlY2VjZWMiLz48cGF0aCBkPSJNMjQuNTUgMTAuNGwtLjQ1IDEuNDUuNS4xNWMzLjE1IDEgNS42NSAyLjQ5IDcuOSA2Ljc1UzM1Ljc1IDI5LjA2IDM1LjI1IDM5bC0uMDUuNWgyLjI1bC4wNS0uNWMuNS0xMC4wNi0uODgtMTYuODUtMy4yNS0yMS4zNC0yLjM3LTQuNDktNS43OS02LjY0LTkuMTktNy4xNmwtLjUxLS4xeiIgZmlsbD0iI2VjZWNlYyIgc3Ryb2tlPSJub25lIi8+PC9nPjwvc3ZnPg==\";\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/cburnett/bN.svg?");

/***/ }),

/***/ "./src/chess/cburnett/bP.svg":
/*!***********************************!*\
  !*** ./src/chess/cburnett/bP.svg ***!
  \***********************************/
/***/ ((module) => {

eval("module.exports = \"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PHBhdGggZD0iTTIyLjUgOWMtMi4yMSAwLTQgMS43OS00IDQgMCAuODkuMjkgMS43MS43OCAyLjM4QzE3LjMzIDE2LjUgMTYgMTguNTkgMTYgMjFjMCAyLjAzLjk0IDMuODQgMi40MSA1LjAzLTMgMS4wNi03LjQxIDUuNTUtNy40MSAxMy40N2gyM2MwLTcuOTItNC40MS0xMi40MS03LjQxLTEzLjQ3IDEuNDctMS4xOSAyLjQxLTMgMi40MS01LjAzIDAtMi40MS0xLjMzLTQuNS0zLjI4LTUuNjIuNDktLjY3Ljc4LTEuNDkuNzgtMi4zOCAwLTIuMjEtMS43OS00LTQtNHoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==\";\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/cburnett/bP.svg?");

/***/ }),

/***/ "./src/chess/cburnett/bQ.svg":
/*!***********************************!*\
  !*** ./src/chess/cburnett/bQ.svg ***!
  \***********************************/
/***/ ((module) => {

eval("module.exports = \"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxnIHN0cm9rZT0ibm9uZSI+PGNpcmNsZSBjeD0iNiIgY3k9IjEyIiByPSIyLjc1Ii8+PGNpcmNsZSBjeD0iMTQiIGN5PSI5IiByPSIyLjc1Ii8+PGNpcmNsZSBjeD0iMjIuNSIgY3k9IjgiIHI9IjIuNzUiLz48Y2lyY2xlIGN4PSIzMSIgY3k9IjkiIHI9IjIuNzUiLz48Y2lyY2xlIGN4PSIzOSIgY3k9IjEyIiByPSIyLjc1Ii8+PC9nPjxwYXRoIGQ9Ik05IDI2YzguNS0xLjUgMjEtMS41IDI3IDBsMi41LTEyLjVMMzEgMjVsLS4zLTE0LjEtNS4yIDEzLjYtMy0xNC41LTMgMTQuNS01LjItMTMuNkwxNCAyNSA2LjUgMTMuNSA5IDI2eiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNOSAyNmMwIDIgMS41IDIgMi41IDQgMSAxLjUgMSAxIC41IDMuNS0xLjUgMS0xLjUgMi41LTEuNSAyLjUtMS41IDEuNS41IDIuNS41IDIuNSA2LjUgMSAxNi41IDEgMjMgMCAwIDAgMS41LTEgMC0yLjUgMCAwIC41LTEuNS0xLTIuNS0uNS0yLjUtLjUtMiAuNS0zLjUgMS0yIDIuNS0yIDIuNS00LTguNS0xLjUtMTguNS0xLjUtMjcgMHoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTExIDM4LjVhMzUgMzUgMSAwIDAgMjMgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMTEgMjlhMzUgMzUgMSAwIDEgMjMgMG0tMjEuNSAyLjVoMjBtLTIxIDNhMzUgMzUgMSAwIDAgMjIgMG0tMjMgM2EzNSAzNSAxIDAgMCAyNCAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlY2VjZWMiLz48L2c+PC9zdmc+\";\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/cburnett/bQ.svg?");

/***/ }),

/***/ "./src/chess/cburnett/bR.svg":
/*!***********************************!*\
  !*** ./src/chess/cburnett/bR.svg ***!
  \***********************************/
/***/ ((module) => {

eval("module.exports = \"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik05IDM5aDI3di0zSDl2M3ptMy41LTdsMS41LTIuNWgxN2wxLjUgMi41aC0yMHptLS41IDR2LTRoMjF2NEgxMnoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTE0IDI5LjV2LTEzaDE3djEzSDE0eiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMTQgMTYuNUwxMSAxNGgyM2wtMyAyLjVIMTR6TTExIDE0VjloNHYyaDVWOWg1djJoNVY5aDR2NUgxMXoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTEyIDM1LjVoMjFtLTIwLTRoMTltLTE4LTJoMTdtLTE3LTEzaDE3TTExIDE0aDIzIiBmaWxsPSJub25lIiBzdHJva2U9IiNlY2VjZWMiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjwvZz48L3N2Zz4=\";\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/cburnett/bR.svg?");

/***/ }),

/***/ "./src/chess/cburnett/wB.svg":
/*!***********************************!*\
  !*** ./src/chess/cburnett/wB.svg ***!
  \***********************************/
/***/ ((module) => {

eval("module.exports = \"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxnIGZpbGw9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJidXR0Ij48cGF0aCBkPSJNOSAzNmMzLjM5LS45NyAxMC4xMS40MyAxMy41LTIgMy4zOSAyLjQzIDEwLjExIDEuMDMgMTMuNSAyIDAgMCAxLjY1LjU0IDMgMi0uNjguOTctMS42NS45OS0zIC41LTMuMzktLjk3LTEwLjExLjQ2LTEzLjUtMS0zLjM5IDEuNDYtMTAuMTEuMDMtMTMuNSAxLTEuMzU0LjQ5LTIuMzIzLjQ3LTMtLjUgMS4zNTQtMS45NCAzLTIgMy0yeiIvPjxwYXRoIGQ9Ik0xNSAzMmMyLjUgMi41IDEyLjUgMi41IDE1IDAgLjUtMS41IDAtMiAwLTIgMC0yLjUtMi41LTQtMi41LTQgNS41LTEuNSA2LTExLjUtNS0xNS41LTExIDQtMTAuNSAxNC01IDE1LjUgMCAwLTIuNSAxLjUtMi41IDQgMCAwLS41LjUgMCAyeiIvPjxwYXRoIGQ9Ik0yNSA4YTIuNSAyLjUgMCAxIDEtNSAwIDIuNSAyLjUgMCAxIDEgNSAweiIvPjwvZz48cGF0aCBkPSJNMTcuNSAyNmgxME0xNSAzMGgxNW0tNy41LTE0LjV2NU0yMCAxOGg1IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PC9nPjwvc3ZnPg==\";\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/cburnett/wB.svg?");

/***/ }),

/***/ "./src/chess/cburnett/wK.svg":
/*!***********************************!*\
  !*** ./src/chess/cburnett/wK.svg ***!
  \***********************************/
/***/ ((module) => {

eval("module.exports = \"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMi41IDExLjYzVjZNMjAgOGg1IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTIyLjUgMjVzNC41LTcuNSAzLTEwLjVjMCAwLTEtMi41LTMtMi41cy0zIDIuNS0zIDIuNWMtMS41IDMgMyAxMC41IDMgMTAuNSIgZmlsbD0iI2ZmZiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMTEuNSAzN2M1LjUgMy41IDE1LjUgMy41IDIxIDB2LTdzOS00LjUgNi0xMC41Yy00LTYuNS0xMy41LTMuNS0xNiA0VjI3di0zLjVjLTMuNS03LjUtMTMtMTAuNS0xNi00LTMgNiA1IDEwIDUgMTBWMzd6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTExLjUgMzBjNS41LTMgMTUuNS0zIDIxIDBtLTIxIDMuNWM1LjUtMyAxNS41LTMgMjEgMG0tMjEgMy41YzUuNS0zIDE1LjUtMyAyMSAwIi8+PC9nPjwvc3ZnPg==\";\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/cburnett/wK.svg?");

/***/ }),

/***/ "./src/chess/cburnett/wN.svg":
/*!***********************************!*\
  !*** ./src/chess/cburnett/wN.svg ***!
  \***********************************/
/***/ ((module) => {

eval("module.exports = \"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMiAxMGMxMC41IDEgMTYuNSA4IDE2IDI5SDE1YzAtOSAxMC02LjUgOC0yMSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yNCAxOGMuMzggMi45MS01LjU1IDcuMzctOCA5LTMgMi0yLjgyIDQuMzQtNSA0LTEuMDQyLS45NCAxLjQxLTMuMDQgMC0zLTEgMCAuMTkgMS4yMy0xIDItMSAwLTQuMDAzIDEtNC00IDAtMiA2LTEyIDYtMTJzMS44OS0xLjkgMi0zLjVjLS43My0uOTk0LS41LTItLjUtMyAxLTEgMyAyLjUgMyAyLjVoMnMuNzgtMS45OTIgMi41LTNjMSAwIDEgMyAxIDMiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNOS41IDI1LjVhLjUuNSAwIDEgMS0xIDAgLjUuNSAwIDEgMSAxIDB6bTUuNDMzLTkuNzVhLjUgMS41IDMwIDEgMS0uODY2LS41LjUgMS41IDMwIDEgMSAuODY2LjV6IiBmaWxsPSIjMDAwIi8+PC9nPjwvc3ZnPg==\";\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/cburnett/wN.svg?");

/***/ }),

/***/ "./src/chess/cburnett/wP.svg":
/*!***********************************!*\
  !*** ./src/chess/cburnett/wP.svg ***!
  \***********************************/
/***/ ((module) => {

eval("module.exports = \"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PHBhdGggZD0iTTIyLjUgOWMtMi4yMSAwLTQgMS43OS00IDQgMCAuODkuMjkgMS43MS43OCAyLjM4QzE3LjMzIDE2LjUgMTYgMTguNTkgMTYgMjFjMCAyLjAzLjk0IDMuODQgMi40MSA1LjAzLTMgMS4wNi03LjQxIDUuNTUtNy40MSAxMy40N2gyM2MwLTcuOTItNC40MS0xMi40MS03LjQxLTEzLjQ3IDEuNDctMS4xOSAyLjQxLTMgMi40MS01LjAzIDAtMi40MS0xLjMzLTQuNS0zLjI4LTUuNjIuNDktLjY3Ljc4LTEuNDkuNzgtMi4zOCAwLTIuMjEtMS43OS00LTQtNHoiIGZpbGw9IiNmZmYiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==\";\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/cburnett/wP.svg?");

/***/ }),

/***/ "./src/chess/cburnett/wQ.svg":
/*!***********************************!*\
  !*** ./src/chess/cburnett/wQ.svg ***!
  \***********************************/
/***/ ((module) => {

eval("module.exports = \"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik04IDEyYTIgMiAwIDEgMS00IDAgMiAyIDAgMSAxIDQgMHptMTYuNS00LjVhMiAyIDAgMSAxLTQgMCAyIDIgMCAxIDEgNCAwek00MSAxMmEyIDIgMCAxIDEtNCAwIDIgMiAwIDEgMSA0IDB6TTE2IDguNWEyIDIgMCAxIDEtNCAwIDIgMiAwIDEgMSA0IDB6TTMzIDlhMiAyIDAgMSAxLTQgMCAyIDIgMCAxIDEgNCAweiIvPjxwYXRoIGQ9Ik05IDI2YzguNS0xLjUgMjEtMS41IDI3IDBsMi0xMi03IDExVjExbC01LjUgMTMuNS0zLTE1LTMgMTUtNS41LTE0VjI1TDcgMTRsMiAxMnoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTkgMjZjMCAyIDEuNSAyIDIuNSA0IDEgMS41IDEgMSAuNSAzLjUtMS41IDEtMS41IDIuNS0xLjUgMi41LTEuNSAxLjUuNSAyLjUuNSAyLjUgNi41IDEgMTYuNSAxIDIzIDAgMCAwIDEuNS0xIDAtMi41IDAgMCAuNS0xLjUtMS0yLjUtLjUtMi41LS41LTIgLjUtMy41IDEtMiAyLjUtMiAyLjUtNC04LjUtMS41LTE4LjUtMS41LTI3IDB6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0xMS41IDMwYzMuNS0xIDE4LjUtMSAyMiAwTTEyIDMzLjVjNi0xIDE1LTEgMjEgMCIgZmlsbD0ibm9uZSIvPjwvZz48L3N2Zz4=\";\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/cburnett/wQ.svg?");

/***/ }),

/***/ "./src/chess/cburnett/wR.svg":
/*!***********************************!*\
  !*** ./src/chess/cburnett/wR.svg ***!
  \***********************************/
/***/ ((module) => {

eval("module.exports = \"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik05IDM5aDI3di0zSDl2M3ptMy0zdi00aDIxdjRIMTJ6bS0xLTIyVjloNHYyaDVWOWg1djJoNVY5aDR2NSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMzQgMTRsLTMgM0gxNGwtMy0zIi8+PHBhdGggZD0iTTMxIDE3djEyLjVIMTRWMTciIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTMxIDI5LjVsMS41IDIuNWgtMjBsMS41LTIuNSIvPjxwYXRoIGQ9Ik0xMSAxNGgyMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjwvZz48L3N2Zz4=\";\n\n//# sourceURL=webpack://my-webpack-project/./src/chess/cburnett/wR.svg?");

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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.js");
/******/ 	
/******/ })()
;