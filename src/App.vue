<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div
    :id="identification"
    style="width: 100%; height: 100%"
    class="panservice"
    :ref="identification"
  >
    <!-- -->
    <button
      :class="{ p_Report: true, active: stateR == 'month' }"
      @click="reportClick('month')"
    >
      月报
    </button>
    <button
      :class="{ p_Report: true, active: stateR == 'year' }"
      @click="reportClick('year')"
    >
      年报
    </button>

    <div class="peizhi">
      <div class="p_left">
        <div class="p_l_M" v-if="stateM">
          <span class="pz_span">选择月份:</span>
          <el-date-picker
            prefix-icon="1"
            v-model="timeStart"
            @change="timeStartFn"
            type="month"
            :picker-options="pickerOptionsMonth1"
            placeholder="选择日期"
            clear-icon="el-icon-error"
          >
          </el-date-picker>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path
              d="M0 0H30C31.1046 0 32 0.895431 32 2V30C32 31.1046 31.1046 32 30 32H0V0Z"
              fill="#0084FF"
            />
            <path
              d="M24.75 8.875H22.2695C22.2695 7.83984 21.4297 7 20.3945 7H20.082C19.0469 7 18.207 7.83984 18.207 8.875H13.8125C13.8125 8.35742 13.6035 7.88867 13.2637 7.54883C12.9238 7.20898 12.4551 7 11.9375 7H11.625C10.5898 7 9.75 7.83984 9.75 8.875H7.25C6.56055 8.875 6 9.43359 6 10.125V24.5C6 25.1895 6.56055 25.75 7.25 25.75H24.75C25.4395 25.75 26 25.1895 26 24.5V10.125C26 9.43359 25.4395 8.875 24.75 8.875ZM19.457 9.03125C19.457 8.59961 19.8066 8.25 20.2383 8.25C20.6699 8.25 21.0195 8.59961 21.0195 9.03125V10.5938C21.0195 11.0254 20.6699 11.375 20.2383 11.375C20.0234 11.375 19.8281 11.2871 19.6855 11.1465C19.5449 11.0039 19.457 10.8086 19.457 10.5938V9.03125ZM11 9.03125C11 8.59961 11.3496 8.25 11.7812 8.25C12.2129 8.25 12.5625 8.59961 12.5625 9.03125V10.5938C12.5625 11.0254 12.2129 11.375 11.7812 11.375C11.5664 11.375 11.3711 11.2871 11.2285 11.1465C11.0879 11.0039 11 10.8086 11 10.5938V9.03125ZM24.75 23.875C24.75 24.2207 24.4707 24.5 24.125 24.5H7.875C7.5293 24.5 7.25 24.2207 7.25 23.875V15.125H24.75V23.875Z"
              fill="white"
            />
            <path
              d="M7.875 16.375H12.875V19.5H7.875V16.375ZM7.875 20.125H12.875V23.25H7.875V20.125ZM13.5 16.375H18.5V19.5H13.5V16.375ZM13.5 20.125H18.5V23.25H13.5V20.125ZM19.125 16.375H24.125V19.5H19.125V16.375ZM19.125 20.125H24.125V23.25H19.125V20.125Z"
              fill="white"
            />
          </svg>

          <span>&nbsp; —— &nbsp; </span>

          <el-date-picker
            prefix-icon="1"
            v-model="timeEnd"
            @change="timeEndFn"
            type="month"
            :picker-options="pickerOptionsMonth2"
            placeholder="选择日期"
          >
          </el-date-picker>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path
              d="M0 0H30C31.1046 0 32 0.895431 32 2V30C32 31.1046 31.1046 32 30 32H0V0Z"
              fill="#0084FF"
            />
            <path
              d="M24.75 8.875H22.2695C22.2695 7.83984 21.4297 7 20.3945 7H20.082C19.0469 7 18.207 7.83984 18.207 8.875H13.8125C13.8125 8.35742 13.6035 7.88867 13.2637 7.54883C12.9238 7.20898 12.4551 7 11.9375 7H11.625C10.5898 7 9.75 7.83984 9.75 8.875H7.25C6.56055 8.875 6 9.43359 6 10.125V24.5C6 25.1895 6.56055 25.75 7.25 25.75H24.75C25.4395 25.75 26 25.1895 26 24.5V10.125C26 9.43359 25.4395 8.875 24.75 8.875ZM19.457 9.03125C19.457 8.59961 19.8066 8.25 20.2383 8.25C20.6699 8.25 21.0195 8.59961 21.0195 9.03125V10.5938C21.0195 11.0254 20.6699 11.375 20.2383 11.375C20.0234 11.375 19.8281 11.2871 19.6855 11.1465C19.5449 11.0039 19.457 10.8086 19.457 10.5938V9.03125ZM11 9.03125C11 8.59961 11.3496 8.25 11.7812 8.25C12.2129 8.25 12.5625 8.59961 12.5625 9.03125V10.5938C12.5625 11.0254 12.2129 11.375 11.7812 11.375C11.5664 11.375 11.3711 11.2871 11.2285 11.1465C11.0879 11.0039 11 10.8086 11 10.5938V9.03125ZM24.75 23.875C24.75 24.2207 24.4707 24.5 24.125 24.5H7.875C7.5293 24.5 7.25 24.2207 7.25 23.875V15.125H24.75V23.875Z"
              fill="white"
            />
            <path
              d="M7.875 16.375H12.875V19.5H7.875V16.375ZM7.875 20.125H12.875V23.25H7.875V20.125ZM13.5 16.375H18.5V19.5H13.5V16.375ZM13.5 20.125H18.5V23.25H13.5V20.125ZM19.125 16.375H24.125V19.5H19.125V16.375ZM19.125 20.125H24.125V23.25H19.125V20.125Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
      <div class="r_left">
        <img
          src="./img/导出标准大小.png"
          style="cursor: pointer"
          @click="exportFn"
          alt=""
        />
      </div>
    </div>
    <div class="tableBody">
      <div class="tableTitle">
        <div class="P_Company" :style="{ width: '254px' }">用电单位</div>
        <div class="P_CompanyName">{{ ricityUser }}</div>
      </div>
      <div
        class="tableTitle"
        style="bordertop: none; borderbottom: none; backgroundcolor: #f8fcff"
      >
        <div class="P_Company" :style="{ width: '254px' }">电站名称</div>
        <div class="P_CompanyName">{{ stationName }}</div>
      </div>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        show-summary
        border
        :row-style="{ height: '40px' }"
        :summary-method="SumFn"
        :header-cell-style="{ padding: 0 + 'px' }"
        :cell-style="{ padding: 0 + 'px', color: '#000000' }"
        :header-row-style="{ height: '50px' }"
      >
        <el-table-column
          prop="date"
          :label="stateR == 'month' ? '月份' : '年份'"
          width="254"
          align="center"
          :render-header="renderheader"
        >
        </el-table-column>
        <el-table-column
          prop="powerOutput"
          :label="stateR == 'month' ? '发电量|(万kWh)' : '发电量|(万kWh)'"
          sortable
          :formatter="totixdFn"
          align="center"
          :render-header="renderheader"
        >
        </el-table-column>
        <el-table-column
          prop="powerOngrid"
          :label="stateR == 'month' ? '上网电量|(万kWh)' : '上网电量|(万kWh)'"
          sortable
          :formatter="totixdFn"
          align="center"
          :render-header="renderheader"
        >
        </el-table-column>
        <el-table-column
          prop="powerSelfuse"
          :label="
            stateR == 'month' ? '自发自用电量|(万kWh)' : '自发自用电量|(万kWh)'
          "
          sortable
          :formatter="totixdFn"
          align="center"
          :render-header="renderheader"
        >
        </el-table-column>
        <el-table-column
          prop="feesSelfuse"
          :label="
            stateR == 'month' ? ' 自发自用电费|(万元)' : ' 自发自用电费|(万元)'
          "
          sortable
          :formatter="totixdFn"
          align="center"
          :render-header="renderheader"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import {
  RadioButton,
  RadioGroup,
  Table,
  TableColumn,
  DatePicker,
} from "element-ui";
import { electricityUser, queryExport } from "./api/asset.js";
import Vue from "vue";
import axios1 from "./api/request.js";
import utils from "@/utils";
import $ from "jquery";

Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);

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
  data() {
    return {
      //必需，不可删除
      identification: "",
      stationId: "",
      //业务代码
      selected: "",
      ricityUser: null,
      stationName: null,
      buttons: [],
      timeDate: [],
      stateR: "month",
      stateM: true,
      timeStart: new Date(new Date().getFullYear(), 0),
      timeEnd: new Date(new Date().getFullYear(), 11),
      tableData: [],
      pickerOptionsMonth1: {
        disabledDate: (time) => {
          return this.timeEnd ? time.getTime() > this.timeEnd.getTime() : false;
        },
      },
      pickerOptionsMonth2: {
        disabledDate: (time) => {
          return this.timeStart
            ? time.getTime() < this.timeStart.getTime()
            : false;
        },
      },
      renderheader(h, { column, $index }) {
        return h("span", {}, [
          h("span", {}, column.label.split("|")[0]),
          h("br"),
          h("span", {}, column.label.split("|")[1]),
        ]);
      },
      defaultValue: "",
      styleEle: null,
      iframeUrl:
        "/applicationview/content/view?appid=0d8c0264-2588-aad1-230c-392ab3b401f1&type=view&menuId=7f3afc2e-06b7-f7d4-ba3e-080d27a20ff4%233",
    };
  },
  watch: {
    tableData: {
      handler() {
        this.$nextTick(() => {
          let temp = document.querySelectorAll(
            ".el-table .el-table__body-wrapper .el-table__row"
          );
          if (temp.length > 0) {
            if (
              temp[temp.length - 1].className.indexOf(
                "el-table__row--striped"
              ) == -1
            ) {
              console.log(11);
              let a = document.querySelectorAll(
                ".el-table__footer-wrapper tbody td.el-table__cell"
              );
              for (let i = 0; i < a.length; i++) {
                a[i].style.backgroundColor = "#F8FCFF";
              }
            }
          }
        });
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    let cookie = document.cookie;
    let tempArr = cookie && cookie.split(";");
    let tempObj = {};
    tempArr.forEach((x) => {
      let itme = x.split("=");
      tempObj[itme[0]] = itme[1];
    });
    this.iframeUrl = this.iframeUrl + "&token=" + tempObj.token;
  },
  mounted() {
    //用于注册事件定义，不可删除
    let date1 =
      this.timeStart.getFullYear() +
      "-" +
      (this.timeStart.getMonth() + 1 < 10
        ? "0" + (this.timeStart.getMonth() + 1)
        : this.timeStart.getMonth() + 1);
    let date2 =
      this.timeEnd.getFullYear() +
      "-" +
      (this.timeEnd.getMonth() + 1 < 10
        ? "0" + (this.timeEnd.getMonth() + 1)
        : this.timeEnd.getMonth() + 1);
    this.timeDate = [date1, date2];
    this.stationId = "116";
    let { componentId } = this.customConfig || {};
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );
    let { buttons, id } = this.customConfig;
    let componentName = this.$vnode.tag.split("-").pop().toLowerCase();
    this.identification = id
      ? `secondary_${componentName}_${id}`
      : `secondary_${componentName}_${utils.generateUUID()}`;
    //用于定义接收用户输入
    // this.buttons = JSON.parse(buttons).data;
    // this.defaultValue = JSON.parse(buttons).defaultValue;
    this.$nextTick(() => {
      let a = document.querySelectorAll(".el-table th.el-table__cell>.cell");
      a.forEach((x, i) => {
        if (i == 0) return;
        x.firstChild.style.paddingLeft = "24px";
      });
    });
    //业务代码
    let iframeEl = this.$refs.iframes;
    if (iframeEl) {
      console.log(iframeEl, "获得iframe标签");

      iframeEl.allow = "camera *; microphone *";
    }
    if (this.defaultValue) {
      this.selected = this.defaultValue;
      this.triggerEvent("valueChange", {
        value: this.defaultValue,
      });
    }

    this.queryP();

    this.triggerEvent("componentLoaded");
  },
  methods: {
    handleValueChange(value) {
      this.triggerEvent("valueChange", {
        value,
      });
    },
    SumFn(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        // 第一列 显示文字 小计
        if (index === 0) {
          sums[index] = "合计";
          return;
        }

        const values = data.map((item) => Number(item[column.property]));

        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!isNaN(value)) {
            return prev + curr;
          } else {
            return prev;
          }
        }, 0);
        sums[index] = sums[index].toFixed(2); // 保留2位小数，解决小数合计列
      });
      return sums;
    },
    timeStartFn() {
      let a = this.timeStart.getFullYear();
      let b = this.timeStart.getMonth() + 1;
      if (b < 10) b = "0" + b;
      this.timeDate[0] = a + "-" + b;
      if (this.timeDate.length == 2) {
        this.queryP();
      }
    },
    timeEndFn() {
      let a = this.timeEnd.getFullYear();
      let b = this.timeEnd.getMonth() + 1;
      if (b < 10) b = "0" + b;
      this.timeDate[1] = a + "-" + b;
      if (this.timeDate.length == 2) {
        this.queryP();
      }
    },
    queryP() {
      let type = this.stateR;
      let date = this.timeDate;
      let stationId = this.stationId;
      electricityUser({ type, date, stationId }).then((res) => {
        let data = res.data.propertyList;
        this.tableData = data;
        this.ricityUser = res.data.electricityUser;
        this.stationName = res.data.stationName;
      });
    },
    exportFn() {
      let type = this.stateR;
      let date = this.timeDate;
      let stationId = this.stationId;
      queryExport({ type, date, stationId }).then((res) => {
        var blob = res.data;
        //  FileReader主要用于将文件内容读入内存
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        // onload当读取操作成功完成时调用
        reader.onload = function (e) {
          var a = document.createElement("a");
          // 获取文件名fileName
          var fileName = res.headers["content-disposition"].split("=");
          fileName = fileName[fileName.length - 1];
          fileName = decodeURI(fileName);
          a.download = fileName;
          a.href = e.target.result;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };
      });
    },
    totixdFn(row, column, cellValue, index) {
      return Number(cellValue).toFixed(2);
    },
    reportClick(value) {
      this.stateR = value;
      if (value == "month") {
        this.stateM = true;
        let date1 =
          this.timeStart.getFullYear() + "-" + (this.timeStart.getMonth() + 1);
        let date2 =
          this.timeEnd.getFullYear() + "-" + (this.timeEnd.getMonth() + 1);
        this.timeDate = [date1, date2];
      } else {
        this.stateM = false;
        this.timeDate = [];
      }
      this.queryP();
    },
    /**
     * 触发事件 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Array} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      let { componentId, appId } = this.customConfig || {};
      componentId &&
        appId &&
        window.eventCenter?.triggerEvent(componentId, eventName, payload);
    },
    //必需，不可删除
    Event_Center_getName() {
      return this.identification;
    },
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_message前缀
    do_EventCenter_setValue(value) {
      console.log(value, "=====");
      this.setValue(value);
    },
    setValue(value) {
      this.stationId = value.value;
      this.queryP();
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
.panservice {
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
    cursor: pointer;
  }

  /deep/.el-input__inner {
    border-radius: 2px;
  }

  .active {
    font-weight: 700;
    border-color: rgba(27, 133, 255, 1);
    color: #1b85ff;
  }

  .tableTitle {
    display: flex;
    border: 1px solid #d8dfe7;
    // border-bottom: none;
    font-size: 14px;
    line-height: 40px;
    background-color: #fff;

    .P_Company {
      background-color: #ebf5ff;
      font-weight: 900;
      line-height: 40px;
      text-align: center;
      border-right: 1px solid #d8dfe7;
      box-sizing: border-box;
    }

    .P_CompanyName {
      padding-left: 100px;
      font-size: 14px;
      font-weight: 400;
      font-family: "Alibaba PuHuiTi";
    }
  }

  .peizhi {
    margin: 29px 0 26px 0;
    display: flex;
    justify-content: space-between;

    /deep/ .el-icon-error {
      cursor: pointer;
      font-size: 16px;
      margin-top: 2px;
    }

    .icon {
      background-color: #0285fd;
    }

    .pz_span {
      font-size: 16px;
      padding-right: 15px;
      line-height: 32px;
    }

    /deep/.el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 139px;
      height: 32px;
    }

    /deep/ .el-date-editor .el-input__inner {
      background-color: #eef0f2;
      height: 32px;
    }

    .p_l_M {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .p_export {
      font-size: 16px;
      font-weight: 500;
      display: flex;
      justify-content: center;
      align-items: center;
      // float: right;
      color: #fff;
      width: 85px;
      height: 32px;
      border-radius: 3px;
      opacity: 1;

      border: 1px solid rgba(0, 132, 255, 1);
      background: rgba(0, 132, 255, 1);
      cursor: pointer;
    }

    .p_right {
      align-self: end;
    }
  }

  .tableBody {
    color: #000000;

    /deep/ .el-table {
      color: #000;
    }

    /deep/
      .el-table
      .el-table__body-wrapper
      .el-table__row--striped
      td.el-table__cell {
      background: #f8fcff;
      border-color: #d8dfe7;
    }

    /deep/ .el-table .el-table__body-wrapper .el-table__row td.el-table__cell {
      border-color: #d8dfe7;
    }

    /deep/ .el-table__header-wrapper .has-gutter tr {
      background-color: #ebf5ff;
      border-color: #d8dfe7;
      color: #000000;
    }

    /deep/ .el-table th.el-table__cell {
      background-color: transparent;
      border-color: #d8dfe7;
      color: #000000;
    }

    /deep/.el-table th.el-table__cell > .cell {
      display: flex;
      justify-content: center;
      align-items: center;

      // :nth-child(0) {
      //   padding-left: 24px;
      // }
    }

    /deep/ .el-table__footer-wrapper tbody td.el-table__cell {
      background-color: transparent;
      border-color: #d8dfe7;

      color: #000000;
    }

    /deep/ .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
      background-color: #d8dfe7;
    }

    .el-table--border:after,
    .el-table--group:after,
    .el-table:before {
      background-color: #d8dfe7;
    }

    .el-table--border,
    .el-table--group {
      border-color: #d8dfe7;
    }

    .el-table td,
    .el-table th.is-leaf {
      border-color: #d8dfe7;
    }

    .el-table--border th,
    .el-table--border th.gutter:last-of-type {
      border-color: #d8dfe7;
    }

    .el-table--border td,
    .el-table--border th {
      border-color: #d8dfe7;
    }
  }

  /deep/ .el-table .caret-wrapper {
    // position: absolute;
    left: 10px;
    // right: 30%;
    top: 2px;
  }
}
</style>
