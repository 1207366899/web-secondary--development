<template>
   <el-form ref="dataForm" :model="dataForm">
      <el-form-item label="资产ID">
         <el-input v-model="dataForm.assetId" size="samll"></el-input>
      </el-form-item>
   </el-form>
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
            assetId: "",
         },
      };
   },

   mixins: [configurationMixin],

   mounted() {
      this.dataForm = this.newOptions;
   },

   watch: {
      "dataForm.assetId": function (value, oldValue) {
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
