<template>
  <div
    class="analyzer-secondary"
    :style="{ width, height }"
    ref="analyzer-secondary"
    :id="id"
  >
    <div id="mMap" :style="{ width, height }"></div>

    <div class="layers">
      <el-checkbox-group v-model="checkList" @change="checkListChange">
        <el-checkbox
          v-for="(item, index) in pointListApp"
          :label="item.name"
          :key="index"
        ></el-checkbox>
      </el-checkbox-group>
    </div>
    <el-dialog
      :width="dialogPoint.modalWidth?.toString() + 'px'"
      :visible.sync="pointVisible"
      :append-to-body="true"
      :show-close="false"
      custom-class="point-detail"
    >
      <div :style="{ width: '100%', height: dialogPoint.modalHeight + 'px' }">
        <div class="modalTitle">{{ dialogPoint.modalTitle }}</div>
        <el-table
          :data="
            pointData.slice(
              (currentPage - 1) * pagesize,
              currentPage * pagesize
            )
          "
          border
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="_index" label="序号" width="70" align="center">
          </el-table-column>
          <el-table-column
            v-for="(item, index) in dialogPoint.modalTableColumn"
            :key="index"
            :label="item.column"
            :prop="item.column"
            :width="item.width"
            align="center"
          >
            <template slot-scope="scope">
              <el-tooltip effect="dark">
                <div slot="content" :style="{ 'max-width': '500px' }">
                  {{ scope.row[item.column] }}
                </div>
                <span class="point-cell">{{ scope.row[item.column] }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          layout="prev, pager, next"
          :total="pointData.length"
          class="pagination"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  Table,
  TableColumn,
  Pagination,
  Dialog,
  Tooltip,
  Checkbox,
  CheckboxGroup,
} from "element-ui";
import Vue from "vue";
import _ from "lodash";
import * as Cesium from "cesium";

import green3d from "./images/green3d.png";
import yellow3d from "./images/yellow3d.png";
import red3d from "./images/red3d.png";

// if (process.env.NODE_ENV !== "production") {
// Cesium.Ion.defaultAccessToken =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZTJhY2U0NC1kZmRjLTRhMDctYWFhMS05ODFjYWYzNjE0ZWMiLCJpZCI6MTIwMzgwLCJpYXQiOjE2NzI5MDQzMDh9.Co78gtu4FH8w3Qzy7noVwTad5JfwZ-lNjOcoDAiw7c0"; //这里的token是自己申请的token
window.CESIUM_BASE_URL = "/";
// }
// if (process.env.NODE_ENV === "production") {
//   const { Cesium } = window?.Cesium || null;
//   console.log('production', window);
// }
Vue.use(Dialog);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Tooltip);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);

