// 组件可派发事件
export const events = [
  {
    key: "valueChange",
    name: "值改变",
    payload: [
      {
        name: "值",
        key: "value",
        dataType: "string",
      },
    ],
  },
  {
    key: "componentLoaded",
    name: "组件加载完成",
    payload: [],
  },
];

// 组件可接收事件
export const actions = [
  {
    key: "searchCompany",
    name: "用电单位电费月报/年报查询",
    isSupportChild: false,
    params: [
      {
        key: "charcoalId",
        name: "电站",
        dataType: "string,number,objectArray",
      },
    ],
  },
];

export default {
  actions,
  events,
};
