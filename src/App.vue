<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="identification" style="width: 100%; height: 100%" :ref="identification">
    <button :class="{ p_Report: true, active: stateR == 'month' }" @click="reportClick('month')">月报</button>
    <button :class="{ p_Report: true, active: stateR == 'year' }" @click="reportClick('year')">年报</button>
    <div class="topOption">
      <div class="topChoose">
        <span style="margin-right: 15px; line-height: 32px; margin-top: 15px; font-size: 16px" v-show="stateM">选择月份:</span>
        <el-date-picker
          v-show="stateM"
          v-model="monthPickerStart"
          clear-icon="el-icon-error"
          style="margin-top: 15px"
          type="month"
          :picker-options="pickerOptionsMonth1"
          @change="monthChange()"
          placeholder="起始时间"
        />
        <div class="iconBox" v-show="stateM">
          <img src="../pluginTemp/images/date.png" alt="" />
        </div>
        <span v-show="stateM" style="line-height: 32px; margin-left: 15px; margin-right: 15px; margin-top: 15px"> — </span>
        <el-date-picker
          v-model="monthPickerEnd"
          clear-icon="el-icon-error"
          style="margin-top: 15px"
          type="month"
          :picker-options="pickerOptionsMonth2"
          @change="monthChange()"
          placeholder="结束时间"
          v-show="stateM"
        />
        <div class="iconBox" v-show="stateM">
          <img src="../pluginTemp/images/date.png" alt="" />
        </div>
      </div>
      <div class="export" @click="exportExcel()">
        <img src="../pluginTemp/images/export.png" alt="" />
      </div>
    </div>
    <el-descriptions title="" :column="1" style="margin-top: 30px" border>
      <el-descriptions-item
        label="发电单元名称"
        label-class-name="my-label"
        labelStyle="width:231px;height:40px;background:#E9F3FD;text-align:center;font-weight:700;color:#000"
        contentStyle="font-weight:400"
        content-class-name="my-content"
        >{{ monthTableData.powerCellName }}</el-descriptions-item
      >
    </el-descriptions>
    <el-descriptions title="" :column="2" border>
      <el-descriptions-item
        label="装机容量"
        label-class-name="my-label"
        labelStyle="width:231px;background:#E9F3FD;text-align:center;font-weight:700;color:#000"
        contentStyle="font-weight:400;background:rgba(249,252,255,1) "
        content-class-name="my-content"
        >{{ monthTableData.machineVolume ? Number(monthTableData.machineVolume).toFixed(2) + "kWp" : "" }}
      </el-descriptions-item>
      <el-descriptions-item
        label="用电类型"
        label-class-name="my-label"
        labelStyle="width:231px;background:#E9F3FD;text-align:center;font-weight:700;color:#000"
        content-class-name="my-content"
        contentStyle="font-weight:400;background:rgba(249,252,255,1) "
        >{{ monthTableData.powerType }}</el-descriptions-item
      >
      <el-descriptions-item
        label="结算类型"
        label-class-name="my-label"
        labelStyle="width:231px;background:#E9F3FD;text-align:center;font-weight:700;color:#000"
        contentStyle="font-weight:400"
        content-class-name="my-content"
        >{{ monthTableData.settlementType }}</el-descriptions-item
      >
      <!-- <el-descriptions-item
        :label="monthTableData.settlementType == '固定电价' ? '电价' : '费率'"
        label-class-name="my-label"
        labelStyle="width:231px;background:#E9F3FD;text-align:center;font-weight:700;color:#000"
        content-class-name="my-content"
        contentStyle="font-weight:400"
        >{{ monthTableData.discountRate ? monthTableData.discountRate + "折" : "" }}</el-descriptions-item
      >
    </el-descriptions> -->
      <el-descriptions-item
        :label="monthTableData.settlementType == '固定电价' ? '电价' : '费率'"
        label-class-name="my-label"
        labelStyle="width:231px;background:#E9F3FD;text-align:center;font-weight:700;color:#000"
        content-class-name="my-content"
        contentStyle="font-weight:400"
        >{{
          monthTableData.settlementType == "固定电价"
            ? monthTableData.fixedTariff
              ? monthTableData.fixedTariff + "元/kWh"
              : ""
            : monthTableData.discountRate
            ? monthTableData.discountRate+'折'
            : monthTableData.discountRate
        }}</el-descriptions-item
      >
    </el-descriptions>
    <el-table
      :data="monthTableData.propertyList"
      border
      style="width: 100%"
      :stripe="true"
      :header-cell-style="{
        background: '#E9F3FD',
        height: '49px',
        color: '#000000',
        padding: 0,
      }"
      show-summary
      :cell-style="{ fontWeight: 700 }"
    >
      <el-table-column align="center" prop="date" :label="stateR == 'month' ? '月份' : '年份'" width="231"> </el-table-column>
      <el-table-column sortable align="center" :render-header="renderheader" prop="powerOutput" :label="stateR == 'month' ? '发电量|(万kWh)' : '发电量|(万kWh)'">
        <template slot-scope="scope">
          <span>{{ Number(scope.row.powerOutput).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" :render-header="renderheader" prop="powerOngrid" :label="stateR == 'month' ? '上网电量|(万kWh)' : '上网电量|(万kWh)'">
        <template slot-scope="scope">
          <span>{{ Number(scope.row.powerOngrid).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" :render-header="renderheader" prop="powerSelfuse" :label="stateR == 'month' ? '自发自用电量|(万kWh)' : '自发自用电量|(万kWh)'">
        <template slot-scope="scope">
          <span>{{ Number(scope.row.powerSelfuse).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" :render-header="renderheader" prop="feesSelfuse" :label="stateR == 'month' ? ' 自发自用电费|(万元)' : ' 自发自用电费|(万元)'">
        <template slot-scope="scope">
          <span>{{ Number(scope.row.feesSelfuse).toFixed(2) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import { RadioButton, RadioGroup } from "element-ui";
import { powerCellQuery, powerCellExport } from "./api/asset";
import Vue from "vue";
import utils from "@/utils";
import $ from "jquery";
import { Calendar } from "@icon-park/vue";
Vue.use(RadioGroup);
Vue.use(RadioButton);

export default {
  //这里写组件英文名称，容器dom的id及事件中心命名均用到这个name，请认真填写
  name: "ButtonChange",
  props: {
    customConfig: Object,
    info: Object,
    //应用变量和系统变量 7.26 V8R4C50SPC220需求新加 之前版本取不到appVariables和sysVariables
    appVariables: Array,
    sysVariables: Array,
    //8.11 V8R4C60SPC100需求新加，之前版本取不到themeInfo
    themeInfo: Object,
  },
  computed: {
    theme() {
      let { theme_global_config } = this.themeInfo || {
        theme_global_config: {
          "--theme-public-pinPai-color": "rgba(24,144,255,1)",
          "--theme-public-text-color-1": "rgba(12, 13, 14,1)",
        },
      };

      let themeColor = theme_global_config["--theme-public-pinPai-color"];
      let textColor = theme_global_config["--theme-public-text-color-1"];
      this.$nextTick(() => {
        let style = `#${this.identification} .el-radio-button__inner:hover{
                      color:${this.theme.themeColor};
                      }
                     #${this.identification} .el-radio-button.is-active .el-radio-button__inner:hover{
                      color: #FFF;
                      }
                      `;
        if (this.$refs[this.identification]) {
          this.styleEle = document.createElement("style");
          document.head.appendChild(this.styleEle);
          this.styleEle.innerText = style;
        }
      });
      return {
        themeColor,
        textColor,
      };
    },
  },
  components: {
    Calendar,
  },
  data() {
    return {
      //必需，不可删除
      identification: "用电单位电费月报/年报",
      //业务代码
      tabModel: "月报",
      monthPickerStart: new Date(new Date().getFullYear(), 0),
      monthPickerEnd: new Date(new Date().getFullYear(), 11),
      monthTableData: {},
      yearTableData: {},
      pickerOptionsMonth1: {
        disabledDate: (time) => {
          return this.monthPickerEnd ? time.getTime() > this.monthPickerEnd.getTime() : false;
        },
      },
      pickerOptionsMonth2: {
        disabledDate: (time) => {
          return this.monthPickerStart ? time.getTime() < this.monthPickerStart.getTime() : false;
        },
      },
      stateR: "month",
      stateM: true,
      stationId: "",
      // startDatePicker: this.beginDate(),
      // endDatePicker: this.processDate(),
    };
  },
  mounted() {
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    let { buttons, id } = this.customConfig;
    let componentName = this.$vnode.tag.split("-").pop().toLowerCase();
    this.identification = id ? `secondary_${componentName}_${id}` : `secondary_${componentName}_${utils.generateUUID()}`;
    this.$nextTick(() => {
      let style = `#${this.identification} .el-radio-button__inner:hover{
                      color:${this.theme.themeColor};
                      }
                     #${this.identification} .el-radio-button.is-active .el-radio-button__inner:hover{
                      color: #FFF;
                      }
                      `;
      if (this.$refs[this.identification]) {
        this.styleEle = document.createElement("style");
        document.head.appendChild(this.styleEle);
        this.styleEle.innerText = style;
      }
    });
    //用于定义接收用户输入
    // this.buttons = JSON.parse(buttons).data;
    // this.defaultValue = JSON.parse(buttons).defaultValue;
    //业务代码
    if (this.defaultValue) {
      this.selected = this.defaultValue;
      this.triggerEvent("valueChange", {
        value: this.defaultValue,
      });
    }
  },
  methods: {
    monthChange() {
      if (this.monthPickerStart && this.monthPickerEnd) {
        let message = {
          type: "month",
          date: [this.changeTimeFormat(this.monthPickerStart.getTime()), this.changeTimeFormat(this.monthPickerEnd.getTime())],
          powerCellId: this.stationId,
        };
        powerCellQuery(message).then((res) => {
          this.monthTableData = res.data;
          console.log(res);
        });
      }
    },
    reportClick(value) {
      this.stateR = value;
      if (value == "month") {
        this.stateM = true;
        let messageMonth = {
          type: "month",
          date: [this.monthPickerStart.getFullYear() + "-01", this.monthPickerStart.getFullYear() + "-12"],
          powerCellId: this.stationId,
        };
        powerCellQuery(messageMonth).then((res) => {
          this.monthTableData = res.data;
        });
      } else {
        this.stateM = false;
        let messageMonth = {
          type: "year",
          date: [],
          powerCellId: this.stationId,
        };
        powerCellQuery(messageMonth).then((res) => {
          this.monthTableData = res.data;
        });
      }
    },
    changeTimeFormat(time) {
      var date = new Date(time);
      var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      return date.getFullYear() + "-" + month;
      //返回格式：yyyy-MM-dd hh:mm
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return (prev + curr).toFixed(2);
            } else {
              return prev;
            }
          }, 0);
          sums[index] += " 元";
        } else {
          sums[index] = "N/A";
        }
      });

      return sums;
    },
    exportExcel() {
      let message = {};
      if (this.stateR == "month") {
        message = {
          type: this.stateR,
          date: [this.changeTimeFormat(this.monthPickerStart.getTime()), this.changeTimeFormat(this.monthPickerEnd.getTime())],
          powerCellId: this.stationId,
        };
      } else {
        message = {
          type: this.stateR,
          date: [],
          powerCellId: this.stationId,
        };
      }
      powerCellExport(message)
        .then((res) => {
          const temp = res.headers["content-disposition"].split("=")[1];
          // 对文件名乱码转义--【Node.js】使用iconv-lite解决中文乱码
          let iconv = require("iconv-lite");
          iconv.skipDecodeWarning = true; //忽略警告
          let fileName = iconv.decode(temp, "utf-8");
          const _res = res.data;
          let blob = new Blob([_res]);
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          let fileNameNew = this.UrlDecode(fileName);
          downloadElement.download = fileNameNew; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        })
        .catch((res) => {
          // alert("导出失败");
        });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    AsciiToString(asccode) {
      return String.fromCharCode(asccode);
    },
    UrlDecode(zipStr) {
      var uzipStr = "";
      for (var i = 0; i < zipStr.length; i += 1) {
        var chr = zipStr.charAt(i);
        if (chr === "+") {
          uzipStr += " ";
        } else if (chr === "%") {
          var asc = zipStr.substring(i + 1, i + 3);
          if (parseInt("0x" + asc) > 0x7f) {
            uzipStr += decodeURI("%" + asc.toString() + zipStr.substring(i + 3, i + 9).toString());
            i += 8;
          } else {
            uzipStr += this.AsciiToString(parseInt("0x" + asc));
            i += 2;
          }
        } else {
          uzipStr += chr;
        }
      }
      return uzipStr;
    },
    // table表头换行
    renderheader(h, { column, $index }) {
      return h("span", {}, [h("span", {}, column.label.split("|")[0]), h("br"), h("span", {}, column.label.split("|")[1])]);
    },
    /**
     * 触发事件 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Array} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      let { componentId, appId } = this.customConfig || {};
      componentId && appId && window.eventCenter?.triggerEvent(componentId, eventName, payload);
    },
    //必需，不可删除
    Event_Center_getName() {
      return this.identification;
    },
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_message前缀
    do_EventCenter_searchCompany(value) {
      console.log(value, "--------value");
      this.stationId = value.charcoalId;
      let messageMonth = {
        type: "month",
        date: [this.monthPickerStart.getFullYear() + "-01", this.monthPickerStart.getFullYear() + "-12"],
        powerCellId: this.stationId,
      };
      powerCellQuery(messageMonth).then((res) => {
        this.monthTableData = res.data;
      });
      // let messageYear = {
      //   type: "year",
      //   date: [],
      //   powerCellId: this.stationId,
      // };
      // powerCellQuery(messageYear).then((res) => {
      //   this.yearTableData = res.data;
      // });
    },
    setValue(value) {
      this.selected = value;
    },
  },
  destroyed() {
    //必需，不可删除
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
    //业务代码，不需要记得清除
    document.head.removeChild(this.styleEle);
  },
};
</script>
<style lang="less" scoped>
.p_Report {
  width: 125.52px;
  height: 32px;
  border-radius: 2px;
  opacity: 1;
  font-size: 16px;
  font-weight: 400;
  color: #000000;
  font-family: "Alibaba PuHuiTi";
  border: 1px solid rgba(222, 222, 222, 1);
  background: rgba(255, 255, 255, 1);
  margin-bottom: 15px;
  cursor: pointer;
}

/deep/.el-input__inner {
  border-radius: 2px;
}
.topOption {
  display: flex;
  justify-content: space-between;
}
.topChoose {
  display: flex;
}
.export {
  height: 32px;
  color: #ffffff;
  margin-top: 15px;
  cursor: pointer;
  border-radius: 2px;
}
.iconBox {
  height: 32px;
  width: 32px;
  margin-top: 15px;
  box-sizing: border-box;
  background: #0285fd;
  text-align: center;
  svg {
    margin-top: 5px;
  }
}
/deep/.el-input--prefix .el-input__inner {
  background: #eff0f2 !important;
}
/deep/.el-table__row--striped {
  .el-table__cell {
    background: #f8fcff !important;
    .cell {
      color: #000;
    }
  }
}
/deep/.el-table__body {
  .el-table__cell {
    .cell {
      font-weight: 400;
      color: #000;
    }
  }
}
/deep/.el-input__prefix {
  display: none;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 139px;
}
.active {
  font-weight: 700;
  border-color: rgba(27, 133, 255, 1);
  color: #1b85ff;
}
/deep/.el-input--prefix .el-input__inner {
  height: 32px;
  border-radius: 2px;
}
/deep/.el-table .caret-wrapper {
  left: 10px;
}
/deep/ .el-input__suffix {
  top: -3px !important;
}
/deep/.el-descriptions .is-bordered .el-descriptions-item__cell {
  border: #cedbe3 1px solid;
  border-bottom: 0px;
  color: #000;
}
.el-table--border:after,
.el-table--group:after,
.el-table:before {
  background-color: #cedbe3;
}

.el-table--border,
.el-table--group {
  border-color: #cedbe3;
}

.el-table td,
.el-table th.is-leaf {
  border-color: #cedbe3;
}

.el-table--border th,
.el-table--border th.gutter:last-of-type {
  border-color: #cedbe3;
}

.el-table--border td,
.el-table--border th {
  border-color: #cedbe3;
}
/deep/.is-center {
  border-right: 2px solid #cedbe3;
}
/deep/.el-table__empty-block {
  border-top: 1px solid #cedbe3;
}
/deep/ .el-table__footer-wrapper tbody td {
  color: #000;
  font-weight: 400;
  font-size: 14px;
  background: #ffffff;
}
/deep/ .el-table .caret-wrapper {
  // position: absolute;
  // left: unset;
  // right: 32.5%;
  top: 8px;
}
/deep/.el-table th.el-table__cell > .cell {
  display: flex;
  justify-content: center;
}
/deep/.el-icon-error {
  cursor: pointer;
  font-size: 16px;
}
</style>
