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

  const startOrder = () => {
    robot.brain.set('isOrdering', true);
    robot.brain.set('orders', []);
  };

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

  const orders2String = (orders) =>
    orders.reduce((prev, o) => `${prev}${o.name} 點了 ${o.drink} ${o.sugar} ${o.ice}\n`
      , '\n');

  robot.hear(/我要訂飲料/i, (res) => {
    const result = Object.keys(shopsList).join('、');
    res.send(`要訂哪間 ${result}`);
  });

  robot.hear(/^訂(.*)/i, (res) => {
    const shopName = res.match[1];
    if (shopsList[shopName]) {
      startOrder();
      res.send(shopsList[shopName]);
    } else {
      res.send(`沒有${shopName} ◢▆▅▄▃-崩╰(〒皿〒)╯潰-▃▄▅▆◣\n
        訂 ${Object.keys(shopsList).join('、')}`);
    }
  });

  robot.hear(/(.*) (.[糖冰]) (.[糖冰])/i, (res) => {
    if (ordering()) {
      const sugar = res.match[2];
      const ice = res.match[3];
      const name = res.message.user.name;
      const drink = res.match[1];
      order({ sugar, ice, name, drink });
      res.send(`${name} 訂的是 ${drink} ${sugar} ${ice}`);
    } else {
      res.send('不要偷訂飲料');
    }
  });

  robot.hear(/截止/i, (res) => {
    const orders = list();
    clear();
    res.send(orders2String(orders));
  });
};
