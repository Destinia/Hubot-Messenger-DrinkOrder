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

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

exports.default = function (robot) {
  robot.brain.set('orders', []);
  robot.brain.set('isOrdering', false);

  var startOrder = function startOrder() {
    robot.brain.set('isOrdering', true);
    robot.brain.set('orders', []);
  };

  var ordering = function ordering() {
    return robot.brain.get('isOrdering');
  };

  var order = function order(content) {
    if (robot.brain.get('orders')) {
      robot.brain.set('orders', [].concat(_toConsumableArray(robot.brain.get('orders')), [content]));
    }
  };

  var cancel = function cancel(name) {
    robot.brain.set('orders', robot.brain.get('orders').filter(function (item) {
      return item.name !== name;
    }));
  };

  var list = function list() {
    return robot.brain.get('orders');
  };

  var clear = function clear() {
    robot.brain.set('orders', []);
    robot.brain.set('isOrdering', false);
  };

  var orders2String = function orders2String(orders) {
    return orders.reduce(function (prev, o) {
      return '' + prev + o.name + ' 點了 ' + o.drink + ' ' + o.sugar + ' ' + o.ice + '\n';
    }, '');
  };

  robot.hear(/我要訂飲料/i, function (res) {
    var result = Object.keys(_drinks2.default).join('、');
    res.send('要訂哪間 ' + result);
  });

  robot.hear(/^訂(.*)/i, function (res) {
    var shopName = res.match[1];
    if (_drinks2.default[shopName]) {
      startOrder();
      res.send(_drinks2.default[shopName]);
    } else {
      res.send('沒有' + shopName + ' ◢▆▅▄▃-崩╰(〒皿〒)╯潰-▃▄▅▆◣\n\n        訂 ' + Object.keys(_drinks2.default).join('、'));
    }
  });

  robot.hear(/(.*) (.[糖冰]) (.[糖冰])/i, function (res) {
    if (ordering()) {
      var sugar = res.match[2];
      var ice = res.match[3];
      var name = res.message.user.name;
      var drink = res.match[1];
      order({ sugar: sugar, ice: ice, name: name, drink: drink });
      res.send(name + ' 訂的是 ' + drink + ' ' + sugar + ' ' + ice);
    } else {
      res.send('不要偷訂飲料');
    }
  });

  robot.hear(/截止/i, function (res) {
    var orders = list();
    clear();
    res.send(orders2String(orders));
  });
};

module.exports = exports['default'];