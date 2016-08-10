// Description:
//   Order Drinks
//
// Commands:
//   怎麼訂飲料
//
// Author:
//    Candy Allen
//

import shopsList from '../utils/drinks';

export default (robot) => {
  robot.brain.set('orders', []);
  robot.brain.set('isOrdering', false);

  const startOrder = (shopName, initiator) => {
    robot.brain.set('isOrdering', true);
    robot.brain.set('orders', []);
    robot.brain.set('menu', shopsList[shopName]);
    robot.brain.set('telephone', shopsList.telephone[shopName]);
    robot.brain.set('initiator', initiator);
  };

  const getMenu = () => robot.brain.get('menu');

  const getTele = () => robot.brain.get('telephone');

  const getInitiator = () => robot.brain.get('initiator');

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
    robot.brain.set('menu', []);
    robot.brain.set('telephone', '');
    robot.brain.set('initiator', '');
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

  robot.hear(/怎麼訂飲料/, (res) => {
    res.send(
      '我要訂飲料 - 列出現有飲料店\n' +
      '[飲料] [甜度] [冰塊] - 飲料 甜度 冰塊\n' +
      '幫[誰][點|訂] [飲料] [甜度] [冰塊]\n' +
      '取消 - 取消自己的訂單\n' +
      '統計 - 看所有訂單\n' +
      '----------主揪專用---------\n' +
      '訂[哪家] - 開團\n' +
      '截止 - 截止'
      );
  });

  robot.hear(/我要訂飲料/, (res) => {
    const result = Object.keys(shopsList).filter(n => n !== 'telephone').join('、');
    res.send(`要訂哪間 ${result}`);
  });

  robot.hear(/^訂(.*)/, (res) => {
    const shopName = res.match[1];
    if (shopsList[shopName]) {
      if (ordering()) {
        res.send('不要再訂了');
      } else {
        startOrder(shopName, res.message.user.name);
        res.send(drinks2String(shopsList[shopName]));
      }
    } else {
      res.send(`沒有${shopName} ◢▆▅▄▃-崩╰(〒皿〒)╯潰-▃▄▅▆◣\n
        訂 ${Object.keys(shopsList).filter(n => n !== 'telephone').join('、')}`);
    }
  });

  robot.hear(/^(\S*) .*([全半少微無去][糖冰]).*([全半少微無去][糖冰])/, (res) => {
    if (ordering()) {
      const name = res.message.user.name;
      const oldOrder = list().find(o => o.name === name);
      if (oldOrder) {
        res.send(`${name}你已經點了 ${oldOrder.drink} ${oldOrder.sugar} ${oldOrder.ice}`);
        return;
      }
      const sugar = (res.match[2].search('糖') >= 0) ? res.match[2] : res.match[3];
      const ice = (res.match[3].search('冰') >= 0) ? res.match[3] : res.match[2];
      const id2drink = getMenu().find(d => d.id === +res.match[1]);
      const drink = (id2drink) ? id2drink.name : res.match[1];
      order({ sugar, ice, name, drink });
      res.send(`${name} 訂的是 ${drink} ${sugar} ${ice}`);
    } else {
      res.send('不要偷訂飲料');
    }
  });

  robot.hear(/幫(\S*)[訂點] (\S*) ([全半少微無][糖冰]) ([全半少微無][糖冰])/, (res) => {
    if (ordering()) {
      const name = res.match[1];
      const oldOrder = list().find(o => o.name === name);
      if (oldOrder) {
        res.send(`${name}他已經點了 ${oldOrder.drink} ${oldOrder.sugar} ${oldOrder.ice}`);
        return;
      }
      const sugar = (res.match[3].search('糖') >= 0) ? res.match[3] : res.match[4];
      const ice = (res.match[4].search('冰') >= 0) ? res.match[4] : res.match[3];
      const id2drink = getMenu().find(d => d.id === +res.match[2]);
      const drink = (id2drink) ? id2drink.name : res.match[2];
      order({ sugar, ice, name, drink });
      res.send(`${name} 訂的是 ${drink} ${sugar} ${ice}`);
    } else {
      res.send('不要偷訂飲料');
    }
  });

  robot.hear(/取消/, (res) => {
    if (ordering()) {
      const cancelOrder = list().find(o => o.name === res.message.user.name);
      if (cancelOrder) {
        res.send(`已經取消 ${res.message.user.name} 訂的${cancelOrder.drink}`);
        cancel(res.message.user.name);
      } else {
        res.send('你哪位？');
      }
    }
  });

  robot.hear(/截止/, (res) => {
    if (ordering()) {
      if (res.message.user.name === getInitiator()) {
        res.send(`${listMatch()}${getInitiator()}電話已經準備好了 ${getTele()}`);
        clear();
      } else {
        res.send(`叫${getInitiator()}出來講`);
      }
    }
  });

  robot.hear(/統計/, (res) => {
    if (ordering()) {
      const orders = list();
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
