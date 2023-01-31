<template>
   <el-form ref="dataForm" :model="dataForm"> </el-form>
</template>

<script>
import configurationMixin from "@/mixins/configuration.js";
import { Form, FormItem, Input } from "element-ui";
import Vue from "vue";

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);

export default {
   name: "DataConfiguration",

   data() {
      return {
         dataForm: {
            mapType: "",
         },
      };
   },

   mixins: [configurationMixin],

   mounted() {
      this.dataForm = this.newOptions;
   },

   watch: {
      "dataForm.mapType": function (value, oldValue) {
         this.handleValueChange();
      },
   },

   methods: {
      handleValueChange() {
         this.newOptions = this.dataForm;
         this.handleSubmit();
      },
   },
};
</script>
