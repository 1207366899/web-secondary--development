// 组件可派发事件
export const events = [
  {
    key: 'change',
    name: '内容改变',
    payload: [
      {
        name: '内容',
        key: 'value',
        dataType: 'string',
      },
    ],
  },
];

// 组件可接收事件
export const actions = [
  {
    key: 'setValue',
    name: '设值',
    isSupportChild: true,
    params: [
      {
        key: 'value',
        name: '值',
        dataType: 'string',
      },
    ],
  },
  {
    key: 'getValue',
    name: '取值',
    hasReturn: true,
    isSupportChild: true,
    returns: [
      {
        key: 'value',
        name: '值',
        dataType: 'string',
      },
    ],
  },
];

export default {
  actions,
  events
};
