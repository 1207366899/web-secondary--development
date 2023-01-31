import Vue from "vue";
import App from "./App.vue";
import less from "less";

import { Button, CheckboxGroup, Checkbox, Switch, Tabs, TabPane, Tooltip, Timeline, TimelineItem, Image } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(Button);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Switch);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tooltip);
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(Image);

Vue.use(less);
Vue.config.productionTip = false;
if (process.env.NODE_ENV !== "production") {
   require("./development.less");
   new Vue({
      render: (h) => {
         return (
            <div>
               <App mode="development" />
            </div>
         );
      },
   }).$mount("#app");
} else {
   if (!window.CUSTOM_PLUGIN) {
      window.CUSTOM_PLUGIN = new Map();
   }
   window.CUSTOM_PLUGIN.set(process.env.VUE_APP_CUSTOM_PLUGIN_ID, (dom, props, context, eventBus) => {
      if (dom.childNodes.length > 0) {
         dom.removeChild(dom.childNodes[0]);
      }
      const div = document.createElement("div");
      dom.appendChild(div);
      new Vue({
         render: (h) => {
            props = { eventBus, ...props };
            return <App {...{ props }} />;
         },
      }).$mount(div);
   });
}
