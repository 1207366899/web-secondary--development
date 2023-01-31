<template>
   <div ref="secondary_bigscreen" :id="id" class="outermast">
      <!-- 标题 -->
      <div class="gis_title">
         <div>{{ gisTitle }}</div>
      </div>
      <!-- 图文介绍 -->
      <div class="git_introduce">
         <div class="introduce_img">
            <div class="swiper-container">
               <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="(item, index) in swiperImgList" :key="index">
                     <img :src="item.url" alt="" />
                  </div>
               </div>
            </div>
         </div>

         <el-tooltip effect="dark" :content="introduceText" placement="top">
            <div class="introduce_text">
               <span class="text_title">简介：</span>
               {{ introduceText }}
            </div>
         </el-tooltip>
      </div>
      <div class="gis_map">
         <div id="mapContent" ref="mapContent"></div>
         <div class="mapContent_img">
            <img src="../../assets/地图装饰左上.png" alt="" />
            <img src="../../assets/地图装饰右下.png" alt="" />
         </div>
         <div class="overview_button">
            <el-button size="mini" @click="overView">总览</el-button>
         </div>
      </div>
   </div>
</template>

<script>
import MsgCompConfig from "./msgCompConfig.js";
import Utils from "@/utils/index.js";
import "./app.less";
// 引入高德地图
import AMapLoader from "@amap/amap-jsapi-loader";
// 引入接口
import { getApi, queryApi, queryAssetById } from "../../api/asset";
// 引入覆盖物区域
import { GS_linePoint } from "./basics-data";
// 注册高德地图Key
window._AMapSecurityConfig = {
   securityJsCode: "c30d2bf6f8bf8dde01865570d27e2f7f",
};

// 引入swiper插件
import Swiper from "swiper";
import "swiper/swiper-bundle.css";

// 收费站
import tollGateDefault from "../../assets/收费站-未选中.png";
import tollGateActive from "../../assets/收费站-选中.png";

