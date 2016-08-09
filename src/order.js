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

import shopsList from '../utils/drinks';

export default (robot) => {
  robot.brain.set('orders', []);
  robot.brain.set('isOrdering', false);

  const startOrder = (shopName) => {
    robot.brain.set('isOrdering', true);
    robot.brain.set('orders', []);
    robot.brain.set('menu', shopsList[shopName]);
  };

  const getMenu = () => robot.brain.get('menu');

  const ordering = () => robot.brain.get('isOrdering');

  const order = (content) => {
    if (robot.brain.get('orders')) {
      robot.brain.set('orders', [...robot.brain.get('orders'), content]);
    }
  };

  const cancel = (name) => {
    robot.brain.set('orders', robot.brain.get('orders').filter(item => item.name !== name));
  };

  const list = () => robot.brain.get('orders');

  const clear = () => {
    robot.brain.set('orders', []);
    robot.brain.set('isOrdering', false);
  };

  const listMatch = () => {
    const orders = list();
    const sum = orders.reduce((prev, o) => {
      const fullName = `${o.drink} ${o.sugar} ${o.ice}`;
      const match = Object.keys(prev).find(k => fullName === k);
      if (match) {
        return { ...prev, [fullName]: prev[fullName] + 1 };
      }
      return { ...prev, [fullName]: 1 };
    }, {});
    return Object.keys(sum).reduce((prev, o) => `${prev}${o} 有 ${sum[o]} 杯\n`
      , '\n');
  };

  const orders2String = (orders) =>
    orders.reduce((prev, o) => `${prev}${o.name} 點了 ${o.drink} ${o.sugar} ${o.ice}\n`
      , '\n');

  const drinks2String = (orders) =>
    orders.reduce((prev, o) => `${prev}${o.id} ${o.name}\n`
      , '\n');

  robot.hear(/我要訂飲料/, (res) => {
    const result = Object.keys(shopsList).join('、');
    res.send(`要訂哪間 ${result}`);
  });

  robot.hear(/^訂(.*)/, (res) => {
    const shopName = res.match[1];
    if (shopsList[shopName]) {
      if (ordering()) {
        res.send('不要再訂了');
      } else {
        startOrder(shopName);
        res.send(drinks2String(shopsList[shopName]));
      }
    } else {
      res.send(`沒有${shopName} ◢▆▅▄▃-崩╰(〒皿〒)╯潰-▃▄▅▆◣\n
        訂 ${Object.keys(shopsList).join('、')}`);
    }
  });

  robot.hear(/(.*) (.[糖冰]) (.[糖冰])/, (res) => {
    if (ordering()) {
      const sugar = res.match[2];
      const ice = res.match[3];
      const name = res.message.user.name;
      const id2drink = getMenu().find(d => d.id === +res.match[1]);
      const drink = (id2drink) ? id2drink.name : res.match[1];
      order({ sugar, ice, name, drink });
      res.send(`${name} 訂的是 ${drink} ${sugar} ${ice}`);
    } else {
      res.send('不要偷訂飲料');
    }
  });

  robot.hear(/取消/, (res) => {
    const cancelOrder = list().find(o => o.name === res.message.user.name);
    if (cancelOrder) {
      res.send(`已經取消 ${res.message.user.name} 訂的${cancelOrder.drink}`);
      cancel(res.message.user.name);
    } else {
      res.send('你哪位？');
    }
  });

  robot.hear(/截止/, (res) => {
    res.send(listMatch());
    clear();
  });

  robot.hear(/統計/, (res) => {
    const orders = list();
    res.send(orders2String(orders));
  });
};
