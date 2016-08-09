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
  };

  const order = (content) => {
    robot.brain.set('orders', [...robot.brain.get('orders'), content]);
  };

  const cancel = (name) => {
    robot.brain.set('orders', robot.brain.get('orders').filter(item => item.name !== name));
  };

  const list = () => robot.brain.get('orders');

  const clear = () => {
    robot.brain.set('orders', []);
  };

  robot.hear(/我要訂飲料/i, (res) => {
    const result = Object.keys(shopsList).join('、');
    res.send(`要訂哪間 ${result}`);
  });

  robot.hear(/訂(.*)/i, (res) => {
    const shopName = res.match[1];
    if (shopsList[shopName]) {
      res.send(shopsList[shopName]);
    } else {
      res.send('◢▆▅▄▃-崩╰(〒皿〒)╯潰-▃▄▅▆◣');
    }
  });

  robot.

  robot.hear(/截止/i, (res) => {
    const orders = list();
    clear();
    res.send(`${orders}`);
  });
};
