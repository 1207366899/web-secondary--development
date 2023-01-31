<script>
import { DataConfiguration, StyleConfiguration, OtherConfiguration, Main } from "./components";
import mockData from "./mockData.js";

import { Card } from "element-ui";
import Vue from "vue";

Vue.use(Card);

export default {
   name: "App",
   components: { StyleConfiguration, DataConfiguration, OtherConfiguration, Main },
   props: {
      componentId: String,
      eventBus: Object,
      options: {
         type: Object,
         default: () => ({
            // 配置项从externalVariables里取
            externalVariables: {},
         }),
      },
      block: Object,
      bigscreen: Object,
      notifyVariable: Function,
      type: String,
      mode: String,
      pubSub: Object,
   },
   data() {
      return {};
   },
   computed: {},
   watch: {},
   created() {
      this.eventBus?.on((newProps) => {
         for (const newPropsKey in newProps) {
            this[newPropsKey] = newProps[newPropsKey];
         }
      });
   },
   mounted() {},
   beforeDestroy() {
      this.eventBus?.remove();
   },
   methods: {
      Event_Center_getName: () => {
         return this.id;
      },
   },
   render(h) {
      if (this.mode === "development") {
         let props = mockData;
         return (
            <div style="padding: 20px">
               <el-Card id={"main"} header="组件" style="margin-bottom: 30px">
                  <Main {...{ props }}></Main>
               </el-Card>
               <el-Card id={"data"} header="配置项">
                  <DataConfiguration {...{ props }} />
               </el-Card>
            </div>
         );
      } else {
         let props = this._props;
         let handleConfiguration = () => {
            const dataConfig = props.block?.dataConfig || {};
            const { pluginOptions = {}, columns } = dataConfig;
            pluginOptions.columns = columns;
            return pluginOptions;
         };
         let changeConfiguration = (pluginOptions) => {
            if (props.bigscreen && props.block) {
               const {
                  bigscreen: { updateBlockById, pluginDetailMap },
                  block: {
                     baseConfig: { id },
                  },
               } = props;
               updateBlockById(id, { dataConfig: { pluginOptions: { ...pluginOptions } } });
               pluginDetailMap[`${id}-default`].detail.ref.current.run();
            } else {
               console.log("暂时无此方法，请升级版本");
            }
         };
         props = { configuration: handleConfiguration(), ...props };
         if (!this.type) {
            return <Main {...{ props }} />;
         } else {
            const renderHashMap = {
               dataConfiguration: DataConfiguration,
               styleConfiguration: StyleConfiguration,
               otherConfiguration: OtherConfiguration,
            };
            const Comp = renderHashMap[this.type];
            props = { configuration: handleConfiguration(), changeConfiguration, ...props };
            return <Comp {...{ props }} />;
         }
      }
   },
};
</script>
