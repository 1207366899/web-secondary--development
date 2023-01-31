// 组件可派发事件
export const events = [
   {
      key: "clickMarker",
      name: "坐标点信息",
      payload: [
         {
            name: "坐标点ID",
            key: "id",
            dataType: "string",
         },
         {
            name: "区域",
            key: "area",
            dataType: "string",
         },
      ],
   },
];

// 组件可接收事件
export const actions = [];

export default {
   actions,
   events,
};
