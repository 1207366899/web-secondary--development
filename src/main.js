/*
 * @Author: zhangzhuo
 * @Email: zhangzhuo@njsdata.com
 * @LastEditors: Do not edit
 * @Date: 2021-10-21 19:40:39
 * @LastEditTime: 2021-10-22 10:34:09
 * @Description: 请描述文件作用
 */
import Vue from "vue";
import App from "./App.vue";
import "./index.css";
import { Table, TableColumn } from "element-ui";
import * as echarts from "echarts";
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;
Vue.use(Table);
Vue.use(TableColumn);

import config from "../pluginTemp/config.json";

let { domId } = Object.values(config)[0];

let dom = document.getElementById(domId);

if (dom) {
  if (dom.childNodes.length > 0) {
    dom.removeChild(dom.childNodes[0]);
  }

  const App = require("./App.vue").default;
  let wrapper = document.createElement("div");
  wrapper.style = "width: 100%; height: 100%";
  dom.appendChild(wrapper);

  new Vue({
    render: (h) => h(App),
  }).$mount(wrapper);
} else {
  if (process.env.NODE_ENV !== "production") {
    const dataSource = JSON.parse(
      '[["区域","已收金额","应收金额","欠费金额"],["南白营业所","610","200","100"],["荀江营业所","50","400","210"],["南黑营业所","300","100","400"],["北白营业所","400","300","50"],["南白营业所","610","200","100"],["荀江营业所","50","400","210"],["南黑营业所","300.69","100","400"],["北白营业所","400.3","300","50"]]'
    );
    const options = {
      externalVariables: {
        渐变色1: "red,blue",
        渐变色2: "",
        // 头部文字颜色: "",
        // 头部字体大小: "48",
        // 头部字体类型: "宋体",
        // 单位: '单位: 万kMh',
        // y单位: '单位： kMh',
        // 倍数: '1',
        // 柱宽: '',
        // 小数位: '0',
        // 距顶部距离: '',
        // 距右侧距离: '',
        // 距底部距离: '',
        // 距左侧距离: '',
        x轴坐标字体颜色: '#000',
        // x轴坐标字体大小: '20',
        // y轴坐标字体大小: '40',
        // y轴坐标字体颜色: 'red',
        // x坐标轴颜色: '',
        // y坐标轴分割线颜色: 'green',
        // 次轴: '1',
        // 次轴单位: "",
        // 图例字体颜色: '',
        // 图例字体大小: '16',
        // 图例图形宽: '40',
        // 图例图形高: 12,
        // 遮罩体显示: 'false',
        // x坐标标题度数: '',
        // 遮罩体颜色: '#0e2a43',
        // 图例之间的间距: '20',
        // y轴坐标字体类型: '宋体',
        // 降序: '',
        // 是否开启百分号: ''
      },
    };
    const props = {
      dataSource,
      options,
    };
    const App = require("./App.vue").default;
    new Vue({
      render: (h) => <App {...{ props }} />,
    }).$mount("#app");
  } else {
    if (!window.CUSTOM_PLUGIN) {
      window.CUSTOM_PLUGIN = new Map();
    }

    window.CUSTOM_PLUGIN.set(process.env.VUE_APP_CUSTOM_PLUGIN_ID, (dom, props) => {
      if (dom.childNodes.length > 0) {
        dom.removeChild(dom.childNodes[0]);
      }
      const div = document.createElement("div");

      dom.appendChild(div);
      new Vue({
        render: (h) => <App {...{ props }} />,
      }).$mount(div);
    });
  }
}
