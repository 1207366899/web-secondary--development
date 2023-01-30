import Vue from "vue";
import App from "./App.vue";
import { sysVariables, appVariables, customConfig, themeInfo } from "@/components/mockData.js";
import * as echarts from "echarts";
Vue.prototype.$echarts = echarts;
import ViewUI  from 'view-design';
import {DatePicker,ConfigProvider } from 'ant-design-vue';
import 'view-design/dist/styles/iview.css';
import moment from "moment"
Vue.prototype.$moment = moment;
Vue.use(DatePicker,ConfigProvider );
Vue.use(ViewUI );
if (process.env.NODE_ENV !== "production") {
  window.eventCenter = {
    triggerEvent(componentId, eventName) {
      console.log(`${eventName} is triggered`);
    },
  };
  new Vue({
    render: (h) => {
      return <App customConfig={customConfig} themeInfo={themeInfo} sysVariables={sysVariables} appVariables={appVariables} />;
    },
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(process.env.VUE_APP_CUSTOM_PLUGIN_ID, (dom, props) => {
    console.log(props,23,23);
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