export default {
   name: "Main",

   props: {
      pubSub: Object,
      data: Object | Array,
      componentId: String,
      configuration: Object,
      options: Object,
      updateProcess: Function,
   },

   data() {
      return {
         id: "",
         // 配置项
         configurationForm: {},
         // 资产Id
         mapType: "",

         // 地图整体实例
         map: null,
         // 高德地图实例
         AMap: null,

         // 地图标题
         gisTitle: "收费站",

         // 图文介绍-文字
         introduceText: "",

         // 弹窗
         mapInfoWindow: null,
         // 资产点位数据
         assetPointList: [],

         // 当前选中的坐标点
         markerActive: null,

         // 接口数组
         apiList: [],

         // 轮播图容器
         swiperBox: null,
         // 轮播图数组
         swiperImgList: [],
      };
   },

   mounted() {
      this.pubSub && this.pubSub.subscribe("updateChart" + this.componentId, (data) => {});
      window.componentCenter?.register && window.componentCenter.register(this.componentId, "comp", this, MsgCompConfig);
      this.updateProcess && this.updateProcess();
      let id = this.options?.externalVariables?.id;
      this.id = id ? `secondary_analyzer_${id}` : `secondary_bigscreen_${Utils.generateUUID()}`;

      this.configurationForm = JSON.parse(JSON.stringify(this.configuration));
      this.mapType = this.configuration.mapType;

      // 创建轮播图
      this.createSwiper();

      // 获取所有接口参数
      this.getAllApi();
   },

   methods: {
      // 创建轮播图
      createSwiper() {
         this.swiperBox = new Swiper(".swiper-container", {
            autoplay: true,
            direction: "horizontal",
            grabCursor: true,
            slidesPerView: 1,
            centeredSlides: true,
            spaceBetween: 0,
            initialSlide: 0,
            slideToClickedSlide: true,
            autoplay: true,
         });
      },

      // 获取所有接口
      getAllApi() {
         getApi().then((res) => {
            // 储存所有数据接口
            this.apiList = res.data;
            // 初始化生成地图
            this.initMap();
         });
      },

      // 处理数据格式
      translatePlatformDataToJsonArray(originTableData) {
         let originTableHeader = originTableData.data[0];
         let tableHeader = [];
         originTableHeader.forEach((item) => {
            tableHeader.push(item.col_name);
         });
         let tableBody = originTableData.data[1];
         let tableData = [];
         tableBody.forEach((tableItem) => {
            let temp = {};
            tableItem.forEach((item, index) => {
               temp[tableHeader[index]] = item;
            });
            tableData.push(temp);
         });
         return tableData;
      },

      // 加载地图
      initMap() {
         // 销毁地图
         this.map && this.map.destroy();
         //创建地图
         AMapLoader.load({
            key: "b741d392ac4e4f5ddd22309030672f63",
            version: "2.0",
            plugins: ["AMap.DistrictSearch"],
         }).then((AMap) => {
            let map = new AMap.Map("mapContent", {
               // 地图中心点
               center: [119.27, 31.56],
               // 设置地图的显示样式
               mapStyle: "amap://styles/1300784950b9ec4ea6a6cab8dd883c52",
               // 地图缩放级别
               zoom: 8.9,
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
            this.createLinePolygon(AMap, GS_linePoint.normal[0]);
            this.createLinePolygon(AMap, GS_linePoint.normal[1]);
            this.createLinePolygon(AMap, GS_linePoint.normal[2]);
            this.createLinePolygon(AMap, GS_linePoint.normal[3]);

            // 渲染坐标点
            this.handleLayerPanelData(AMap);
         });
      },

      // 处理点位数据
      async handleLayerPanelData(AMap) {
         let infrastructData = [];

         // 获取详情接口
         await queryAssetById("b06546f6-3e58-22b0-166b-684f52c0177e").then((res) => {
            this.assetPointList = this.translatePlatformDataToJsonArray(res);

            let initial = this.assetPointList.filter((item) => {
               return item.station_id == "-1";
            });

            this.gisTitle = initial[0].station_name;
            this.introduceText = initial[0].content;

            if (initial[0].img_url) {
               this.swiperImgList = JSON.parse(initial[0].img_url);
               this.swiperBox.slideTo(0, 1000, false);
            }
         });

         // 基础设置接口字段
         let infrastructApi = this.getApiData("infrastruct_list");

         // 获取接口数据
         await queryApi(infrastructApi.value).then((res) => {
            infrastructData = res.data.res.data.stationList;
            infrastructData.forEach((item) => {
               item.levelB = "收费站";
            });

            this.createMarker(AMap, infrastructData);
         });
      },

      // 创建坐标点
      createMarker(AMap, dataList) {
         dataList.forEach((item) => {
            let marker = new AMap.Marker({
               icon: this.getIconImg(AMap, false),
               position: [Number(item.longitude), Number(item.latitude)],
               offset: new AMap.Pixel(-13, -30),
               extData: item,
            });

            let details = this.assetPointList.filter((e) => {
               return e.station_id == item.id;
            });

            marker.content = `<div class="map_infoWindow">
               <div class="infoWindow_title">${details[0].station_name}</div>
               <div class="infoWindow_line"></div>
            </div>`;

            marker.on("click", this.replaceMarkerIcon);
            marker.on("mouseover", this.openInfoDialog);
            marker.on("mouseout", this.closeInfoDialog);

            this.map.add(marker);
         });
      },

      // 打开弹窗
      openInfoDialog(e) {
         this.mapInfoWindow = new AMap.InfoWindow({ anchor: "top-center", isCustom: true, offset: new AMap.Pixel(-55, -80) });
         this.mapInfoWindow.setContent(e.target.content);
         this.mapInfoWindow.open(this.map, e.target.getPosition());
      },

      // 关闭弹窗
      closeInfoDialog(e) {
         this.mapInfoWindow.close(this.map, e.target.getPosition());
      },

      // 总览
      overView() {
         let initial = this.assetPointList.filter((item) => {
            return item.station_id == "-1";
         });

         this.gisTitle = initial[0].station_name;
         this.introduceText = initial[0].content;
         if (initial[0].img_url) {
            this.swiperImgList = JSON.parse(initial[0].img_url);
            this.swiperBox.slideTo(0, 1000, false);
         }

         // 关闭坐标点激活状态
         if (this.markerActive) {
            let markerActive = this.markerActive.target;
            markerActive.setIcon(this.getIconImg("", false));
            this.markerActive = null;
         }

         window.eventCenter?.triggerEvent &&
            window.eventCenter.triggerEvent(this.componentId, "clickMarker", {
               value: "-1",
            });
      },

      // 点击坐标点
      replaceMarkerIcon(e) {
         // 获取坐标点自带参数
         let point = e.target.getExtData();

         // 判断是否存在激活过的坐标点
         if (this.markerActive) {
            let markerActive = this.markerActive.target;
            // 相同坐标点取消选中
            if (markerActive.getExtData().id == point.id) {
               markerActive.setIcon(this.getIconImg("", false));
               this.markerActive = null;
               return;
            }
            markerActive.setIcon(this.getIconImg("", false));
            this.markerActive = e;
         } else {
            this.markerActive = e;
         }

         // 替换激活图标
         e.target.setIcon(this.getIconImg("", true));

         // 替换简介信息
         let initial = this.assetPointList.filter((item) => {
            return item.station_id == point.id;
         });

         this.gisTitle = initial[0].station_name;
         this.introduceText = initial[0].content;
         if (initial[0].img_url) {
            this.swiperImgList = JSON.parse(initial[0].img_url);
            console.log("swiperImgList--->", JSON.parse(initial[0]));
            this.swiperBox.slideTo(0, 1000, false);
         }

         window.eventCenter?.triggerEvent &&
            window.eventCenter.triggerEvent(this.componentId, "clickMarker", {
               value: point.id,
            });
      },

      // 创建路线覆盖物
      createLinePolygon(amap, data, color, borderColor) {
         // 创建高德地图实例
         let AMap = amap || this.AMap;
         // 创建路线数组
         let linePath = [];
         // 生成路线坐标点
         data.point.forEach((e) => {
            linePath.push(new AMap.LngLat(e[0], e[1]));
         });
         // 创建路线覆盖物
         let linePolygon = new AMap.Polyline({
            path: linePath,
            strokeWeight: 5,
            strokeColor: color || "#2B97BC",
            strokeOpacity: 1,
            isOutline: true,
            borderWeight: 2,
            outlineColor: borderColor || "#08A5F7",
         });
         // 在地图上添加路线
         this.map.add([linePolygon]);
      },

      // 获取按钮图标
      getIconImg(amap, type) {
         let AMap = amap || this.AMap;
         // 根据状态返回不同图片
         let icon = type ? tollGateActive : tollGateDefault;
         // 创建图片
         let markerIcon = new AMap.Icon({
            image: icon,
            imageSize: new AMap.Size(25, 35),
         });
         // 返回处理过的图片
         return markerIcon;
      },

      // 获取接口地址
      getApiData(name) {
         let data = this.apiList.find((obj) => {
            return obj.name === name;
         });
         return data;
      },

      // 注册组件
      Event_Center_getName() {
         return "运营监控GIS";
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
