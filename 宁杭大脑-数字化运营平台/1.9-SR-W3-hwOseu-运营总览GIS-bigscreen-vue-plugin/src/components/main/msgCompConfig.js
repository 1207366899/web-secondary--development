// 组件可派发事件
export const events = [
   {
      key: "clickTraffic",
      name: "展示拥堵情况",
      payload: [
         {
            name: "坐标点ID",
            key: "value",
            dataType: "string",
         },
      ],
   },
];

// 组件可接收事件
export const actions = [
   {
      key: "changeEventType",
      name: "切换事件类型",
      params: [
         {
            key: "value",
            name: "值",
            dataType: "object",
         },
      ],
   },
   {
      key: "refreshMap",
      name: "刷新地图",
      params: [
         {
            key: "value",
            name: "值",
            dataType: "object",
         },
      ],
   },
];

export default {
   actions,
   events,
};
