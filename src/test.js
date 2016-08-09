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


export default (robot) => {
  robot.hear(/^drinks$/i, (res) => {
    const result = 'drink water!!!';
    res.send(result);
  });

  robot.hear(/drinks (.*)/i, (res) => {
    const result = 'drink water!!!';
    res.send(result);
  });
};
