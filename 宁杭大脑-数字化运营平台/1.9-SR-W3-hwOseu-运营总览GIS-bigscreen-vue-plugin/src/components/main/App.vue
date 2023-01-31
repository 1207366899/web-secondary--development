<template>
   <div ref="secondary_bigscreen" :id="id" class="outermast">
      <el-button @click="do_EventCenter_changeEventType({ value: { value: '清障救援', type: 'day' } })">切换事件点</el-button>
      <!-- 地图 -->
      <div id="mapContent" ref="mapContent" @dblclick="clickMap"></div>
      <!-- 图层 -->
      <div class="map_layer">
         <!-- 按钮列表 -->
         <div class="layer_button">
            <div class="button_box" v-for="(item, index) in layerButtonList" :key="index" @click="changeLayerActive(item)">
               <!-- 未选中效果 -->
               <div style="color: #b2fffc" v-if="!item.isActive">{{ item.name }}</div>
               <img src="../../assets/地图按钮默认.png" v-if="!item.isActive" alt="" />
               <!-- 选中效果 -->
               <div style="color: #f8cfab" v-if="item.isActive">{{ item.name }}</div>
               <img src="../../assets/地图按钮选中.png" v-if="item.isActive" alt="" />
            </div>
         </div>
         <!-- 图层列表 -->
         <div class="layer_panel" v-if="layerButtonActive != ''">
            <!-- 图层选择面板 -->
            <el-checkbox-group v-model="layerCheckList" v-if="layerButtonActive != '拥堵情况'">
               <template v-for="(item, index) in layerShowOptionList">
                  <el-checkbox :key="index" :label="item.id" @change="changeLayerCheck(item)">
                     <img v-if="item.name == '服务区'" src="../../assets/服务区.png" alt="" />
                     <img v-if="item.name == '收费站'" src="../../assets/收费站.png" alt="" />
                     <img v-if="item.name == '养护大队'" src="../../assets/养护大队.png" alt="" />
                     <img v-if="item.name == '清障大队'" src="../../assets/清障大队.png" alt="" />
                     <img v-if="item.name == '清障车'" src="../../assets/清障车.png" alt="" />
                     <img v-if="item.name == '危化品车'" src="../../assets/危化品车.png" alt="" />
                     <img v-if="item.name == '警车'" src="../../assets/警车.png" alt="" />
                     <img v-if="item.name == '气象监测点'" src="../../assets/气象监测点.png" alt="" />
                     <img v-if="item.name == '彩云天气'" src="../../assets/彩云天气.png" alt="" />
                     <img v-if="item.name == '视频监控'" src="../../assets/视频监控.png" alt="" />
                     <img v-if="item.name == '情报板'" src="../../assets/情报板.png" alt="" />
                     <div>{{ item.name }}</div>
                  </el-checkbox>
               </template>
            </el-checkbox-group>
            <!-- 图层拥堵情况控制面板 -->
            <div class="layer_traffic" v-if="layerButtonActive == '拥堵情况'">
               <div class="traffic_switch">
                  <el-switch v-model="trafficType" active-color="#169BD5" inactive-color="#8C8C8C" @change="changeTrafficType"></el-switch>
                  <div v-if="!trafficType">隐藏</div>
                  <div v-if="trafficType">显示</div>
               </div>
               <div class="traffic_box">
                  <div class="traffic_img">
                     <img src="../../assets/拥堵情况.png" alt="" />
                  </div>
                  <div class="traffic_type">
                     <div>严重拥堵</div>
                     <div>轻度拥堵</div>
                     <div>畅通</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <!-- 重置地图按钮 -->
      <div class="reset_button" @click="resetMap">
         <img src="../../assets/地图刷新-1.png" alt="" />
      </div>
      <!-- 视频监控 -->
      <div class="map_video" v-if="videoDialogIconIsShow">
         <div @click="videoDialogIsShow = !videoDialogIsShow">
            <img src="../../assets/视频按钮.png" alt="" />
         </div>
         <!-- 监控弹窗 -->
         <div class="video_dialog" v-if="videoDialogIsShow">
            <img src="../../assets/视频bg.png" alt="" />
            <div class="video_tab">
               <el-tabs v-model="activeTabs">
                  <el-tab-pane v-for="(item, index) in videoTabsList" :label="item.name" :name="item.id" :key="index">
                     <video controls :src="item.src"></video>
                  </el-tab-pane>
               </el-tabs>
            </div>
         </div>
      </div>
      <!-- 事件弹窗 -->
      <EventInfoWindow v-if="eventInfoWindowIsShow" class="event_infowindow" ref="event_infowindow" :eventInfoData="eventInfoData"></EventInfoWindow>
      <!-- 雷达图 -->
      <canvas id="canvas" width="200" height="200" style="display: none"></canvas>
   </div>
</template>

<script>
import MsgCompConfig from "./msgCompConfig.js";
import Utils from "@/utils/index.js";
import "./app.less";
// 引入事件弹窗插件
import EventInfoWindow from "./event-infoWindow.vue";

// 引入高德地图
import AMapLoader from "@amap/amap-jsapi-loader";

import { getApi, usePostApi } from "../../api/asset";

// 引入覆盖物区域
import { GS_linePoint, layerAllOption } from "./basics-data";
// 图层面板数据
import { infrastructList, vehicleList, equipmentList } from "./point";
// 事件坐标点数据
import { accidentList, rescueList, junctionList, constructList, alarmList, msgList, blockList, weatherList, controlList, otherList } from "./point";

// 注册高德地图Key
window._AMapSecurityConfig = {
   securityJsCode: "c30d2bf6f8bf8dde01865570d27e2f7f",
};

// 服务区
import serviceAreaDefault from "../../assets/服务区-未选中.png";
import serviceAreaActive from "../../assets/服务区-选中.png";
// 收费站
import tollGateDefault from "../../assets/收费站-未选中.png";
import tollGateActive from "../../assets/收费站-选中.png";
// 养护大队
import curingTeamDefault from "../../assets/养护大队-未选中.png";
import curingTeamActive from "../../assets/养护大队-选中.png";
// 清障大队
import clearTeamDefault from "../../assets/清障大队-未选中.png";
import clearTeamActive from "../../assets/清障大队-选中.png";
// 清障车
import wreckerDefault from "../../assets/清障车-未选中.png";
import wreckerActive from "../../assets/清障车-选中.png";
// 危化品车
import dangerousCarDefault from "../../assets/危化品车-未选中.png";
import dangerousCarActive from "../../assets/危化品车-选中.png";
// 警车
import policeCarDefault from "../../assets/警车-未选中.png";
import policeCarActive from "../../assets/警车-选中.png";
// 气象监测点
import weatherSiteDefault from "../../assets/气象监测点-未选中.png";
import weatherSiteActive from "../../assets/气象监测点-选中.png";
// 彩云天气
import colourWeatherDefault from "../../assets/彩云天气-未选中.png";
import colourWeatherActive from "../../assets/彩云天气-选中.png";
// 视频监控
import videoMonitorDefault from "../../assets/视频监控-未选中.png";
import videoMonitorActive from "../../assets/视频监控-选中.png";
// 情报板
import infoBoardDefault from "../../assets/情报板-未选中.png";
import infoBoardActive from "../../assets/情报板-选中.png";

// 待清障
import toBeCleared from "../../assets/待清障.png";
// 清障中
import clearingAway from "../../assets/清障中.png";
// 已清障
import obstaclesCleared from "../../assets/已清障.png";
// 已结案
import closedCase from "../../assets/已结案.png";

// 交通事故
import trafficAccident from "../../assets/交通事故.png";
// 清障救援
import removalAndRescue from "../../assets/清障救援.png";
// 道口操作
import crossingOperation from "../../assets/道口操作.png";
// 施工作业
import constructionOperation from "../../assets/施工作业.png";
// 信息发布
import infoDelivery from "../../assets/信息发布.png";
// 障碍物
import obstacle from "../../assets/障碍物.png";
// 恶劣天气
import badWeather from "../../assets/恶劣天气.png";
// 大流量管控
import largeFlowControl from "../../assets/大流量管控.png";
// 其他
import other from "../../assets/其他.png";

// 雷达清障车
import radarWrecker from "../../assets/清障车-雷达.png";

