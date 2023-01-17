<script>
import { Main, DesignConfiguration } from "@/components";
// import Main from "./components/main/AppEarth.vue";
export default {
  name: "App",
  components: { Main, DesignConfiguration },
  props: [
    "dataSource",
    "componentId",
    "options",
    "updateProcess",
    "type",
    "mainInit",
    "eventBus",
    "pubSub",
    "configuration",
    "changeConfiguration",
  ],
  data() {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {},
  render(h) {
    let { type, ...props } = this._props;
    console.log("APP props", this._props);
    type = type || "main";
    if (type === "designConfiguration") {
      // console.log('type', type);
      !props.configuration.analyzer_secondary_configuration &&
        (props.configuration.analyzer_secondary_configuration = {});
      props.customConfig = props.configuration.analyzer_secondary_configuration;
      props.changeCustomConfig = (customConfig) => {
        props.configuration.analyzer_secondary_configuration = customConfig;
        props.changeConfiguration(props.configuration);
      };
    } else {
      !props.options.analyzer_secondary_configuration &&
        (props.options.analyzer_secondary_configuration = {});
      props.customConfig = props.options.analyzer_secondary_configuration;
    }
    const renderhMap = {
      main: Main,
      designConfiguration: DesignConfiguration,
    };
    const Comp = renderhMap[type];
    return <Comp {...{ props }} />;
  },
};
</script>
<style lang="less" scoped></style>
