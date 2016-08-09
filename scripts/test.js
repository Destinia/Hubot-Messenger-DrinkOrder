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

exports.default = function (robot) {
  robot.hear(/^drinks$/i, function (res) {
    var result = 'drink water!!!';
    res.send(result);
  });

  robot.hear(/drinks (.*)/i, function (res) {
    var result = 'drink water!!!';
    res.send(result);
  });
};

module.exports = exports['default'];