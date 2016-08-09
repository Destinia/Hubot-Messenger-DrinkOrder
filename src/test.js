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

import shopsList from '../utils/drinks';

export default (robot) => {
  robot.hear(/^drinks$/i, (res) => {
    const result = Object.keys(shopsList).join('.');
    res.send(result);
  });

  robot.hear(/drinks (.*)/i, (res) => {
    const result = '◢▆▅▄▃-崩╰(〒皿〒)╯潰-▃▄▅▆◣';
    res.send(result);
  });
};
