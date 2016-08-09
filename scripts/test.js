// Description:
//   Show menus of tea shops
//
// Commands:
//   drinks - 看有哪些飲料店
//   drinks 飲料店 - 有個飲料店的菜單
//
// Author:
//    Candy
//
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _drinks = require('../utils/drinks');

var _drinks2 = _interopRequireDefault(_drinks);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = function (robot) {
  robot.hear(/^drinks$/i, function (res) {
    var result = Object.keys(_drinks2.default).join('.');
    res.send(result);
  });

  robot.hear(/drinks (.*)/i, function (res) {
    var result = '◢▆▅▄▃-崩╰(〒皿〒)╯潰-▃▄▅▆◣';
    res.send(result);
  });
};

module.exports = exports['default'];