// Description:
//   Order Drinks
//
// Commands:
//   我要訂飲料
//   截止
//   訂XXX
//   
//
// Author:
//    Candy Allen
//
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

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

  var startOrder = function startOrder(shopName, initiator) {
    robot.brain.set('isOrdering', true);
    robot.brain.set('orders', []);
    robot.brain.set('menu', _drinks2.default[shopName]);
    robot.brain.set('telephone', _drinks2.default.telephone[shopName]);
    robot.brain.set('initiator', initiator);
  };

  var getMenu = function getMenu() {
    return robot.brain.get('menu');
  };

  var getTele = function getTele() {
    return robot.brain.get('telephone');
  };

  var getInitiator = function getInitiator() {
    return robot.brain.get('initiator');
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
    robot.brain.set('menu', []);
    robot.brain.set('telephone', '');
    robot.brain.set('initiator', '');
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
    var result = Object.keys(_drinks2.default).filter(function (n) {
      return n !== 'telephone';
    }).join('、');
    res.send('要訂哪間 ' + result);
  });

  robot.hear(/^訂(.*)/, function (res) {
    var shopName = res.match[1];
    if (_drinks2.default[shopName]) {
      if (ordering()) {
        res.send('不要再訂了');
      } else {
        startOrder(shopName, res.message.user.name);
        res.send(drinks2String(_drinks2.default[shopName]));
      }
    } else {
      res.send('沒有' + shopName + ' ◢▆▅▄▃-崩╰(〒皿〒)╯潰-▃▄▅▆◣\n\n        訂 ' + Object.keys(_drinks2.default).filter(function (n) {
        return n !== 'telephone';
      }).join('、'));
    }
  });

  robot.hear(/^(\S*) ([全半少微無][糖冰]) ([全半少微無][糖冰])/, function (res) {
    if (ordering()) {
      var _ret = function () {
        var name = res.message.user.name;
        var oldOrder = list().find(function (o) {
          return o.name === name;
        });
        if (oldOrder) {
          res.send(name + '你已經點了 ' + oldOrder.drink + ' ' + oldOrder.sugar + ' ' + oldOrder.ice);
          return {
            v: void 0
          };
        }
        var sugar = res.match[2].search('糖') >= 0 ? res.match[2] : res.match[3];
        var ice = res.match[3].search('冰') >= 0 ? res.match[3] : res.match[2];
        var id2drink = getMenu().find(function (d) {
          return d.id === +res.match[1];
        });
        var drink = id2drink ? id2drink.name : res.match[1];
        order({ sugar: sugar, ice: ice, name: name, drink: drink });
        res.send(name + ' 訂的是 ' + drink + ' ' + sugar + ' ' + ice);
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    } else {
      res.send('不要偷訂飲料');
    }
  });

  robot.hear(/幫(\S*)點 (\S*) ([全半少微無][糖冰]) ([全半少微無][糖冰])/, function (res) {
    if (ordering()) {
      var _ret2 = function () {
        var name = res.match[1];
        var oldOrder = list().find(function (o) {
          return o.name === name;
        });
        if (oldOrder) {
          res.send(name + '他已經點了 ' + oldOrder.drink + ' ' + oldOrder.sugar + ' ' + oldOrder.ice);
          return {
            v: void 0
          };
        }
        var sugar = res.match[3].search('糖') >= 0 ? res.match[3] : res.match[4];
        var ice = res.match[4].search('冰') >= 0 ? res.match[4] : res.match[3];
        var id2drink = getMenu().find(function (d) {
          return d.id === +res.match[2];
        });
        var drink = id2drink ? id2drink.name : res.match[2];
        order({ sugar: sugar, ice: ice, name: name, drink: drink });
        res.send(name + ' 訂的是 ' + drink + ' ' + sugar + ' ' + ice);
      }();

      if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
    } else {
      res.send('不要偷訂飲料');
    }
  });

  robot.hear(/取消/, function (res) {
    if (ordering()) {
      var cancelOrder = list().find(function (o) {
        return o.name === res.message.user.name;
      });
      if (cancelOrder) {
        res.send('已經取消 ' + res.message.user.name + ' 訂的' + cancelOrder.drink);
        cancel(res.message.user.name);
      } else {
        res.send('你哪位？');
      }
    }
  });

  robot.hear(/截止/, function (res) {
    if (res.message.user.name === getInitiator()) {
      res.send('' + listMatch() + getInitiator() + '電話已經準備好了 ' + getTele());
      clear();
    } else {
      res.send('叫' + getInitiator() + '出來講');
    }
  });

  robot.hear(/統計/, function (res) {
    if (ordering()) {
      var orders = list();
      if (orders.length) {
        res.send(orders2String(orders));
      } else {
        res.send('你是不是邊緣人 幫QQ');
      }
    } else {
      res.send('先別急好嗎');
    }
  });
};

module.exports = exports['default'];