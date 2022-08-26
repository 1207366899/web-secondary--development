<template>
  <div className="analyzer-vue-demo" v-if="show" :style="{
    width: '100%',
    height: '100%',
    position: 'relative'
  }" ref="analyzer">
    <div class="echarts" ref="echart"></div>
    <div class='overDiv' v-show="showZ" :style="{ backgroundColor: color }"></div>
  </div>
</template>

<script>
const zipObject = (arr1, arr2) => {
  const ret = {};
  arr1.forEach((item, index) => {
    ret[item] = arr2[index];
  });
  return ret;
};
const debounce = (func, ms) => {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, ms);
  };
};


import * as echarts from "echarts";
import { TimePicker } from "element-ui";
export default {
  props: {
    dataSource: {
      type: Array,
      default: () => [],
    },
    componentId: {
      type: String | undefined,
      default: "",
    },
    options: {
      type: Object,
      default: () => ({
        // 配置项从externalVariables里取
        externalVariables: {},
      }),
    },
    updateProcess: {
      type: Function,
      default: () => { },
    },
  },
  data() {
    return {
      Gechart: null,
      show: true,
      color: 'white',
      showZ: false,
      temp1: [
        45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62,
      ],
      temp2: [
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
      ],
      yitem: {
        type: "value",
        axisLabel: {
          formatter(a) {
            return [`{a|${(a / 10).toFixed(2)}}`];
          },
          rich: {
            a: {
              height: 40,
            },
          },
          textStyle: {
            fontSize: "12",
            fontWeight: 400,
            fontFamily: "Alibaba PuHuiTi",
          },
        },
        // data: [0, 10, 20, 30, 40, 50, 60],
        splitLine: {
          lineStyle: {},
        },
      },
      options1: {
        title: {
          // text: "万kWh",
          left: "60px",
          top: "20px",
          textStyle: {
            color: "#666666",
            fontSize: 12,
          },
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(75, 75, 75,0.7)",
          textStyle: {
            color: "#fff", //字体颜色，
            fontSize: 13, //字体大小
          },
          borderColor: "rgba(75, 75, 75,0.7)",
          // formatter: function (params) {
          //   let res =
          //     "总电量: " +
          //     (Number(params[0].data) + Number(params[1].data)) +
          //     "<br>" +
          //     "自发自用电量: " +
          //     params[0].data +
          //     "<br>" +
          //     "上网电量: " +
          //     params[1].data +
          //     "<br>";

          //   return (
          //     '<div class="showBox"  style="bcakground:#4b4b4b"  >' +
          //     res +
          //     "</div>"
          //   );
          // },
        },
        grid: {
          bottom: 60,
        },
        legend: {
          data: [],
        },
        xAxis: {
          data: [],
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              width: 1, // 粗细,
              color: "red",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: true,
            interval: 0, //使x轴文字显示全
            textStyle: {
              fontSize: "12",
              itemSize: "",
              fontWeight: 400,
              fontFamily: "Alibaba PuHuiTi",
            },
            rotate: 45,
          },
        },

        yAxis: [
          {
            type: "value",
            alignTicks: true,
            axisLabel: {
              rich: {
                a: {
                  height: 40,
                },
              },
              textStyle: {
                fontSize: 11,
                color: "#8F96A5",
                fontFamily: "SourceHanSansCN-Regular",
              },
            },

            name: "",
            nameTextStyle: {
              color: "#666666",
              fontSize: 12,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: "#F4F6F8",
              },
            },
          },
        ],

        series: [
          {
            // barWidth: 21,
            type: "bar",
            stack: "使用情况",
            itemStyle: {
              normal: {
                // opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgb(56, 108, 166)",
                  },
                  {
                    offset: 1,
                    color: "rgb(55, 120, 137)",
                  },
                ]),
              },
            },
          },
          {
            type: "bar",
            stack: "使用情况",
            // yAxisIndex: 1,
            barWidth: 21,

            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  formatter: function (val) { },
                  textStyle: {
                    //数值样式
                    color: "#996699",
                    fontSize: 18,
                    fontWeight: 400,
                    fontFamily: "Alibaba PuHuiTi",
                  },
                },
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgb(65, 170, 139)",
                  },
                  {
                    offset: 1,
                    color: "rgb(36, 222, 212)",
                  },
                ]),
              },
            },
          },
          {
            type: "bar",
            stack: "使用情况",

            itemStyle: {
              normal: {
                // color: '#996699'
                color: "#cccc99",
              },
            },
          },
        ],
      },
    };
  },
  computed: {
    tableDataHeader() {
      return (window.__analysisData[0] || this.dataSource[0] || []).map(
        (t) => ({
          prop: t,
          label: t,
        })
      );
    },
    tableData() {
      let [header, ...tableData] = window.__analysisData || this.dataSource;
      tableData = tableData || [];
      return tableData.map((d) =>
        (window?._?.zipObject || zipObject)(header, d)
      );
    },
    borederWidth() {
      let colorTemp = Number(this?.options?.externalVariables?.柱宽) || 24;
      return colorTemp;
    },
    columnarColorOne() {
      console.log(this?.options?.externalVariables?.渐变色2?.split(","), '===========');
      console.log(this?.options?.externalVariables?.渐变色2, '===========');
      let colorTemp =
        this?.options?.externalVariables?.渐变色1?.split(",").length == 2
          ? this?.options?.externalVariables?.渐变色1
          : "#386CA6,#377889";
      return colorTemp.split(",");
    },
    columnarColorTwo() {
      console.log(this?.options?.externalVariables?.渐变色2?.split(","), '===========');
      console.log(this?.options?.externalVariables?.渐变色2, '===========');
      let colorTemp =
        this?.options?.externalVariables?.渐变色2?.split(",").length == 2
          ? this?.options?.externalVariables?.渐变色2
          : "#41AA8B,#24DED4";
      return colorTemp.split(",");
    },
    labelColor() {
      let fontSize = this.options?.externalVariables?.头部字体大小
        ? this.options?.externalVariables?.头部字体大小
        : "12";
      let fontColor = this.options?.externalVariables?.头部文字颜色
        ? this.options?.externalVariables?.头部文字颜色
        : "#996699";
      let fontFamily = this.options?.externalVariables?.头部字体类型
        ? this.options?.externalVariables?.头部字体类型
        : "Alibaba PuHuiTi";

      // this.options.externalVariables.头部文字颜色 || '#996699'
      return { fontSize, color: fontColor, fontFamily };
    },
    labelArr() {
      let labelTemp = this.options.externalVariables?.标签名称
        ? this.options.externalVariables.标签名称.split(",")
        : ["上网电量", "自发自用发电量", "消纳率(%)"];

      return labelTemp;
    },
    legendOps() {
      let optionT = this.options?.externalVariables?.距顶部距离
        ? this.options?.externalVariables?.距顶部距离
        : "";
      let optionR = this.options?.externalVariables?.距右侧距离
        ? this.options?.externalVariables?.距右侧距离
        : "";
      let optionB = this.options?.externalVariables?.距底部距离
        ? this.options?.externalVariables?.距底部距离
        : "";
      let optionL = this.options?.externalVariables?.距左侧距离
        ? this.options?.externalVariables?.距左侧距离
        : "";
      let ObjOpt = {};
      optionT ? (ObjOpt.top = optionT) : null;
      optionR ? (ObjOpt.right = optionR) : null;
      optionB ? (ObjOpt.bottom = optionB) : null;
      optionL ? (ObjOpt.left = optionL) : null;
      return ObjOpt;
    },
    company() {
      let unit = this.options?.externalVariables?.单位
        ? this.options?.externalVariables?.单位
        : "";
      return unit;
    },
    xAxisStyle() {
      let fontSize = this.options?.externalVariables?.x轴坐标字体大小
        ? this.options?.externalVariables?.x轴坐标字体大小
        : "12";
      let fontColor = this.options?.externalVariables?.x轴坐标字体颜色
        ? this.options?.externalVariables?.x轴坐标字体颜色
        : "";
      let fontFamily = this.options?.externalVariables?.x轴坐标字体类型
        ? this.options?.externalVariables?.x轴坐标字体类型
        : "Alibaba PuHuiTi";

      return { fontSize, color: fontColor, fontFamily };
    },
    xAxisColor() {
      let xcolor = this.options?.externalVariables?.x坐标轴颜色 || "#24292f";
      let ycolor =
        this.options?.externalVariables?.y坐标轴分割线颜色 || "#e0e6f1";
      return { xcolor, ycolor };
    },
    yAxisStyle() {
      let fontSize = this.options?.externalVariables?.y轴坐标字体大小
        ? this.options?.externalVariables?.y轴坐标字体大小
        : "12";
      let fontColor = this.options?.externalVariables?.y轴坐标字体颜色
        ? this.options?.externalVariables?.y轴坐标字体颜色
        : "";
      let fontFamily = this.options?.externalVariables?.y轴坐标字体类型
        ? this.options?.externalVariables?.y轴坐标字体类型
        : "Alibaba PuHuiTi";

      return { fontSize, color: fontColor, fontFamily };
    },
    unitSystem() {
      let multiple = Number(this.options?.externalVariables?.倍数) || '';
      let unit = this.options?.externalVariables?.y单位 || "";
      let places = Number(this.options?.externalVariables?.小数位) || 0;

      return { multiple, unit, places };
    },
    Secondaryaxis() {
      let multiple = this.options?.externalVariables?.次轴 || "";
      return multiple;
    },
    legendColor() {
      let color = this.options?.externalVariables?.图例字体颜色 || 'black'
      let fontSize = this.options?.externalVariables?.图例字体大小 || '12'
      return { color, fontSize }
    },
    legendWidt() {
      let width = Number(this.options?.externalVariables?.图例图形宽) || 25
      let height = Number(this.options?.externalVariables?.图例图形高) || 14
      return { width, height }
    }
    // colorArr(){
    //   return{c  }this.options.externalVariables.color
    // }
  },
  watch: {
    show: {
      handler(newV) {
        console.log(newV);
        // this.initFn()
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.showZ = this.options?.externalVariables?.遮罩体显示 == 'true' ? true : false
    this.color = this.options?.externalVariables?.遮罩体颜色 || '#0e2a43'
    let tableD = JSON.parse(JSON.stringify(this.dataSource));
    let columnData = tableD.shift();
    columnData?.shift();

    //处理资产里的数据
    let dataArr2 = [];
    let addArr = [];
    let dArr = [];
    let dataArr1 = tableD.map((x) => {
      dataArr2.push(Number(x[2]));
      addArr.push(x[0]);
      dArr.push(Number(x[1]) + Number(x[2]));
      return Number(x[1]);
    });

    this.options1.series[0].data = dataArr1;
    this.options1.series[1].data = dataArr2;
    let y = this.pjzFn(dArr) - 1;
    let maxY = Number(String(Math.round(Math.max(...dArr) / 4))[0]);
    let rangeY = this.setYAxisMaxVal(dArr, y, maxY);

    // this.options1.series[2].data = dArr
    this.options1.xAxis.data = addArr;

    // let that = this;
    this.options1.series[1].itemStyle.normal.label.formatter = function (val) {
      // let data1 = that.temp1[val.dataIndex];
      //如果用资产就用这个
      let data1 = dataArr1[val.dataIndex];
      let temp = Number(data1) + Number(val.data);
      return ((data1 / temp) * 100).toFixed(2);
    };

    this.options1.series[0].itemStyle.normal.color =
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: this.columnarColorOne[0],
        },
        {
          offset: 1,
          color: this.columnarColorOne[1] || this.columnarColorOne[0],
        },
      ]);
    this.options1.series[1].itemStyle.normal.color =
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: this.columnarColorTwo[0],
        },
        {
          offset: 1,
          color: this.columnarColorTwo[1],
        },
      ]);
    columnData?.forEach((x, i) => {
      this.options1.legend.data[i] = { name: x };
    });
    // this.options1.legend.data = columnData;
    this.options1.series.forEach((item, i) => {
      item.name = columnData?.[i];
    });
    this.options1.yAxis[0].max = rangeY;
    this.options1.yAxis[0].min = 0;
    let that = this;

    if (that.unitSystem.multiple < rangeY) {
      this.options1.yAxis[0].axisLabel.formatter = function (a) {
        return [
          `{a|${(a / that.unitSystem.multiple).toFixed(
            that.unitSystem.places
          )}}`,
        ];
      };
      this.options1.tooltip.formatter = function (params) {
        let res =
          "总电量: " +
          ((Number(params[0].data) + Number(params[1].data)) /
            that.unitSystem.multiple).toFixed(that.unitSystem.places) +
          "<br>" +
          "自发自用电量: " +
          (Number(params[0].data) /
            that.unitSystem.multiple).toFixed(that.unitSystem.places) +
          "<br>" +
          "上网电量: " +
          (Number(params[1].data) /
            that.unitSystem.multiple).toFixed(that.unitSystem.places) +
          "<br>";

        return (
          '<div class="showBox"  style="bcakground:#4b4b4b"  >' + res + "</div>"
        );
      };
      this.options1.yAxis[0].name = this.company;
    } else {
      this.options1.yAxis[0].axisLabel.formatter = function (a) {
        return [`{a|${a}}`];
      };
      this.options1.tooltip.formatter = function (params) {
        let res =
          "总电量: " +
          (Number(params[0].data) + Number(params[1].data)) +
          "<br>" +
          "自发自用电量: " +
          params[0].data +
          "<br>" +
          "上网电量: " +
          params[1].data +
          "<br>";

        return (
          '<div class="showBox"  style="bcakground:#4b4b4b"  >' + res + "</div>"
        );
      };
    }
    if (this.options?.externalVariables?.倍数 === '' || this.options?.externalVariables?.倍数 === undefined) {
      this.options1.yAxis[0].name = '';
      this.options1.yAxis[0].axisLabel.formatter = function (a) {
        return [`{a|${a}}`];
      };
      this.options1.tooltip.formatter = function (params) {
        let res =
          "总电量: " +
          (Number(params[0].data) + Number(params[1].data)) +
          "<br>" +
          "自发自用电量: " +
          params[0].data +
          "<br>" +
          "上网电量: " +
          params[1].data +
          "<br>";

        return (
          '<div class="showBox"  style="bcakground:#4b4b4b"  >' + res + "</div>"
        );
      };
    }
    this.options1.xAxis.axisLabel.textStyle = this.xAxisStyle;
    this.options1.yAxis[0].axisLabel.rich.a = this.yAxisStyle;

    for (let key in this.legendOps) {
      this.options1.legend[key] = this.legendOps[key];
    }
    this.options1.series[1].itemStyle.normal.label.textStyle = this.labelColor;
    this.options1.series[2].itemStyle.normal.color = this.labelColor.color;
    this.options1.xAxis.axisLine.lineStyle.color = this.xAxisColor.xcolor;
    this.options1.yAxis[0].splitLine.lineStyle.color = this.xAxisColor.ycolor;

    this.options1.legend.data[2].icon = "circle";
    this.options1.legend.textStyle = this.legendColor;
    this.options1.legend.itemWidth = this.legendWidt.width
    this.options1.legend.itemHeight = this.legendWidt.height
    // this.options1.yAxis[1].name = "";
    // this.options1.yAxis[1].axisLabel.formatter = function (a) {
    //   return [
    //     `{a|${(a / that.unitSystem.multiple).toFixed(that.unitSystem.places)}${
    //       that.unitSystem.unit
    //     }}`,
    //   ];
    // };

    // if (this.Secondaryaxis) {
    //   this.options1.series[1].yAxisIndex = 1;

    //   // this.options1.series.forEach(x => {
    //   //   x.name == this.Secondaryaxis ? x.yAxisIndex = 1 : null
    //   // })
    // }

    this.options1.series[0].barWidth = this.borederWidth;
    this.options1.series[1].barWidth = this.borederWidth;


  },
  beforeMount() {

    const events = [
      {
        key: "onClick",
        name: "点击",
        payload: [
          {
            name: "名称",
            dataType: "string",
            key: "name",
          },
        ],
      },
      {
        key: "onMounted",
        name: "加载完成",
        payload: [
          {
            name: "事件",
            dataType: "string",
            key: "Time",
          },
        ],
      },
    ];

    const actions = [
      {
        key: "show",
        name: "显示",
        params: [],
      },
      {
        key: "hide",
        name: "隐藏",
        params: [],
      },
    ];

    this.componentId &&
      window.componentCenter?.register &&
      window.componentCenter.register(this.componentId, "comp", this, {
        events,
        actions,
      });
    this.updateProcess && this.updateProcess();

    this.mountFn()
  },
  mounted() {
    this.$refs.analyzer.parentNode.style.height = "100%";
    this.$refs.analyzer.parentNode.style.width = "100%";
    this.$refs.analyzer.parentNode.parentNode.style.minHeight = "0";
    this.$refs.analyzer.style.display = 'block'
    // document.querySelector('.overDiv').style.display = 'block'
    // this.$refs.analyzer.addEventListener("resize", function () {
    // console.log(document.querySelector('.overDiv').style.display == '');
    // }) 
    this.initFn()

  },

  methods: {
    initFn() {
      this.Gechart = echarts.init(this.$refs.echart);

      this.Gechart.setOption(this.options1);


      this.options1 && this.Gechart.setOption(this.options1);
      const task = () => {
        this.Gechart.resize();
      };
      window.addEventListener("resize", debounce(task, 300));
    },
    pjzFn(arr) {
      var ret = 0;
      //让数组里的值相加
      for (var i = 0; i < arr.length; i++) {
        ret = ret + Number(arr[i]);
      }
      //求数组里的平均数：让求的和减去还剩下的个数，一开始是8个，上面减去了最小值和最大值还剩下6个，数组的长度就是6
      var liang = parseInt(ret / arr.length);
      return String(liang).length;
    },
    setYAxisMaxVal(arrayF, y, x) {
      // 扁平化n维数组方法，与Array.flat()相同
      const flatten = (arr) => {
        while (arr.some((item) => Array.isArray(item))) {
          arr = [].concat(...arr);
        }
        return arr;
      };
      // 计算y轴最大值并返回
      const returnMaxValue = (array, referMax) => {
        try {
          // flat和flatMap方法为ES2019(ES10)方法，目前还未在所有浏览器完全兼容，所以使用trycatch
          if (Math.max(...array.flat(Infinity)) > referMax) {
            referMax =
              referMax -
              (Math.max(...array.flat(Infinity)) % referMax) +
              Math.max(...array.flat(Infinity));
          }
          return referMax;
        } catch (error) {
          // 如果客户端不支持flat，则使用上面自己写的flatten来扁平化数组
          if (Math.max(...flatten(array)) > referMax) {
            referMax =
              referMax -
              (Math.max(...flatten(array)) % referMax) +
              Math.max(...flatten(array));
          }
          return referMax;
        }
      };
      let maxValue = Math.pow(10, y) * x;
      maxValue = returnMaxValue(arrayF, maxValue);
      return maxValue;
    },
    mountFn() {
      this.componentId &&
        window.eventCenter?.triggerEvent &&
        window.eventCenter.triggerEvent(this.componentId, "onMounted", {
          Time: "二开插件",
        });
    },
    clickBt() {
      this.componentId &&
        window.eventCenter?.triggerEvent &&
        window.eventCenter.triggerEvent(this.componentId, "onClick", {
          name: "二开插件",
        });
    },
    dddgFn(node) {
      let temp = node.className
      if (temp == 'disabled-transform') {
        return node
      } else {
        return this.dddgFn(node.parentNode)
      }

    },
    // 逻辑控制用，不可删，return内容可改
    Event_Center_getName: () => {
      return "发电量堆叠图";
    },

    do_EventCenter_show(param) {

      let temp = this.dddgFn(this.$refs.analyzer)
      temp.parentNode.style.display = 'block'
      this.$refs.analyzer.style.display = "block";
      this.show = this.$refs.analyzer.style.display == 'block'

      if (tempDom.style.display == 'block' || tempDom.style.display == '') tempDom.style.display = 'none'

    },
    do_EventCenter_hide(param) {


      this.$refs.analyzer.style.display = "none";
      let tempDom = document.querySelector('.overDiv')
      if (tempDom.style.display == 'block' || tempDom.style.display == '') tempDom.style.display = 'none'
    },
  },
};
</script>


<style lang="less" scoped>
.echarts {
  height: 100%;
  // height: 900px;
  // width: 600px;
}

.overDiv {
  height: 100%;
  width: 100%;
  background: green;
  position: absolute;
  top: 0;
  left: 0;
}

.showBox {
  background-color: #4b4b4b;
}
</style>