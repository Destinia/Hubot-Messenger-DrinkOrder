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

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var _drinks = require('../utils/drinks');

var _drinks2 = _interopRequireDefault(_drinks);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }return obj;
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

  var startOrder = function startOrder(shopName) {
    robot.brain.set('isOrdering', true);
    robot.brain.set('orders', []);
    robot.brain.set('menu', _drinks2.default[shopName]);
  };

  var getMenu = function getMenu() {
    return robot.brain.get('menu');
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

  var listMatch = function listMatch() {
    var orders = list();
    var sum = orders.reduce(function (prev, o) {
      var fullName = o.drink + ' ' + o.sugar + ' ' + o.ice;
      var match = Object.keys(prev).find(function (k) {
        return fullName === k;
      });
      if (match) {
        return _extends({}, prev, _defineProperty({}, fullName, prev[fullName] + 1));
      }
      return _extends({}, prev, _defineProperty({}, fullName, 1));
    }, {});
    return Object.keys(sum).reduce(function (prev, o) {
      return '' + prev + o + ' 有 ' + sum[o] + ' 杯\n';
    }, '\n');
  };

  var orders2String = function orders2String(orders) {
    return orders.reduce(function (prev, o) {
      return '' + prev + o.name + ' 點了 ' + o.drink + ' ' + o.sugar + ' ' + o.ice + '\n';
    }, '\n');
  };

  var drinks2String = function drinks2String(orders) {
    return orders.reduce(function (prev, o) {
      return '' + prev + o.id + ' ' + o.name + '\n';
    }, '\n');
  };

  robot.hear(/我要訂飲料/, function (res) {
    var result = Object.keys(_drinks2.default).join('、');
    res.send('要訂哪間 ' + result);
  });

  robot.hear(/^訂(.*)/, function (res) {
    var shopName = res.match[1];
    if (_drinks2.default[shopName]) {
      if (ordering()) {
        res.send('不要再訂了');
      } else {
        startOrder(shopName);
        res.send(drinks2String(_drinks2.default[shopName]));
      }
    } else {
      res.send('沒有' + shopName + ' ◢▆▅▄▃-崩╰(〒皿〒)╯潰-▃▄▅▆◣\n\n        訂 ' + Object.keys(_drinks2.default).join('、'));
    }
  });

  robot.hear(/(.*) (.[糖冰]) (.[糖冰])/, function (res) {
    if (ordering()) {
      var sugar = res.match[2];
      var ice = res.match[3];
      var name = res.message.user.name;
      console.log(getMenu().find(function (d) {
        return d.id === +res.match[1];
      }));
      var drink = res.match[1];
      order({ sugar: sugar, ice: ice, name: name, drink: drink });
      res.send(name + ' 訂的是 ' + drink + ' ' + sugar + ' ' + ice);
    } else {
      res.send('不要偷訂飲料');
    }
  });

  robot.hear(/取消/, function (res) {
    var cancelOrder = list().find(function (o) {
      return o.name === res.message.user.name;
    });
    if (cancelOrder) {
      res.send('已經取消 ' + res.message.user.name + ' 訂的' + cancelOrder.drink);
      cancel(res.message.user.name);
    } else {
      res.send('你哪位？');
    }
  });

  robot.hear(/截止/, function (res) {
    res.send(listMatch());
    clear();
  });

  robot.hear(/統計/, function (res) {
    var orders = list();
    res.send(orders2String(orders));
  });
};

module.exports = exports['default'];