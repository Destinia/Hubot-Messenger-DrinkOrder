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

import shopList from '../utils/drinks';

export default (robot) => {
  robot.hear(/我要訂飲料/i, (res) => {
    const result = Object.keys(shopList).join('、');
    res.send(`要訂哪間 ${result}`);
  });
};
