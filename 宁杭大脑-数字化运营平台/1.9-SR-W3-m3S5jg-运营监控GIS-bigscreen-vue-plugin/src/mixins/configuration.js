import {
  isEqual,
  cloneDeep
} from "lodash";

export default {
  props: {
    changeConfiguration: Function,
    configuration: Object
  },
  data() {
    return {
      newOptions: cloneDeep(this.configuration)
    };
  },
  created() {

  },
  mounted() {
  },
  methods: {
    handleSubmit() {
      this.changeConfiguration({ ...this.configuration, ...this.newOptions });
    }
  }
};