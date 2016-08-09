// Description:
//   Show menus of tea shops
//
// Commands:
//   我要訂飲料
//   截止
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
  robot.hear(/我要訂飲料/i, function (res) {
    var result = Object.keys(_drinks2.default).join('、');
    res.send('要訂哪間 ' + result);
  });

  robot.hear(/訂(.*)/i, function (res) {
    var shopName = res.match[1];
    console.log(shopName);
    if (_drinks2.default[shopName]) {
      res.send(_drinks2.default[shopName]);
    } else {
      res.send('◢▆▅▄▃-崩╰(〒皿〒)╯潰-▃▄▅▆◣');
    }
  });
};

module.exports = exports['default'];