// 东
import east from "../../assets/东.png";
// 南
import south from "../../assets/南.png";
// 西
import west from "../../assets/西.png";
// 北
import north from "../../assets/北.png";
// 东南
import southeast from "../../assets/东南.png";
// 东北
import northeast from "../../assets/东北.png";
// 西南
import southwest from "../../assets/西南.png";
// 西北
import northwest from "../../assets/西北.png";
// 湿度
import humidity from "../../assets/湿度.png";
// 晴天
import sunnyDay from "../../assets/晴天.png";
// 多云
import cloudy from "../../assets/多云.png";
// 阴天
import overcast from "../../assets/阴天.png";
// 雨天
import rain from "../../assets/雨天.png";
// 雪天
import snowyDay from "../../assets/雪天.png";
// 雾天
import foggyDay from "../../assets/雾天.png";

export default {
   name: "Main",

   components: {
      EventInfoWindow,
   },

   props: {
      pubSub: Object,
      data: Object | Array,
      componentId: String,
      configuration: Object,
      options: Object,
   },

   data() {
      return {
         id: "",
         // 配置项
         configurationForm: {},
         // 资产Id
         assetId: "",

         // 地图整体实例
         map: null,
         // 高德地图实例
         AMap: null,
         // 当前打开的弹窗
         infoWindow: null,
         // 当前打开的事件弹窗
         eventInfoWindow: null,
         // 当前打开的雷达图
         mapCanvas: null,
         // 当前雷达图坐标点
         radarMarkerList: null,
         // 当前雷达图轨迹
         radarPolyline: null,
         // 当前雷达展示的路径
         mapPolyline: null,
         // 当前聚合点图层
         mapCluster: null,
         // 当前事件聚合点图层
         mapEventCluster: null,

         // 当前默认展示的高速路径覆盖物
         mapDefaultLine: [],
         // 当前拥堵情况覆盖物
         mapNormalLine: [],
         mapWarningLine: [],
         mapDangerLine: [],

         // 图层按钮列表
         layerButtonList: [
            {
               name: "基础设施",
               isActive: false,
               type: "infrastructure",
            },
            {
               name: "车辆",
               isActive: false,
               type: "car",
            },
            {
               name: "天气",
               isActive: false,
               type: "weather",
            },
            {
               name: "拥堵情况",
               isActive: false,
               type: "traffic",
            },
            {
               name: "机电设备",
               isActive: false,
               type: "infoboard",
            },
         ],
         // 当前选中的图层按钮
         layerButtonActive: "",
         // 图层面板所有选项列表
         layerAllOptionList: layerAllOption,
         // 图层面板展示选项列表
         layerShowOptionList: [],
         // 图层面板选中列表
         layerCheckList: [],
         // 储存图层面板数据
         layerAllData: {},
         // 图层拥堵情况状态
         trafficType: false,
         // 拥堵情况图层
         trafficLayer: null,

         // 当前选中的坐标点
         markerActive: null,
         // 当前选中tabs
         activeTabs: "",
         // 监控视频列表
         videoTabsList: [],
         // 监控视频图标是否展示
         videoDialogIconIsShow: false,
         // 监控视频是否展示
         videoDialogIsShow: false,

         // 事件弹窗
         eventInfoWindowIsShow: false,
         // 事件弹窗数据
         eventInfoData: {},
         // 事件点数据
         eventAllData: {},

         // 情报板标记点
         infoBoardMarkerList: [],
         // 视频监控标记点
         infoVideoMarkerList: [],

         // 接口数组
         apiList: [],

         // 彩云天气图片
         imageLayerr: null,
      };
   },

   mounted() {
      this.pubSub && this.pubSub.subscribe("updateChart" + this.componentId, (data) => {});
      window.componentCenter?.register && window.componentCenter.register(this.componentId, "comp", this, MsgCompConfig);
      this.updateProcess && this.updateProcess();
      let id = this.options?.externalVariables?.id;
      this.id = id ? `secondary_analyzer_${id}` : `secondary_bigscreen_${Utils.generateUUID()}`;

      this.configurationForm = JSON.parse(JSON.stringify(this.configuration));
      this.assetId = this.configuration.assetId;

      // 获取所有接口参数
      this.getAllApi();

      // 挂载通知清障函数
      window.noticeObstacles = this.noticeObstacles;
   },

   methods: {
      // 获取服务编排
      getAllApi() {
         getApi().then((res) => {
            // console.log(JSON.parse(JSON.stringify(res.data)));
            // 储存所有数据接口
            this.apiList = res.data;

            // 初始化生成地图
            this.initMap();
         });
      },

      // 加载地图
      initMap() {
         // 销毁地图
         this.map && this.map.destroy();
         //创建地图
         AMapLoader.load({
            key: "b741d392ac4e4f5ddd22309030672f63",
            version: "2.0",
            plugins: ["AMap.DistrictSearch", "AMap.Driving", "AMap.IndexCluster"],
         }).then((AMap) => {
            let map = new AMap.Map("mapContent", {
               // 地图中心点
               center: [119.27, 31.56],
               // 设置地图的显示样式
               mapStyle: "amap://styles/1300784950b9ec4ea6a6cab8dd883c52",
               // 地图缩放级别
               zoom: 10,
               // 地图缩放范围
               zooms: [7, 15],
               //不显示地图文字标记
               showLabel: false,
            });

            // 储存地图实例
            this.map = map;
            this.AMap = AMap;

            // 生成区域覆盖物 南京、宜兴、溧阳
            let polygonArea = ["南京", "宜兴", "溧阳"];
            polygonArea.forEach((item) => {
               new AMap.DistrictSearch({ extensions: "all", subdistrict: 0 }).search(item, function (status, result) {
                  let outer = [new AMap.LngLat(-360, 90, true), new AMap.LngLat(-360, -90, true), new AMap.LngLat(360, -90, true), new AMap.LngLat(360, 90, true)];
                  let holes = result.districtList[0].boundaries;
                  let pathArray = [outer];
                  pathArray.push.apply(pathArray, holes);
                  let polygon = new AMap.Polygon({
                     pathL: pathArray,
                     // 覆盖物边框颜色
                     strokeColor: "#4BB6EB",
                     // 覆盖物边框宽度
                     strokeWeight: 3,
                     // 覆盖物颜色
                     fillColor: "",
                     // 覆盖物透明度
                     fillOpacity: 1,
                  });
                  polygon.setPath(pathArray);
                  map.add(polygon);
               });
            });

            // 生成路线覆盖物;
            this.createLinePolygon(AMap, GS_linePoint.normal, "area");

            // 渲染坐标点
            this.handleLayerPanelData(AMap);

            // 渲染事件坐标点
            this.handleEventData("交通事故", "day");
         });
      },

      // 点击地图
      clickMap() {
         // 关闭坐标点信息弹窗
         if (this.infoWindow) {
            this.infoWindow.close();
         }
         // 关闭坐标点激活状态
         if (this.markerActive) {
            let markerActive = this.markerActive.target;
            markerActive.setIcon(this.getIconImg("", markerActive.getExtData().levelB, false));
            this.markerActive = null;
         }
         // 关闭图层弹窗
         if (this.layerButtonActive) {
            // 修改所有按钮状态
            this.layerButtonList.forEach((item) => {
               if (item.name == this.layerButtonActive.name) {
                  if (item.isActive) {
                     this.layerButtonActive = "";
                  }
                  item.isActive = !item.isActive;
               } else {
                  item.isActive = false;
               }
            });
            // 取消激活状态
            this.layerButtonActive = "";
         }
         // 关闭事件弹窗
         if (this.eventInfoWindowIsShow) {
            this.eventInfoWindowIsShow = false;
            this.eventInfoWindow = null;
         }
         // 关闭打开的监控
         if (this.videoDialogIsShow) {
            this.videoDialogIsShow = false;
            this.videoTabsList = [];
            this.activeTabs = "";
         }
         // 关闭情报板坐标点
         if (this.infoBoardMarkerList.length) {
            this.infoBoardMarkerList.forEach((item) => {
               this.map.remove(item);
            });
            this.infoBoardMarkerList = [];
         }
         // 关闭视频监控坐标点
         if (this.infoVideoMarkerList.length) {
            this.infoVideoMarkerList.forEach((item) => {
               this.map.remove(item);
            });
            this.infoVideoMarkerList = [];
         }
         // 关闭雷达图轨迹
         if (this.radarPolyline) {
            this.map.remove(this.radarPolyline);
         }
         // 开启地图缩放
         this.map.setStatus({ zoomEnable: true });
         // 清空雷达图
         this.clearRadarAll();
      },

      // 处理图层面板数据
      async handleLayerPanelData() {
         // 图层面板默认选中
         this.layerCheckList = [1, 2, 3, 4, 11, 12];
         // 渲染视频监控图标;
         this.videoDialogIconIsShow = true;

         // 基础设施
         let infrastructData = [];
         let infrastructApi = this.getApiData("infrastruct_list");

         // 获取接口数据
         await usePostApi(infrastructApi.value).then((res) => {
            infrastructData = res.data.res.data;
            // infrastructData = infrastructList;

            // 添加聚合点条件
            infrastructData.serviceList.forEach((item) => {
               item.levelA = "基础设施";
               item.levelB = "服务区";
            });
            infrastructData.stationList.forEach((item) => {
               item.levelA = "基础设施";
               item.levelB = "收费站";
            });
            infrastructData.maintainList.forEach((item) => {
               item.levelA = "基础设施";
               item.levelB = "养护大队";
            });
            infrastructData.clearList.forEach((item) => {
               item.levelA = "基础设施";
               item.levelB = "清障大队";
            });
            infrastructData.weatherStationList.forEach((item) => {
               item.levelA = "基础设施";
               item.levelB = "气象监测点";
            });
         });

         // 机电设备
         let equipmentData = [];
         let equipmentApi = this.getApiData("equipment_list");
         await usePostApi(equipmentApi.value).then((res) => {
            // console.log("机电设备---->", res);
            if (!res.data) {
               return;
            }
            equipmentData = res.data.res.data;
            // 添加聚合点条件
            equipmentData.screenList.forEach((item) => {
               item.levelA = "机电设备";
               item.levelB = "情报板";
            });
            equipmentData.videoList.forEach((item) => {
               item.levelA = "机电设备";
               item.levelB = "视频监控";
            });
         });
         // 合并数据
         this.layerAllData = await {
            ...infrastructData,
            ...equipmentData,
         };
         // 生成标记点
         await this.createClusterMarker(this.layerAllData);
      },

      // 创建坐标点
      createMarker(context) {
         context.clusterData.forEach((item) => {
            // 设置图标
            context.marker.setIcon(this.getIconImg(this.AMap, item.levelB, false));
            // 设置偏移位置
            context.marker.setOffset(new AMap.Pixel(-13, -30));
            // 设置数据
            context.marker.setExtData(item);
            // 添加点击事件
            context.marker.on("click", this.replaceMarkerIcon);
         });
      },

      // 点击坐标点
      async replaceMarkerIcon(e) {
         // 获取坐标点自带参数
         let point = e.target.getExtData();
         // 判断是否存在激活过的坐标点
         if (this.markerActive) {
            let markerActive = this.markerActive.target;
            // 相同坐标点取消选中
            if (markerActive.getExtData().id == point.id) {
               markerActive.setIcon(this.getIconImg("", markerActive.getExtData().levelB, false));
               this.markerActive = null;
               // 关闭信息弹窗窗口
               if (this.infoWindow) {
                  this.infoWindow.close();
               }
               return;
            }
            markerActive.setIcon(this.getIconImg("", markerActive.getExtData().levelB, false));
            this.markerActive = e;
         } else {
            this.markerActive = e;
         }
         // 清空之前的弹窗
         if (this.infoWindow) {
            this.infoWindow.close();
            this.infoWindow = null;
         }
         // 移除打开的监控
         if (this.videoDialogIsShow) {
            this.videoDialogIsShow = false;
            this.videoTabsList = [];
            this.activeTabs = "";
         }

         // 替换激活图标
         e.target.setIcon(this.getIconImg("", point.levelB, true));

         let dataFrom = { param: { id: point.id } };

         // 创建弹窗
         let infoWindow = new AMap.InfoWindow({ anchor: "top-left", isCustom: true, offset: new AMap.Pixel(25, 0) });
         // 根据不同状态生成弹窗内容
         if (point.levelB == "服务区" || point.levelB == "收费站") {
            // 接口数据
            let pointData = [];
            // 服务区详情
            if (point.levelB == "服务区") {
               let detailsApi = this.getApiData("infrastruct_serviceDetail");
               await usePostApi(detailsApi.value, dataFrom).then((res) => {
                  pointData = res.data.res.data.serviceDetail;
               });
            }
            // 收费站详情
            if (point.levelB == "收费站") {
               let detailsApi = this.getApiData("infrastruct_stationDetail");
               await usePostApi(detailsApi.value, dataFrom).then((res) => {
                  pointData = res.data.res.data.stationDetail;
               });
            }
            // 生成内容
            e.target.content = await `<div class="map_infoWindow">
                  <div class="infoWindow_title">${pointData.name || ""}</div>
                  <div class="infoWindow_line"></div>
                  <div class="infoWindow_info">
                     ${point.levelB == "服务区" ? `<div class="info_title">今日收费额</div>` : `<div class="info_title">今日累计营业额</div>`}
                     <div class="info_money">
                        ${this.getMoneyDiv(pointData.amount)}
                        <div class="money_yuan">元</div>
                     </div>
                     <div class="info_proportion">
                        ${pointData.basisRate || pointData.basisRate == 0 ? `<div>同比 <span style="color: #ff6666">▲ ${pointData.basisRate || 0}</span></div>` : ""}
                        ${pointData.roundRate || pointData.roundRate == 0 ? `<div>环比 <span style="color: #15f6ee">▼ ${pointData.roundRate || 0}</span></div>` : ""}
                     </div>
                     <div class="info_infrastructure">
                        <div>
                           ${point.levelB == "服务区" ? `<div>小时累计断面总流量</div>` : `<div>小时累计出口车流量</div>`}
                           ${point.levelB == "服务区" ? `<div>${pointData.totalNum || 0} 辆</div>` : `<div>${pointData.outNum || 0} 辆</div>`}
                        </div>
                        <div>
                           ${point.levelB == "服务区" ? `<div>小时累计入区总流量</div>` : `<div>小时累计入口车流量</div>`}
                           <div>${pointData.inNum || 0} 辆</div>
                        </div>
                     </div>
                  </div>
               </div>`;
         }
         if (point.levelB == "清障大队") {
            // 获取Api接口
            let detailsApi = this.getApiData("infrastruct_clearDetail");
            // 清障大队详情
            await usePostApi(detailsApi.value, dataFrom).then((res) => {
               let pointData = res.data.res.data.clearDetail;
               // 生成内容
               e.target.content = `<div class="map_infoWindow">
                  <div class="infoWindow_title">${pointData.name}</div>
                  <div class="infoWindow_line"></div>
                  <div class="info_clearTeam">
                     <div>
                        <div>清障员：${pointData.person || 0}人</div>
                        <div>值班：${pointData.dutyPerson || 0}人</div>
                     </div>

                     <div>
                        <div>清障车：${pointData.vehicle || 0}人</div>
                        <div>可用：${pointData.availableVehicle || 0}辆</div>
                     </div>
                  </div>
               </div>`;
            });
         }
         if (point.levelB == "养护大队" || point.levelB == "危化品车" || point.levelB == "警车") {
            // 接口数据
            let pointData = [];
            // 养护大队详情
            if (point.levelB == "养护大队") {
               let detailsApi = this.getApiData("infrastruct_maintainDetail");
               await usePostApi(detailsApi.value, dataFrom).then((res) => {
                  pointData = res.data.res.data.maintainDetail;
               });
            }
            // 危化品车详情
            if (point.levelB == "危化品车") {
               let detailsApi = this.getApiData("danger_detail");
               await usePostApi(detailsApi.value, dataFrom).then((res) => {
                  pointData = res.data.res.data.dangerDetail;
               });
            }
            // 警车详情
            if (point.levelB == "警车") {
               let detailsApi = this.getApiData("warn_detail");
               await usePostApi(detailsApi.value, dataFrom).then((res) => {
                  // pointData = res.data.res.data.warnDetail;
                  pointData = { plateNum: "苏A·22222" };
               });
            }
            // 生成内容
            e.target.content = await `<div class="map_infoWindow">
               <div class="infoWindow_title">${point.levelB == "养护大队" || point.levelB == "视频监控" ? pointData.name : pointData.plateNum}</div>
               <div class="infoWindow_line"></div>
            </div>`;
         }
         if (point.levelB == "清障车") {
            // 获取Api接口
            let detailsApi = this.getApiData("clear_detail");
            // 清障大队详情
            await usePostApi(detailsApi.value, dataFrom).then((res) => {
               // let pointData = res.data.res.data;
               // 接口数据
               let pointData = {
                  id: "101",
                  plateNum: "苏A·00000",
                  person: "张三",
                  contact: "13776311841",
                  status: "0",
                  arrivalTime: 30,
               };
               // 生成内容
               e.target.content = `<div class="map_infoWindow">
                  <div class="infoWindow_title">${pointData.plateNum}</div>
                  <div class="infoWindow_line"></div>
                  <div class="info_car">
                     <div>${pointData.person}：${pointData.contact}</div>
                     <div>状态：
                     ${
                        pointData.status == 0
                           ? `<span style="color: #95F204">可用</span>`
                           : pointData.status == 1
                           ? `<span style="color: #95F204">任务中</span>`
                           : `<span style="color: #95F204">不可用</span>`
                     }
                     </div>
                     <div>预计到达时间：${pointData.arrivalTime}分钟</div>
                  </div>
               </div>`;
            });
         }
         if (point.levelB == "气象监测点") {
            // 获取Api接口
            let detailsApi = this.getApiData("weatherStation_detail");
            await usePostApi(detailsApi.value).then((res) => {
               // let pointData = res.data.res.data;
               // 接口数据
               let pointData = {
                  id: "101",
                  stationName: "站点名称",
                  temp: "22",
                  baseTemp: "23",
                  surfaceTemp: "18",
                  rain: "3000",
                  visibility: "10000M",
                  humidity: "69.00",
                  windDirection: "西北",
                  windSpeed: "12",
                  windDirectionAngle: "45",
               };
               // 生成内容
               e.target.content = `<div class="map_infoWindow" style="width: 350px">
                  <div class="infoWindow_title">${pointData.stationName}</div>
                  <div class="infoWindow_line"></div>
                  <div class="info_weather">
                     <div class="weather_top">
                        <div class="weather_box1">
                           <div>${pointData.stationName}</div>
                           <img src="${northwest}" />
                           <div class="wind_info">
                              <div>${pointData.windDirection}风</div>
                              <div>${pointData.windSpeed}M/S</div>
                           </div>
                        </div>
                        <div class="weather_box2">
                           <div>能见度 ${pointData.visibility}M</div>
                           <img src="${foggyDay}" />
                           <div>总量：${pointData.rain}mm</div>
                        </div>
                     </div>
                     <div class="weather_bottom">
                        <div class="bottom_first">
                           <div>
                              <img src="${humidity}" />
                              <div>${pointData.humidity}</div>
                           </div>
                           <div>${pointData.temp}℃</div>
                        </div>
                        <div class="bottom_second">
                           <div>路面</div>
                           <div>${pointData.surfaceTemp}℃</div>
                        </div>
                        <div class="bottom_third">
                           <div>路基</div>
                           <div>${pointData.surfaceTemp}℃</div>
                        </div>
                     </div>
                  </div>
               </div>`;
            });
         }
         if (point.levelB == "情报板") {
            let detailsApi = this.getApiData("report_info");
            // 情报板详情
            await usePostApi(detailsApi.value, dataFrom).then((res) => {
               // let pointData = res.data.res.data;
               // 获取Api接口
               // 接口数据
               let pointData = {
                  id: "101",
                  name: "情报板名称",
                  content: "情报板内容情报板内容情报板内容",
               };
               // 生成内容
               e.target.content = `<div class="map_infoWindow" style="width: 350px">
                  <div class="infoWindow_title">${pointData.name}</div>
                  <div class="infoWindow_line"></div>
                  <div class="info_video">${pointData.content}</div>
               </div>`;
            });
         }
         // 获取视频源
         if (point.levelB == "视频监控") {
            let videoUrlApi = this.getApiData("video_src\t");
            await usePostApi(videoUrlApi.value, dataFrom).then((res) => {
               let videoData = res.data.res.data;
               this.videoTabsList.push(videoData[0]);
               // 生成内容
               e.target.content = `<div class="map_infoWindow">
                  <div class="infoWindow_title">${videoData[0].name}</div>
                  <div class="infoWindow_line"></div>
               </div>`;

               this.activeTabs = videoData[0].id;
               this.videoDialogIsShow = true;
            });
         }

         // 储存当前弹窗
         this.infoWindow = infoWindow;
         // 渲染弹窗
         await infoWindow.setContent(e.target.content);
         await infoWindow.open(this.map, e.target.getPosition());
         // 关闭地图缩放
         this.map.setStatus({ zoomEnable: false });
      },

      // 处理事件数据
      async handleEventData(type, eventType) {
         // 清除上一次渲染事件点
         if (this.mapEventCluster) {
            this.mapEventCluster.setMap(null);
         }

         // 储存其他事件点
         let otherData = [];

         // 交通事故
         if (type == "交通事故") {
            let accidentApi = this.getApiData("accident_list");
            await usePostApi(accidentApi.value, { param: { type: eventType } }).then((res) => {
               otherData = res.data.res.data;
               console.log("交通事故---->", otherData);
               otherData.list.forEach((item) => {
                  item.levelA = "事件";
                  item.levelB = "交通事故";
               });
            });
         }

         // 清障救援
         if (type == "清障救援") {
            let rescueApi = this.getApiData("rescue_list");
            await usePostApi(rescueApi.value, { param: { type: eventType } }).then((res) => {
               console.log("清障救援---->", res);
               otherData = res.data.res.data;
               // otherData = rescueList;
               otherData.list.forEach((item) => {
                  item.levelA = "事件";
                  item.levelB = "清障救援";
               });
            });
         }

         // 道口操作
         if (type == "道口操作") {
            let junctionApi = this.getApiData("junction_list");
            await usePostApi(junctionApi.value, { param: { type: eventType } }).then((res) => {
               otherData = res.data.res.data;
               console.log("道口操作---->", otherData);
               otherData.list.forEach((item) => {
                  item.levelA = "事件";
                  item.levelB = "道口操作";
               });
            });
         }

         // 施工作业
         if (type == "施工作业") {
            let constructApi = this.getApiData("construct_list");
            await usePostApi(constructApi.value, { param: { type: eventType } }).then((res) => {
               otherData = res.data.res.data;
               console.log("施工作业---->", otherData);
               // otherData = constructList;
               otherData.list.forEach((item) => {
                  item.levelA = "事件";
                  item.levelB = "施工作业";
               });
            });
         }

         // 信息发布
         if (type == "信息发布") {
            let msgApi = this.getApiData("msg_list");
            await usePostApi(msgApi.value, { param: { type: eventType } }).then((res) => {
               otherData = res.data.res.data;
               console.log("信息发布---->", otherData);
               // otherData = msgList;
               otherData.list.forEach((item) => {
                  item.levelA = "事件";
                  item.levelB = "信息发布";
               });
            });
         }

         // 障碍物
         if (type == "障碍物") {
            let blockApi = this.getApiData("block_list");
            await usePostApi(blockApi.value, { param: { type: eventType } }).then((res) => {
               otherData = res.data.res.data;
               console.log("障碍物---->", otherData);
               // otherData = blockList;
               otherData.list.forEach((item) => {
                  item.levelA = "事件";
                  item.levelB = "障碍物";
               });
            });
         }

         // 恶劣天气
         if (type == "恶劣天气") {
            let weatherApi = this.getApiData("weather_list");
            await usePostApi(weatherApi.value, { param: { type: eventType } }).then((res) => {
               otherData = res.data.res.data;
               console.log("恶劣天气---->", otherData);
               // otherData = weatherList;
               otherData.list.forEach((item) => {
                  item.levelA = "事件";
                  item.levelB = "恶劣天气";
               });
            });
         }

         // 大流量管控
         if (type == "大流量管控") {
            let controlApi = this.getApiData("control_list");
            await usePostApi(controlApi.value, { param: { type: eventType } }).then((res) => {
               otherData = res.data.res.data;
               console.log("大流量管控---->", otherData);
               // otherData = controlList;
               otherData.list.forEach((item) => {
                  item.levelA = "事件";
                  item.levelB = "大流量管控";
               });
            });
         }

         // 其他
         if (type == "其他") {
            let otherApi = this.getApiData("other_list");
            await usePostApi(otherApi.value, { param: { type: eventType } }).then((res) => {
               otherData = res.data.res.data;
               console.log("其他---->", otherData);
               // otherData = otherList;
               otherData.list.forEach((item) => {
                  item.levelA = "事件";
                  item.levelB = "其他";
               });
            });
         }

         // 判断是否渲染两个事件
         this.eventAllData = [...otherData.list];

         await this.creatEventClusterMarker(this.eventAllData);
      },

      // 创建事件坐标点
      async createEventMarker(context) {
         context.clusterData.forEach((item) => {
            let baseIcon = null;
            let innerIcon = null;
            let typeName = item.state;

            // 动态切换中心图标
            switch (item.levelB) {
               case "交通事故":
                  innerIcon = trafficAccident;
                  break;
               case "清障救援":
                  innerIcon = removalAndRescue;
                  break;
               case "道口操作":
                  baseIcon = crossingOperation;
                  break;
               case "施工作业":
                  innerIcon = constructionOperation;
                  break;
               case "信息发布":
                  innerIcon = infoDelivery;
                  baseIcon = toBeCleared;
                  break;
               case "障碍物":
                  innerIcon = obstacle;
                  break;
               case "恶劣天气":
                  innerIcon = badWeather;
                  break;
               case "大流量管控":
                  innerIcon = largeFlowControl;
                  break;
               case "其他":
                  innerIcon = other;
                  break;
            }
            if (item.state == "未结案" || item.state == "待清障" || item.state == "创建") {
               baseIcon = toBeCleared;
            }
            if (item.state == "已出发" || item.state == "已到达" || item.state == "施救中" || item.state == "到达" || item.state == "施工开始") {
               baseIcon = clearingAway;
            }
            if (item.state == "已离场" || item.state == "已解脱" || item.state == "施工结束") {
               baseIcon = obstaclesCleared;
            }
            if (item.state == "已结案" || item.state == "结案") {
               baseIcon = closedCase;
            }
            // 设置标记点内容
            context.marker.setContent(`<div class="evevnt_icon_box">
               ${item.levelB != "道口操作" ? `<img class="box_baseIcon" src="${baseIcon}" />` : `<img class="box_cross" src="${baseIcon}" />`}
               ${item.levelB != "道口操作" ? `<img class="box_innerIcon" src="${innerIcon}" />` : ""}
               ${item.levelB != "道口操作" ? `<div class="box_text" >${typeName}</div>` : ""}
            </div>`);
            // 设置数据
            context.marker.setExtData(item);
            // 设置点位偏移
            context.marker.setOffset(new AMap.Pixel(-38, -118));
            // 设置点击事件
            context.marker.on("click", this.replaceEventMarkerIcon);
         });
      },

      // 点击事件坐标点
      async replaceEventMarkerIcon(e) {
         let point = e.target.getExtData();

         // 移除雷达图
         if (this.mapCanvas) {
            this.clearRadarAll();
         }
         // 关闭雷达图轨迹
         if (this.radarPolyline) {
            this.map.remove(this.radarPolyline);
         }
         // 清空之前的弹窗
         if (this.eventInfoWindow) {
            this.eventInfoWindowIsShow = false;
            this.eventInfoWindow = null;
         }
         // 关闭情报板坐标点
         if (this.infoBoardMarkerList.length) {
            this.infoBoardMarkerList.forEach((item) => {
               this.map.remove(item);
            });
            this.infoBoardMarkerList = [];
         }
         // 移除打开的监控和坐标点
         if (this.videoDialogIsShow) {
            this.infoVideoMarkerList.forEach((item) => {
               this.map.remove(item);
            });
            this.infoVideoMarkerList = [];

            this.videoDialogIsShow = false;
            this.videoTabsList = [];
            this.activeTabs = "";
         }

         // 储存详情数据
         let pointData = {};
         // 储存接口字段
         let detailsField = "";
         switch (point.levelB) {
            case "交通事故":
               detailsField = "accident_info";
               break;
            case "清障救援":
               detailsField = "rescue_info";
               break;
            case "道口操作":
               detailsField = "junction_msgBoard";
               break;
            case "施工作业":
               detailsField = "construct_info";
               break;
            case "信息发布":
               detailsField = "msg_info";
               break;
            case "障碍物":
               detailsField = "block_info";
               break;
            case "恶劣天气":
               detailsField = "weather_info";
               break;
            case "大流量管控":
               detailsField = "control_info";
               break;
            case "其他":
               detailsField = "other_info";
               break;
         }
         // 获取Api接口
         let detailsApi = await this.getApiData(detailsField);

         // 获取详情数据
         await usePostApi(detailsApi.value, { param: { id: point.id } }).then((res) => {
            pointData = res.data.res.data;
            if (point.levelB == "交通事故") {
               pointData.name = "交通事故";
            } else if (point.levelB == "清障救援") {
               pointData.longitude = point.longitude;
               pointData.latitude = point.latitude;
               pointData.name = "清障救援";
            } else if (point.levelB == "道口操作") {
               pointData.name = "道口操作";
            } else if (point.levelB == "施工作业") {
               pointData.name = "施工作业";
            } else if (point.levelB == "信息发布") {
               pointData.name = "信息发布";
            } else if (point.levelB == "障碍物") {
               pointData.name = "障碍物";
            } else if (point.levelB == "恶劣天气") {
               pointData.name = "恶劣天气";
            } else if (point.levelB == "大流量管控") {
               pointData.name = "大流量管控";
            } else if (point.levelB == "其他") {
               pointData.name = "其他";
            }
         });
         // 判断图标
         if (point.state == "未结案" || point.state == "到达" || point.state == "施工开始") {
            pointData.videoIcon = 1;
         }
         if (point.state == "已结案" || point.state == "创建" || point.state == "施工结束" || point.state == "结案") {
            pointData.videoIcon = 2;
         }
         if (point.state == "待清障" || point.state == "已出发") {
            pointData.videoIcon = 1;
            pointData.wreckerIcon = 1;
         }
         if (point.state == "已到达" || point.state == "施救中") {
            pointData.videoIcon = 1;
            pointData.wreckerIcon = 2;
         }
         if (point.state == "已离场" || point.state == "已解脱") {
            pointData.videoIcon = 2;
            pointData.wreckerIcon = 2;
         }

         if (point.levelB != "信息发布") {
            pointData.infoboardIcon = 1;
         }
         pointData.id = point.id;

         // 赋值事件弹窗数据
         this.eventInfoData = pointData;

         setTimeout(() => {
            this.eventInfoWindowIsShow = true;
            this.$nextTick(() => {
               // 创建弹窗
               let infoWindow = new AMap.InfoWindow({
                  anchor: "top-left",
                  isCustom: true,
                  offset: new AMap.Pixel(35, -55),
                  content: this.$refs["event_infowindow"].$el,
               });
               // 保存事件弹窗
               this.eventInfoWindow = infoWindow;
               // 渲染弹窗
               infoWindow.open(this.map, e.target.getPosition());
               // 关闭地图缩放
               this.map.setStatus({ zoomEnable: false });
            });
         }, 10);
      },

      // 创建路线覆盖物
      createLinePolygon(amap, data, type, color, borderColor) {
         // 创建高德地图实例
         let AMap = amap || this.AMap;
         // 生成路线坐标点
         data.forEach((item) => {
            let linePath = [];
            item.point.forEach((e) => {
               linePath.push(new AMap.LngLat(e[0], e[1]));
            });
            // 创建路线覆盖物
            let linePolygon = new AMap.Polyline({
               path: linePath,
               strokeWeight: 6,
               strokeColor: color || "#4B732F",
               strokeOpacity: 1,
               isOutline: true,
               borderWeight: 3,
               outlineColor: borderColor || "#62BEA8",
            });

            if (type == "area") {
               this.mapDefaultLine.push(linePolygon);
            } else if (type == "normal") {
               this.mapNormalLine.push(linePolygon);
            } else if (type == "warning") {
               this.mapWarningLine.push(linePolygon);
            } else if (type == "danger") {
               this.mapDangerLine.push(linePolygon);
            }
            // 在地图上添加路线
            this.map.add([linePolygon]);
         });
      },

      // 创建地图Canvas
      createMapCanvas(pointData, markData) {
         // 移除之前的Canvas
         if (this.mapCanvas) {
            this.clearRadarAll();
            return;
         }
         // 移除打开的监控和坐标点
         if (this.videoDialogIsShow) {
            this.infoVideoMarkerList.forEach((item) => {
               this.map.remove(item);
            });
            this.infoVideoMarkerList = [];

            this.videoDialogIsShow = false;
            this.videoTabsList = [];
            this.activeTabs = "";
         }
         // 关闭情报板坐标点
         if (this.infoBoardMarkerList.length) {
            this.infoBoardMarkerList.forEach((item) => {
               this.map.remove(item);
            });
            this.infoBoardMarkerList = [];
         }
         // 关闭情报板
         this.$refs["event_infowindow"].coloseInfoWindow();

         // 获取20Kkm经纬度
         let radarPoint = this.calculateLl(pointData.longitude, pointData.latitude, 10000);

         // 添加地图Canvas
         const CanvasLayer = new AMap.CanvasLayer({
            canvas: document.getElementById("canvas"),
            bounds: new AMap.Bounds(radarPoint[0], radarPoint[1]),
         });

         // 储存绘制的Canvas
         this.mapCanvas = CanvasLayer;

         // 将图层加载到地图
         this.map.addLayer(CanvasLayer);

         // 创建Canvas
         this.$nextTick(() => {
            this.initMyCanvas("canvas").scan();
            // 关闭事件弹窗
            this.eventInfoWindowIsShow = false;
            // 开启地图缩放
            this.map.setStatus({ zoomEnable: true });
         });
         // 添加雷达图内的坐标点
         this.addRadarWreckerPoint(markData);
      },

      // 计算雷达直径经纬度
      calculateLl(centerLongitude, centerLatitude, metre) {
         // 地球周长
         let perimeter = 2 * Math.PI * 6371000;
         // 纬度latitude的地球周长
         let perimeter_latitude = perimeter * Math.cos((Math.PI * centerLatitude) / 180);
         // 一米对应的经度（东西方向）
         let longitude_per_mi = 360 / perimeter_latitude;
         let latitude_per_mi = 360 / perimeter;
         // 左经度
         let leftLo = Number(centerLongitude) - metre * longitude_per_mi;
         // 右纬度
         let rightLo = Number(centerLongitude) + metre * longitude_per_mi;
         // 上纬度
         let topLa = Number(centerLatitude) + metre * latitude_per_mi;
         // 下纬度
         let bottomLa = Number(centerLatitude) - metre * latitude_per_mi;

         return [
            [leftLo, topLa],
            [rightLo, bottomLa],
         ];
      },

      // 绘制Canvas雷达
      initMyCanvas(canvas) {
         const c = document.getElementById(canvas);
         let animID = null;

         const ctx = c.getContext("2d");

         // 画布的宽高
         const cWidth = c.width;
         const cHeight = c.height;
         // 中心点
         const centerX = c.width / 2;
         const centerY = c.height / 2;
         // 半径
         const radius = centerX * 0.9;

         const drawCircle = function (r, lineWidth = 1, color = "#090") {
            ctx.beginPath();
            ctx.setLineDash([]);
            ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = color;
            ctx.stroke();
         };

         const drawSector = function (sAngle, eAngle) {
            let blob = 50;
            let increase = 0;

            if (sAngle < eAngle) {
               increase = (eAngle - sAngle) / blob;
            } else if (sAngle > eAngle) {
               increase = (Math.PI * 2 - sAngle + eAngle) / blob;
            } else {
               return;
            }

            let angle1 = sAngle;
            let angle2 = sAngle + increase;
            for (let i = 0; i < blob; i++) {
               ctx.beginPath();
               ctx.moveTo(centerX, centerY);
               ctx.arc(centerX, centerY, radius, angle1, angle2);
               ctx.fillStyle = "rgba(42,195,39," + i / blob + ")";
               ctx.fill();
               angle1 = angle2;
               angle2 = angle1 + increase;
               if (angle2 >= Math.PI * 2) {
                  ctx.beginPath();
                  ctx.moveTo(centerX, centerY);
                  ctx.arc(centerX, centerY, radius, angle1, Math.PI * 2);
                  ctx.fillStyle = "rgba(42,195,39," + i / blob + ")";
                  ctx.fill();
                  angle1 = 0;
                  angle2 = angle1 + increase;
               }
            }
         };

         const Line = function (x, y, lineDash = [], color = "#396a00", lineWidth = 1) {
            ctx.beginPath();
            ctx.setLineDash(lineDash);
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = color;
            ctx.stroke();
         };

         const init = function () {
            // 背景上填充为黑色
            ctx.fillStyle = "transparent";
            ctx.fillRect(0, 0, cWidth, cHeight);
            for (let i = 1; i <= 8; i++) {
               Line(centerX + Math.sin((Math.PI * i) / 4) * radius, centerY + Math.cos((Math.PI * i) / 4) * radius, [5, 3], "#396a00");
            }

            for (let i = 1; i <= 15; ) {
               Line(centerX + Math.sin((Math.PI * i) / 8) * radius, centerY + Math.cos((Math.PI * i) / 8) * radius, [], "#062807");
               i += 2;
            }

            drawCircle(0.9 * centerY, 2.5);
            drawCircle(0.8 * centerY, 2.5, "#042906");
            drawCircle(0.6 * centerY);
            drawCircle(0.3 * centerY);
         };

         return {
            animID: undefined,
            points: [
               [cWidth / 3, (cHeight * 3) / 7],
               [(cWidth * 4) / 5, (cHeight * 6) / 9],
            ],
            addPoints(x, y) {
               this.points.push([x, y]);
            },
            clear() {
               cancelAnimationFrame(animID); // 停止动画
               ctx.clearRect(0, 0, cWidth, cHeight); // 清除画布
               this.points = [
                  [cWidth / 3, (cHeight * 3) / 7],
                  [(cWidth * 4) / 5, (cHeight * 6) / 9],
               ]; // 重置默认点
            },
            scan() {
               let angle = Math.PI / 4;
               let scanBegin = 0;
               let scanEnd = angle;
               let pointRadius = 1;
               // 绘制雷达扫描
               let move = () => {
                  ctx.clearRect(0, 0, cWidth, cHeight); // 清除画布
                  init(); // 重绘背景
                  drawSector(scanBegin, scanEnd); // 绘制扇形扫描区域

                  // 改变点的半径以及扇形的角度
                  pointRadius += 0.08;
                  scanBegin += angle / 25;
                  scanEnd = scanBegin + angle;
                  // 超过阈值变为初始值
                  if (scanBegin >= Math.PI * 2) {
                     scanBegin = 0;
                     scanEnd = scanBegin + angle;
                  }
                  if (pointRadius >= 7) pointRadius = 0;
                  // 再次绘制
                  animID = window.requestAnimFrame(move);
               };

               window.requestAnimFrame = (function () {
                  return (
                     window.requestAnimationFrame ||
                     window.webkitRequestAnimationFrame ||
                     window.mozRequestAnimationFrame ||
                     window.oRequestAnimationFrame ||
                     window.msRequestAnimationFrame ||
                     function (callback) {
                        window.setTimeout(callback, 1000 / 60);
                     }
                  );
               })();

               animID = window.requestAnimFrame(move);
            },
            stopScan() {
               cancelAnimationFrame(animID);
            },
         };
      },

      // 添加雷达中的坐标点
      addRadarWreckerPoint(markData) {
         // 创建点
         let marker = null;
         // 坐标点集合
         let markerList = [];
         // 创建图片
         let markerIcon = new AMap.Icon({
            image: radarWrecker,
            imageSize: new AMap.Size(55, 55),
         });

         // 添加雷达坐标点
         markData.list.forEach((item) => {
            // 添加坐标点
            marker = new AMap.Marker({
               icon: markerIcon,
               position: [Number(item.longitude), Number(item.latitude)],
               offset: new AMap.Pixel(-25, -30),
               zIndex: 12,
               extData: item,
            });

            // 添加坐标点弹窗内容
            marker.setLabel({
               content: `<div class="map_infoWindow" style="width: 280px">
                  <div class="infoWindow_title">${item.carNo}</div>
                  <div class="infoWindow_line"></div>
                  <div class="info_carInfo">
                     <img src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" />
                     <div class="carInfo_content">
                        ${item.state == "0" ? `<div>可用</div>` : ""}
                        ${item.state == "1" ? `<div style="color: #b2fffc">任务中</div>` : ""}
                        ${item.state == "2" ? `<div style="color: red">不可用</div>` : ""}
                        <div>距离：${item.distance}km</div>
                        <div>预计到达时间：${item.preArriveMinite}分钟</div>
                     </div>
                  </div>
                  ${item.state == "0" ? `<div class="info_button" onclick="noticeObstacles()">通知清障</div>` : ""}
                  ${item.state == "1" ? `<div class="info_button_notice">已通知</div>` : ""}
                  ${item.state == "2" ? "" : ""}
               </div>`,
               offset: new AMap.Pixel(1, 13),
            });

            // 添加坐标点
            this.map.add(marker);
            // 储存添加的点
            markerList.push(marker);

            if (item.state == "1") {
               let startPoint = new AMap.LngLat(Number(item.longitude), Number(item.latitude));
               let endPoint = new AMap.LngLat(Number(this.eventInfoData.longitude), Number(this.eventInfoData.latitude));
               this.creatDriving(startPoint, endPoint);
            }
         });
         // 储存雷达坐标点
         this.radarMarkerList = markerList;
      },

      // 创建路线规划
      creatDriving(startPoint, endPoint) {
         let AMap = this.AMap;
         let map = this.map;
         // 设置最快捷路径
         let driving = new AMap.Driving({
            policy: AMap.DrivingPolicy.LEAST_TIME,
         });

         new Promise((resolve, reject) => {
            // 绘制路线
            driving.search(startPoint, endPoint, function (status, result) {
               let lineList = [];

               let _result = result.routes[0].steps;
               _result.forEach((item) => {
                  item.path.forEach((e) => {
                     lineList.push([e.lng, e.lat]);
                  });
               });

               resolve(lineList);
            });
         }).then((data) => {
            // 绘制轨迹
            this.radarPolyline = new AMap.Polyline({
               map: map,
               path: data,
               showDir: true,
               strokeColor: "#28F", //线颜色
               strokeWeight: 6, //线宽
            });
            map.add(this.radarPolyline);
         });
      },

      // 移除雷达中的坐标点
      clearRadarAll() {
         // 关闭雷达图
         if (this.mapCanvas) {
            this.mapCanvas.hide();
            this.mapCanvas = null;
         }
         // 清空轨迹
         if (this.mapPolyline) {
            this.mapPolyline.hide();
            this.mapPolyline = null;
         }
         // 清空坐标点
         if (this.radarMarkerList && this.radarMarkerList.length) {
            this.radarMarkerList.forEach((item) => {
               this.map.remove(item);
            });
            this.radarMarkerList = [];
         }
      },

      // 点击图层按钮
      changeLayerActive(row) {
         // 保存点击的按钮
         this.layerButtonActive = row.name;
         // 修改所有按钮状态
         this.layerButtonList.forEach((item) => {
            if (item.name == row.name) {
               if (item.isActive) {
                  this.layerButtonActive = "";
               }
               item.isActive = !item.isActive;
            } else {
               item.isActive = false;
            }
         });

         // 打开展示面板
         this.layerShowOptionList = [];
         // 动态渲染选项面板
         if (row.isActive) {
            this.layerAllOptionList.forEach((item) => {
               if (item.type == row.type) {
                  this.layerShowOptionList.push(item);
               }
            });
         }
      },

      // 图层选项面板选中
      async changeLayerCheck(value) {
         // 清空当前聚合点图层
         if (this.mapCluster) {
            this.mapCluster.setMap(null);
         }
         // 关闭坐标点信息弹窗
         if (this.infoWindow) {
            this.infoWindow.close();
         }
         // 移除天气图片
         if (this.imageLayerr) {
            this.map.remove(this.imageLayerr);
         }
         // 当前图层坐标点数组
         let pointList = [];
         // 是否渲染气象坐标点
         let weatherIsShow = false;

         // 基础设施、天气、机电设备
         this.layerCheckList.forEach((item) => {
            // 服务区
            if (item == 1) {
               pointList.push(this.layerAllData.serviceList);
            }
            // 收费站
            if (item == 2) {
               pointList.push(this.layerAllData.stationList);
            }
            // 养护大队
            if (item == 3) {
               pointList.push(this.layerAllData.maintainList);
            }
            // 清障大队
            if (item == 4) {
               pointList.push(this.layerAllData.clearList);
            }
            // 彩云天气
            if (item == 8) {
               let detailsApi = this.getApiData("weather_detail");
               usePostApi(detailsApi.value).then((res) => {
                  this.imageLayerr = new AMap.ImageLayer({
                     url: cloudy,
                     bounds: new AMap.Bounds([118.75, 32.11], [118.88, 32.0]), //图片矩形范围
                     zooms: [2, 20],
                  });
                  this.map.add(this.imageLayerr);
               });
            }
            // 气象监测点
            if (item == 9) {
               weatherIsShow = true;
               pointList.push(this.layerAllData.weatherStationList);
            }
            // 情报板
            if (item == 11) {
               pointList.push(this.layerAllData.screenList || []);
            }
            // 视频监控
            if (item == 12) {
               pointList.push(this.layerAllData.videoList || []);
               this.videoDialogIconIsShow = true;
            }
         });

         // 车辆数据
         if (this.layerCheckList.includes(5) || this.layerCheckList.includes(6) || this.layerCheckList.includes(7)) {
            let detailsApi = this.getApiData("vehicle_list");
            let vehicleData = [];
            await usePostApi(detailsApi.value).then((res) => {
               vehicleData = res.data.res.data;
            });

            await this.layerCheckList.forEach((item) => {
               // 清障车
               if (item == 5) {
                  if (vehicleData.clearList.length) {
                     vehicleData.clearList.forEach((item) => {
                        item.levelA = "车辆";
                        item.levelB = "清障车";
                     });
                     pointList.push(vehicleData.clearList);
                  }
               }
               // 危化品车
               if (item == 6) {
                  if (vehicleData.dangerList.length) {
                     vehicleData.dangerList.forEach((item) => {
                        item.levelA = "车辆";
                        item.levelB = "危化品车";
                     });
                     pointList.push(vehicleData.dangerList);
                  }
               }
               // 警车
               if (item == 7) {
                  if (vehicleData.warnList.length) {
                     vehicleData.warnList.forEach((item) => {
                        item.levelA = "车辆";
                        item.levelB = "警车";
                     });
                     pointList.push(vehicleData.warnList);
                  }
               }
            });
         }

         // 添加对应的坐标点
         await this.createClusterMarker(pointList, weatherIsShow);

         // 如果取消视频监控，则关闭图标
         if (this.layerCheckList.indexOf(12) == -1) {
            this.videoDialogIconIsShow = false;
            this.videoTabsList = [];
            this.activeTabs = "";
         }
      },

      // 拥堵情况面板切换
      async changeTrafficType() {
         if (this.trafficType) {
            // 获取Api接口
            let detailsApi = this.getApiData("block_detail");
            // 清障大队详情
            await usePostApi(detailsApi.value).then((res) => {
               let trafficData = res.data.res.data.list;
               // 拥堵情况
               let tarfficPointList = {
                  normal: [],
                  warning: [],
                  danger: [],
               };
               // 过滤拥堵情况
               trafficData.forEach((item) => {
                  let obj = { name: item.road, point: [] };
                  item.polyLineList.forEach((item) => {
                     obj.point.push([Number(item.longitude), Number(item.latitude)]);
                  });
                  if (item.status == "缓行") {
                     tarfficPointList.normal.push(obj);
                  } else if (item.status == "拥堵") {
                     tarfficPointList.warning.push(obj);
                  } else if (item.status == "严重拥堵") {
                     tarfficPointList.danger.push(obj);
                  }
               });

               this.createLinePolygon(AMap, tarfficPointList.normal, "normal", "#79A934");
               this.createLinePolygon(AMap, tarfficPointList.warning, "warning", "#C6B83C", "#E7AD36");
               this.createLinePolygon(AMap, tarfficPointList.danger, "danger", "#EF4C31", "#793939");

               window.eventCenter?.triggerEvent && window.eventCenter.triggerEvent(this.componentId, "clickTraffic", {});
            });
         } else {
            // 清除拥堵情况
            this.map.remove(this.mapNormalLine);
            this.map.remove(this.mapWarningLine);
            this.map.remove(this.mapDangerLine);
         }
      },

      // 创建聚合点
      async createClusterMarker(dataList, weatherType) {
         // 储存坐标点
         let pointList = [];
         // 创建坐标点信息
         for (let i in dataList) {
            if (dataList[i]) {
               if (weatherType) {
                  dataList[i].forEach((item) => {
                     pointList.push({
                        lnglat: [Number(item.longitude), Number(item.latitude)],
                        ...item,
                     });
                  });
               } else {
                  if (i != "weatherStationList") {
                     dataList[i].forEach((item) => {
                        pointList.push({
                           lnglat: [Number(item.longitude), Number(item.latitude)],
                           ...item,
                        });
                     });
                  }
               }
            }
         }

         // 聚合点配置
         let clusterIndexSet = {
            levelA: { minZoom: 3, maxZoom: 7 },
            levelB: { minZoom: 7, maxZoom: 9.5 },
            id: { minZoom: 9.5, maxZoom: 16 },
         };

         // 创建聚合点
         this.mapCluster = new AMap.IndexCluster(this.map, pointList, {
            gridSize: 60,
            clusterIndexSet: clusterIndexSet,
            renderClusterMarker: this.createMarker,
         });
      },

      // 创建事件聚合点
      creatEventClusterMarker(dataList) {
         // 储存坐标点
         let pointList = [];

         // 创建坐标点信息
         dataList.forEach((item) => {
            pointList.push({
               lnglat: [Number(item.longitude), Number(item.latitude)],
               ...item,
            });
         });

         // 聚合点配置
         let clusterIndexSet = {
            levelA: { minZoom: 3, maxZoom: 7 },
            levelB: { minZoom: 7, maxZoom: 9.5 },
            id: { minZoom: 9.5, maxZoom: 16 },
         };

         // 创建聚合点
         this.mapEventCluster = new AMap.IndexCluster(this.map, pointList, {
            gridSize: 60,
            clusterIndexSet: clusterIndexSet,
            renderClusterMarker: this.createEventMarker,
         });
      },

      // 获取按钮图标
      getIconImg(amap, name, type) {
         let AMap = amap || this.AMap;
         let icon = null;
         // 根据状态返回不同图片
         if (type) {
            switch (name) {
               case "服务区":
                  icon = serviceAreaActive;
                  break;
               case "收费站":
                  icon = tollGateActive;
                  break;
               case "养护大队":
                  icon = curingTeamActive;
                  break;
               case "清障大队":
                  icon = clearTeamActive;
                  break;
               case "清障车":
                  icon = wreckerActive;
                  break;
               case "危化品车":
                  icon = dangerousCarActive;
                  break;
               case "警车":
                  icon = policeCarActive;
                  break;
               case "气象监测点":
                  icon = weatherSiteActive;
                  break;
               case "彩云天气":
                  icon = colourWeatherActive;
                  break;
               case "视频监控":
                  icon = videoMonitorActive;
                  break;
               case "情报板":
                  icon = infoBoardActive;
                  break;
            }
         } else {
            switch (name) {
               case "服务区":
                  icon = serviceAreaDefault;
                  break;
               case "收费站":
                  icon = tollGateDefault;
                  break;
               case "养护大队":
                  icon = curingTeamDefault;
                  break;
               case "清障大队":
                  icon = clearTeamDefault;
                  break;
               case "清障车":
                  icon = wreckerDefault;
                  break;
               case "危化品车":
                  icon = dangerousCarDefault;
                  break;
               case "警车":
                  icon = policeCarDefault;
                  break;
               case "气象监测点":
                  icon = weatherSiteDefault;
                  break;
               case "彩云天气":
                  icon = colourWeatherDefault;
                  break;
               case "视频监控":
                  icon = videoMonitorDefault;
                  break;
               case "情报板":
                  icon = infoBoardDefault;
                  break;
            }
         }
         // 创建图片
         let markerIcon = new AMap.Icon({
            image: icon,
            imageSize: new AMap.Size(30, 40),
         });
         // 返回处理过的图片
         return markerIcon;
      },

      // 金额结构
      getMoneyDiv(money) {
         if (!money) {
            money = 0;
         }
         let htmlList = [];
         // 生成金额数组
         let newMoney = [];
         let moneyArr = money.toString().split("");
         for (let i = moneyArr.length; i < 8; i++) {
            newMoney.push("0");
         }
         newMoney = newMoney.concat(moneyArr);
         // 生成金额HTML结构
         newMoney.forEach((item) => {
            htmlList.push(`<div class="money_block">${item}</div>`);
         });

         htmlList = htmlList.join("");

         return htmlList;
      },

      // 通知清障
      noticeObstacles(marker) {
         event.stopPropagation();

         let noticeWreckerApi = this.getApiData("rescue_noticeWrecker");
         usePostApi(noticeWreckerApi.value, { id: this.eventInfoData.id }).then((res) => {});
      },

      // 添加弹窗监控坐标点
      addVideoMarker(infoVideoData) {
         // 移除雷达图
         if (this.mapCanvas) {
            this.clearRadarAll();
         }
         // 关闭雷达图轨迹
         if (this.radarPolyline) {
            this.map.remove(this.radarPolyline);
         }
         // 移除情报板标记点
         if (this.infoBoardMarkerList.length) {
            this.infoBoardMarkerList.forEach((item) => {
               this.map.remove(item);
            });
            this.infoBoardMarkerList = [];
         }
         // 重复点击则取消
         if (this.videoDialogIsShow) {
            this.infoVideoMarkerList.forEach((item) => {
               this.map.remove(item);
            });
            this.infoVideoMarkerList = [];
            this.videoDialogIsShow = false;
            this.videoTabsList = [];
            this.activeTabs = "";
            return;
         }
         this.$refs["event_infowindow"].coloseInfoWindow();
         // 渲染视频
         this.videoTabsList = infoVideoData;
         this.activeTabs = infoVideoData[0].id;
         this.videoDialogIsShow = true;

         // 储存新增的标记点
         let markerList = [];
         // 添加标记点
         infoVideoData.forEach((item) => {
            // 创建坐标点
            let marker = new AMap.Marker({
               position: [Number(item.longitude), Number(item.latitude)],
               icon: new AMap.Icon({
                  image: videoMonitorActive,
                  imageSize: new AMap.Size(30, 40),
               }),
               offset: new AMap.Pixel(-13, -30),
            });
            // 创建坐标点内容
            marker.setLabel({
               content: `<div class="map_infoWindow">
                  <div class="infoWindow_title">${item.name}</div>
                  <div class="infoWindow_line"></div>
               </div>`,
               offset: new AMap.Pixel(0, 10), //设置文本标注偏移量
            });
            // 添加坐标点
            this.map.add(marker);
            // 储存生成的点
            markerList.push(marker);
         });
         // 开启地图缩放
         this.map.setStatus({ zoomEnable: true });
         // 储存生成的坐标点
         this.infoVideoMarkerList = markerList;
      },

      // 添加弹窗情报板坐标点
      addInfoBoardMarker(infoBoardData) {
         // 移除雷达图
         if (this.mapCanvas) {
            this.clearRadarAll();
         }
         // 关闭雷达图轨迹
         if (this.radarPolyline) {
            this.map.remove(this.radarPolyline);
         }
         // 移除监控
         if (this.videoDialogIsShow) {
            this.videoDialogIsShow = false;
            this.videoTabsList = [];
            this.activeTabs = "";
         }
         // 移除视频监控坐标点
         if (this.infoVideoMarkerList.length) {
            this.infoVideoMarkerList.forEach((item) => {
               this.map.remove(item);
            });
            this.infoVideoMarkerList = [];
         }
         // 移除情报板标记点
         if (this.infoBoardMarkerList.length) {
            this.infoBoardMarkerList.forEach((item) => {
               this.map.remove(item);
            });
            this.infoBoardMarkerList = [];
            return;
         }
         this.$refs["event_infowindow"].coloseInfoWindow();
         // 储存新增的标记点
         let markerList = [];
         // 添加标记点
         infoBoardData.list.forEach((item) => {
            // 创建坐标点
            let marker = new AMap.Marker({
               position: [Number(item.longitude), Number(item.latitude)],
               icon: new AMap.Icon({
                  image: infoBoardActive,
                  imageSize: new AMap.Size(30, 40),
               }),
               offset: new AMap.Pixel(-13, -30),
            });
            // 创建坐标点内容
            marker.setLabel({
               content: `<div class="infoWindow_board">
                  <div class="infoWindow_title">${item.name}</div>
                  <div class="infoWindow_line"></div>
                  <div class="info_video">
                     <div>${item.content}</div>
                  </div>
               </div>`,
               offset: new AMap.Pixel(0, 80), //设置文本标注偏移量
            });
            // 添加坐标点
            this.map.add(marker);
            // 储存生成的点
            markerList.push(marker);
         });
         // 开启地图缩放
         this.map.setStatus({ zoomEnable: true });
         // 储存生成的坐标点
         this.infoBoardMarkerList = markerList;
      },

      // 获取接口地址
      getApiData(name) {
         let data = this.apiList.find((obj) => {
            return obj.name === name;
         });

         return data;
      },

      // 转换坐标系
      transformationPoint(marker) {
         return new Promise((resolve, reject) => {
            // 将其他坐标系值转换为高德坐标系值
            AMap.convertFrom(marker, "gps", function (status, result) {
               if (result.info === "ok") {
                  let lnglats = result.locations;
                  resolve([lnglats[0].KL, lnglats[0].kT]);
               }
            });
         });
      },

      // 切换事件点
      do_EventCenter_changeEventType({ value }) {
         console.log("切换事件点--->", value.value);
         this.clickMap();
         this.handleEventData(value.value, value.type);
      },

      // 刷新地图
      do_EventCenter_refreshMap({ value }) {
         this.clickMap();
         this.map.setZoomAndCenter(10, [119.27, 31.56]);
      },

      // 重置地图
      resetMap() {
         this.clickMap();
         this.map.setZoomAndCenter(10, [119.27, 31.56]);
      },

      // 注册组件
      Event_Center_getName() {
         return "运营总览GIS";
      },
   },

   beforeDestroy() {
      // 当地图存在 销毁地图
      if (this.map) {
         this.map.destroy();
      }
   },
};
</script>