let imgMap = {};
export default {
  name: "MainCesium",
  components: {},
  data() {
    return {
      id: "",
      width: "100%",
      height: "100%",
      number: 1,
      viewer: null,
      scene: null,
      handler: null,
      scriptEle: null,
      scriptEle1: null,
      scriptEle2: null,
      scriptEle3: null,
      providerList: [], // 底图配置列表
      pointListApp: [], // 点位配置
      serverImageryUrl:
        "http://10.34.4.103:8010/ServiceAdapter/MAP/EMAP_DEEPWEB/6f9c5d19634442a3accb406539ef09dc",
      POICollection: [],
      dialogPoint: {},
      pointVisible: false,
      pointData: [],
      pagesize: 10,
      currentPage: 1,
      checkList: [],

      // {
      //   text: "武胜社区",
      //   img: "https://img0.baidu.com/it/u=2223986897,2002289354&fm=253&fmt=auto&app=138&f=JPG?w=500&h=500",
      //   longitude: 114.28590897394388,
      //   latitude: 30.569480438478557
      // },
      // {
      //   text: "晴川桥",
      //   img: "https://img0.baidu.com/it/u=2223986897,2002289354&fm=253&fmt=auto&app=138&f=JPG?w=500&h=500",
      //   longitude: 114.27893240843595,
      //   latitude: 30.566033923596226
      // },
      // {
      //   text: "南岸嘴江滩公园",
      //   img: "https://img0.baidu.com/it/u=2223986897,2002289354&fm=253&fmt=auto&app=138&f=JPG?w=500&h=500",
      //   longitude: 114.28279014079745,
      //   latitude: 30.56420130806063
      // }
    };
  },
  props: {
    dataSource: Object | Array,
    componentId: String,
    customConfig: Object,
    options: Object,
    updateProcess: Function,
    mainInit: Function,
  },
  created() {},
  mounted() {
    // this.scriptEle = document.createElement("script")
    // document.head.appendChild(this.scriptEle)
    // this.scriptEle.src = "http://earthsdk.com/v/last/XbsjCesium/Cesium.js";

    // this.scriptEle1 = document.createElement("script")
    // document.head.appendChild(this.scriptEle1)
    // this.scriptEle1.src = "http://earthsdk.com/v/last/XbsjEarth/XbsjEarth.js";

    // this.scriptEle2 = document.createElement("script")
    // document.head.appendChild(this.scriptEle2)
    // this.scriptEle2.src = "http://earthsdk.com/v/last/Apps/Examples/scripts/vue.min.js";

    // this.scriptEle3 = document.createElement("link")
    // document.head.appendChild(this.scriptEle3)
    // this.scriptEle3.rel = "stylesheet";
    // this.scriptEle3.href = "http://earthsdk.com/v/last/XbsjCesium/Widgets/widgets.css";

    this.mainInit(this);
    this.initDataSource();
    this.initComData();
  },
  methods: {
    Event_Center_getName() {
      return this.id;
    },
    triggerEvent(eventName, payload) {
      this.props.componentId &&
        window.eventCenter?.triggerEvent(
          this.props.componentId,
          eventName,
          //payload需为一个object
          payload
        );
    },
    // 配置项
    initComData() {
      //customConfig为组件式配置项数据
      //dataSource为分析仪左侧拖入的数据源
      const { dataSource, customConfig, options } = this;
      //customOptions为传统的输入框形式的配置项
      const customOptions = options?.externalVariables || {};
      // console.log('展示页面customConfig', customConfig);
      // console.log('//**展示页面dataSource**//', dataSource);
      try {
        // 模型
        this.providerList = customConfig.imageryProviderList
          ? customConfig.imageryProviderList
          : [];
        // 底图
        this.serverImageryUrl = customConfig.ServerImageryProvider
          ? customConfig.ServerImageryProvider
          : "http://10.34.4.103:8010/ServiceAdapter/MAP/EMAP_DEEPWEB/6f9c5d19634442a3accb406539ef09dc";
        // 点位
        this.pointListApp = customConfig.pointList
          ? _.cloneDeep(customConfig.pointList)
          : [];
      } catch (error) {
        // 模型
        this.providerList = customConfig.imageryProviderList
          ? customConfig.imageryProviderList
          : [];
        // 底图
        this.serverImageryUrl = customConfig.ServerImageryProvider
          ? customConfig.ServerImageryProvider
          : "http://10.34.4.103:8010/ServiceAdapter/MAP/EMAP_DEEPWEB/6f9c5d19634442a3accb406539ef09dc";
        // 点位
        this.pointListApp = customConfig.pointList
          ? _.cloneDeep(customConfig.pointList)
          : [];
      }
      // console.log('底图this.serverImageryUrl', this.serverImageryUrl);
      // console.log('模型this.providerList', this.providerList);
      console.log("点位this.pointListApp", this.pointListApp);
      // 请求底图
      this.initMap();
    },
    // 数据
    initDataSource() {
      let dataCopy = JSON.parse(JSON.stringify(this.dataSource));
      let keys = dataCopy.splice(0, 1)[0],
        values = dataCopy;
      this.POICollection = values.map((x) => {
        let obj = {};
        keys.forEach((y, yIndex) => {
          const value = Number(x[yIndex]);
          obj[y] = isNaN(value) ? x[yIndex] : value;
        });
        return obj;
      });
      // console.log("this.POICollection", this.POICollection);
    },
    //初始化地图
    initMap() {
      var esri = new Cesium.ArcGisMapServerImageryProvider({
        // url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
        url: this.serverImageryUrl,
      });
      this.viewer = new Cesium.Viewer("mMap", {
        imageryProvider: esri, //设置底图
        geocoder: false, //是否显示地名查找控件
        sceneModePicker: false, //是否显示投影方式控件
        navigationHelpButton: false, //是否显示帮助信息控件
        baseLayerPicker: false, //是否显示图层选择控件
        homeButton: false, //是否显示Home按钮
        fullscreenButton: false, //是否显示全屏按钮
        animation: false, //左下角的动画控件的显示
        shouldAnimate: false, //控制模型动画
        timeline: false, //底部的时间轴
        // terrainProvider: Cesium.createWorldTerrain(), //打开深度检测选项
        selectionIndicator: false,
        infoBox: false,
      });
      //定位到指定位置 flyto:会有一个飞行动画 ; setview直接定位
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          114.297826,
          30.528087,
          // 121.4,
          // 31.2,
          2427.9
        ),
        orientation: {
          heading: Cesium.Math.toRadians(357.95), // 航偏角
          pitch: Cesium.Math.toRadians(-27.54), // 仰角
          roll: Cesium.Math.toRadians(0), // 翻滚角
        },
        // destination: Cesium.Cartesian3.fromDegrees(114.28280, 30.54220, 4078.0),
        // orientation: {
        //   heading: Cesium.Math.toRadians(-22.00), // 航偏角
        //   pitch: Cesium.Math.toRadians(332.55), // 仰角
        //   roll: Cesium.Math.toRadians(0), // 翻滚角
        // }
      });
      //去cesium logo水印 或 css
      this.viewer.cesiumWidget.creditContainer.style.display = "none";
      //创建场景
      this.scene = this.viewer.scene;
      // if(!this.scene.pickPositionSupported){
      //   window.alert("此浏览器不支持拾取位置！")
      // }
      this.handler = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);
      window._viewer = this.viewer;
      window.Cesium = Cesium;
      // 加载图层
      if (this.providerList.length > 0) {
        this.Cesium3DTilesetLoad();
      }
      // 生成点位
      if (this.pointListApp.length > 0) {
        this.pointSet();
      }
      // 拾点
      // this.getClickPointAdd(this.viewer);
    },
    // 加载图层
    async Cesium3DTilesetLoad() {
      try {
        this.providerList.forEach((x) => {
          let tileset = new Cesium.Cesium3DTileset({
            url: x.serveUrl,
            maximumScreenSpaceError: 2, //最大的屏幕空间误差
            maximumNumberOfLoadedTiles: 1000, //最大加载瓦片个数
            // shadows: Cesium.ShadowMode.DISABLED,
            // luminanceAtZenith: 1,
            // url: "http://127.0.0.1:5501/tileset.json",
          });
          this.scene.primitives.add(tileset);
          tileset.readyPromise
            .then((tileset) => {
              if (x.color) {
                tileset.style = new Cesium.Cesium3DTileStyle({
                  color: {
                    // conditions: [["true", x.color]]
                    conditions: [["true"]],
                  },
                });
              }
              console.log("加载tileset完成", tileset);
            })
            .catch((error) => {
              console.log("失败tileset", error);
            });
        });
      } catch (error) {
        console.log(error);
      }
      window._viewer = this.viewer;
      window.Cesium = Cesium;
      // let tileset = new Cesium.Cesium3DTileset({
      //   url: "http://127.0.0.1:5501/tileset1.json",
      //   maximumScreenSpaceError: 2,        //最大的屏幕空间误差
      //   maximumNumberOfLoadedTiles: 1000,  //最大加载瓦片个数
      //   shadows: Cesium.ShadowMode.DISABLED,
      //   luminanceAtZenith: 1,
      //   url: "http://10.34.4.103:8010/ServiceAdapter/MAP/HYXZFW3DTILE/6f9c5d19634442a3accb406539ef09dc/tileset.json"
      // });
      // this.scene.primitives.add(tileset);
      // tileset.readyPromise.then((tileset) => {
      //   tileset.style = new Cesium.Cesium3DTileStyle({
      //     color: {
      //       conditions: [
      //         ["true", "rgb(200, 208, 212)"]]
      //     },
      //   });
      //   this.viewer.zoomTo(tileset);
      //   this.viewer.zoomTo(
      //     tileset,
      //     new Cesium.HeadingPitchRange(
      //       0.0,
      //       -0.5,
      //       tileset.boundingSphere.radius / 4.0
      //     )
      //   );
      //   console.log('成功tileset', tileset);
      // }).catch((error) => {
      //   console.log('失败tileset',error);
      // });
    },
    // 清除点位
    clearEntityFromView() {
      this.viewer.entities.removeAll();
      window._viewer = this.viewer;
      window.Cesium = Cesium;
    },
    // 生成点位
    pointSet() {
      // 清除点位
      this.clearEntityFromView();
      let _that = this;
      // console.log("this.pointListApp", this.pointListApp);
      // console.log("this.POICollection", this.POICollection);
      // 图层列表
      this.pointListApp.forEach((item, index) => {
        let imgUrl = item.imgList[0]?.url;
        let { LongitudeKey, LatitudeKey, name } = item;
        // console.log('imgUrl', imgUrl);
        const dataSource = new Cesium.CustomDataSource(name);

        // 分析仪数据
        this.POICollection.forEach((point) => {
          dataSource.entities.add({
            position: Cesium.Cartesian3.fromDegrees(
              point[LongitudeKey],
              point[LatitudeKey],
              10
            ),
            label: {
              text: "为什么出不来",
              font: "20px Microsoft YaHei",
              // 字体颜色
              fillColor: Cesium.Color.fromCssColorString("#ffffff"),
              // 背景颜色
              // backgroundColor: Cesium.Color.fromCssColorString(
              //   "rgba(19,77,177,0.95)"
              // ),
              // 是否显示背景颜色
              showBackground: false,
              // 字体边框
              outline: false,
              // 字体边框颜色
              // outlineColor: Cesium.Color.fromCssColorString("#ffffff"),
              // 字体边框尺寸
              // outlineWidth: 10,
              // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
              // scale: 1.0,
              // 设置样式：FILL：填写标签的文本，但不要勾勒轮廓；OUTLINE：概述标签的文本，但不要填写；FILL_AND_OUTLINE：填写并概述标签文本。
              // style: 0,
              // 相对于坐标的水平位置
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              // 相对于坐标的水平位置
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
              pixelOffset: new Cesium.Cartesian2(10, -40),
              // 是否显示
              show: false,
            },
            billboard: {
              // 图像地址，URI或Canvas的属性
              // image: __webpack_require__("8606")("./".concat(point.type, ".png")),
              // image:
              //   "https://img0.baidu.com/it/u=2223986897,2002289354&fm=253&fmt=auto&app=138&f=JPG?w=500&h=500",
              image: imgUrl,
              // image: green3d,
              // 设置颜色和透明度
              // color:
              //   Cesium.Color.fromCssColorString("#6ab4fff2").withAlpha(1.0),
              // 高度（以像素为单位）
              height: 50,
              // 宽度（以像素为单位）
              width: 40,
              // 大小是否以米为单位
              sizeInMeters: false,
              // 相对于坐标的垂直位置
              verticalOrigin: Cesium.VerticalOrigin.CENTER,
              // 相对于坐标的水平位置
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
              pixelOffset: new Cesium.Cartesian2(0, 0),
              // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
              // scale: 1.0,
              // scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0),
              // 是否显示
              show: true,
            },
            pointIndex: index,
            data: point,
          });
        });

        // 点位聚合
        dataSource.clustering.enabled = true;
        dataSource.clustering.pixelRange = 15;
        dataSource.clustering.minimumClusterSize = 2;

        dataSource.clustering.clusterEvent.addEventListener(function (
          clusteredEntities,
          cluster
        ) {
          const len = clusteredEntities.length;
          cluster.label.show = true;
          cluster.label.pixelOffset = new Cesium.Cartesian2(-10, -8);
          cluster.label.font = "20px Microsoft YaHei";
          cluster.label.eyeOffset = new Cesium.Cartesian3(0, 0, -10);
          cluster.label.disableDepthTestDistance = Number.POSITIVE_INFINITY;
          cluster.label.style = Cesium.LabelStyle.FILL_AND_OUTLINE;
          cluster.label.outlineWidth = 2;
          cluster.label.outlineColor = Cesium.Color.WHITE;

          cluster.billboard.show = true;
          cluster.billboard.width = 48;
          cluster.billboard.height = 72;
          // cluster.billboard.eyeOffset = new Cesium.Cartesian3(0, 0, 1)
          // cluster.billboard.image = _that.combineIconAndLabel(
          //   len >= 50 ? red3d : len >= 10 ? yellow3d : green3d,
          //   clusteredEntities.length
          // );
          if (clusteredEntities.length >= 10) {
            cluster.billboard.image = red3d;
          } else if (clusteredEntities.length >= 5) {
            cluster.billboard.image = yellow3d;
          } else {
            cluster.billboard.image = green3d;
          }
        });

        this.viewer.dataSources.add(dataSource);
        this.checkList.push(name);
      });

      // 点击弹窗
      this.handler.setInputAction(function (event) {
        const pickedLabel = _that.viewer.scene.pick(event.position);
        if (Cesium.defined(pickedLabel)) {
          const ids = pickedLabel.id;
          if (!ids) return;
          let pointIndex = ids._pointIndex || 0;
          let pointData = [{ ...ids._data, _index: 1 }];
          if (ids.length) {
            pointIndex = ids[0]._pointIndex || 0;
            pointData = ids.map((item, index) => {
              return {
                ...item._data,
                _index: index + 1,
              };
            });
          }
          _that.dialogPoint = _that.pointListApp[pointIndex];
          _that.pointData = pointData;
          _that.pointVisible = true;
          console.log("dialogPoint", _that.dialogPoint, pointIndex);
          console.log("pointData", pointData);
          // 点击放大
          // const position = _that.viewer.camera.position;
          // const cameraHeight =
          //   _that.viewer.scene.globe.ellipsoid.cartesianToCartographic(
          //     position
          //   ).height;
          // let moveRate = cameraHeight * 2;
          // _that.viewer.camera.moveForward(moveRate);
          // console.log("moveForward", moveRate, cameraHeight, position);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // 地图缩放
      // this.handler.setInputAction((wheelment) => {
      //   //从Cesium中获取当前地图瓦片等级
      //   let tilesToRender = _that.viewer.scene.globe._surface._tilesToRender;
      //   if (Cesium.defined(tilesToRender)) {
      //     const levels = tilesToRender.map(({ level }) => level);
      //     const level = Math.ceil(_.mean(levels));
      //     console.log("scale", 13 - level + 1, level);
      //     // const {
      //     //   dataSources: { _dataSources },
      //     // } = _that.viewer;
      //     // _dataSources.forEach((dataSource) => {
      //     //   const {
      //     //     clustering: { _cluster },
      //     //   } = dataSource;
      //     //   _cluster.billboard.scale = 13 - level + 1;
      //     //   console.log("scale", 13 - level + 1, level);
      //     // });
      //   }
      // }, Cesium.ScreenSpaceEventType.WHEEL);

      window._viewer = this.viewer;
      window.Cesium = Cesium;
    },

    /**
     * @description: 获取当前鼠标点击位置坐标，并添加到图上显示
     * @param {*} _viewer
     * @return {*}
     */
    // getClickPointAdd(_viewer) {
    //   // 注册屏幕点击事件
    //   // let handler = new Cesium.ScreenSpaceEventHandler(_viewer.scene.canvas);
    //   this.handler.setInputAction(function (event) {
    //     // 转换为不包含地形的笛卡尔坐标
    //     let clickPosition = _viewer.scene.camera.pickEllipsoid(event.position);
    //     // 转经纬度（弧度）坐标
    //     let radiansPos = Cesium.Cartographic.fromCartesian(clickPosition);
    //     // 转角度
    //     console.log(
    //       "经度：" +
    //         Cesium.Math.toDegrees(radiansPos.longitude) +
    //         ", 纬度：" +
    //         Cesium.Math.toDegrees(radiansPos.latitude)
    //     );

    //     // 添加点
    //     _viewer.entities.add({
    //       position: clickPosition,
    //       point: {
    //         color: Cesium.Color.YELLOW,
    //         pixelSize: 30,
    //       },
    //     });
    //   }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    // },
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 == 0 ? "oushu" : "jishu";
    },
    handleSizeChange(val) {
      this.pagesize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    // 图层显隐
    checkListChange(showlist = []) {
      const {
        dataSources: { _dataSources },
      } = this.viewer;
      const statusMap = this.pointListApp.reduce((res, item) => {
        const { name } = item;
        res[name] = showlist.includes(name);
        return res;
      }, {});
      _dataSources.forEach((dataSource) => {
        const { name } = dataSource;
        dataSource.show = statusMap[name];
      });
    },
    combineIconAndLabel(image, label) {
      // if (imgMap[label]) return imgMap[label];
      // 创建画布对象
      let canvas = document.createElement("canvas");
      canvas.width = 48;
      canvas.height = 72;
      let ctx = canvas.getContext("2d");
      const img = document.createElement("img");
      img.src = image;
      ctx.drawImage(img, 0, 0);
      // 渲染字体
      // font属性设置顺序：font-style, font-variant, font-weight, font-size, line-height, font-family
      ctx.fillStyle = Cesium.Color.WHITE.toCssColorString();
      ctx.font = "20px Microsoft YaHei";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, 24, 25);
      // imgMap[label] = canvas;
      return canvas;
    },
  },
  destroyed() {
    //业务代码，不需要记得清除
    // document.head.removeChild(this.styleEle)
    // document.head.removeChild(this.styleEle1)
    // document.head.removeChild(this.styleEle2)
    // document.head.removeChild(this.styleEle3)
  },
};
</script>

