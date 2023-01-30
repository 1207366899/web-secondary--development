<template>
  <div>
    资产Id: <el-input v-model="assetId" placeholder="请输入内容" @blur="queryContent"></el-input>
    <div>
      页签名称字段： <el-select v-model="tab_filed" placeholder="请选择">
        <el-option v-for="item in optionArr" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>

    <div>
      页签图标字段： <el-select v-model="tab_icon" placeholder="请选择">
        <el-option v-for="item in optionArr" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>

    <el-button class="optionsSubmit" @click=changeOptions>执行</el-button>
  </div>
</template>

<script>
import {
  Select,
  Option,
  Button
} from "element-ui";
import { queryAssetById } from '../../api/asset'
import Vue from "vue";
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
export default {
  name: "DesignConfiguration",
  components: {},
  data() {
    return {
      assetId: '',
      optionArr: [],
      tab_icon: '',
      tab_filed: ''
    };
  },
  props: {
    funcRef: Object,
    //用于当改变配置的时候，将当前的customConfig当做入参，用于保存最新的customConfig
    changeCustomConfig: Function,
    customConfig: Object
  },
  mounted() {
    console.log('======配置项页', this.customConfig);
    this.assetId = this.customConfig?.assetId
    this.assetId && this.queryContent()
    this.tab_icon = this.customConfig?.tab_icon
    this.tab_filed = this.customConfig?.tab_filed
  },
  methods: {
    queryContent() {
      queryAssetById(this.assetId).then(res => {
        console.log(res.data[0]);
        res.data[0].forEach(item => {
          this.optionArr.push({ label: item.col_alias || item.col_name, value: item.col_name })
        });
      })
    },
    changeOptions() {
      let temp = { assetId: this.assetId, tab_icon: this.tab_icon, tab_filed: this.tab_filed }
      this.changeCustomConfig && this.changeCustomConfig(temp)
    }
  }
};
</script>

<style scoped>

</style>