<style lang="less">
.point-detail {
  background: transparent;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
    background: url("./images/bg.png") no-repeat;
    background-size: 100% 100%;

    .modalTitle {
      font-size: 29px;
      height: 70px;
      line-height: 70px;
      color: #fff;
      text-align: center;
      margin-bottom: 20px;
    }

    .el-table {
      background-color: transparent;
      border-color: #4286fb;
      margin: 0 20px;
      width: calc(100% - 40px);

      th,
      td {
        font-weight: 300;
        font-size: 23px;
        line-height: 28px;
        color: #fff;
        border-color: #4286fb;
      }

      thead tr {
        background: rgba(13, 82, 168, 0.3);

        th {
          background: transparent;
        }
      }

      tbody {
        td {
          height: 45px;
        }
        tr:hover td.el-table__cell {
          background: rgba(66, 134, 251, 0.1);
        }

        .point-cell {
          width: 100%;
          white-space: nowrap;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .oushu {
        background: transparent;
      }
      .jishu {
        background: rgba(189, 215, 240, 0.1);
      }
    }

    .el-table::before,
    .el-table--border::after {
      background-color: #4286fb;
    }
  }
}
.pagination {
  color: #fff;
  text-align: right;
  margin: 5px 20px 0 0;

  .el-pager li,
  .btn-next {
    background-color: transparent;
  }

  .btn-prev,
  .btn-next,
  button:disabled {
    color: rgb(153, 153, 153);
    background-color: transparent;
  }

  .el-pager li.active {
    color: #fff;
    background: rgb(38, 111, 232);
    border-radius: 4px;
  }
}

.layers {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  width: 100px;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  margin: 10px;
  .el-checkbox__label {
    color: #fff;
  }
}
</style>
