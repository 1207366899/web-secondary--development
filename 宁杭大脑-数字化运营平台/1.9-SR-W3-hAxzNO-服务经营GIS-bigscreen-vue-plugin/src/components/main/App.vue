<template>
   <div ref="secondary_bigscreen" :id="id" class="outermast">
      <!-- 标题 -->
      <div class="gis_title">
         <div>{{ gisTitle }}</div>
      </div>
      <!-- 下拉选择框 -->
      <div class="area_select" :style="!selectIsShow ? 'visibility: hidden' : ''">
         <el-select v-model="areaSelect" placeholder="请选择" size="mini" @change="changeArea">
            <el-option v-for="(item, index) in areaSelectList" :key="index" :label="item.label" :value="item.value"></el-option>
         </el-select>
      </div>
      <!-- 图文介绍 -->
      <div class="git_introduce">
         <el-tooltip effect="dark" :content="introduceText" placement="top">
            <div class="introduce_text">
               <span class="text_title">简介：</span>
               {{ introduceText }}
            </div>
         </el-tooltip>
      </div>
      <!-- 地图 -->
      <div class="gis_map">
         <div id="mapContent" ref="mapContent" v-show="mapIsShow"></div>
         <!-- 装饰图片 -->
         <div class="mapContent_img">
            <img src="../../assets/地图装饰左上.png" alt="" />
            <img src="../../assets/地图装饰右下.png" alt="" />
         </div>
         <!-- 总览按钮 -->
         <div class="overview_button">
            <el-button size="mini" @click="overView">总览</el-button>
         </div>
         <!-- 轮播图 -->
         <div class="gis_swiper" v-show="swiperIsShow">
            <div class="swiper-container">
               <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="(item, index) in swiperImgList" :key="index">
                     <img :src="item.url" alt="" />
                  </div>
               </div>
               <div class="swiper-pagination"></div>
            </div>
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
import { queryAssetById } from "../../api/asset";
// 引入覆盖物区域
import { GS_linePoint } from "./basics-data";
// 注册高德地图Key
window._AMapSecurityConfig = {
   securityJsCode: "c30d2bf6f8bf8dde01865570d27e2f7f",
};

// 引入swiper插件
import Swiper, { Pagination } from "swiper";
import "swiper/swiper-bundle.css";

Swiper.use([Pagination]);

// 服务区
import serviceAreaDefault from "../../assets/服务区-未选中.png";
import serviceAreaActive from "../../assets/服务区-选中.png";

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
         // 点位数据
         infrastructData: [],
         // 资产点位数据
         assetPointList: [],

         // 地图标题
         gisTitle: "服务区",

         // 图文介绍-文字
         introduceText: "",

         // 弹窗
         mapInfoWindow: null,

         // 下拉框是否展示
         selectIsShow: false,
         // 当前选中区域
         areaSelect: "全区",
         // 选中区域列表
         areaSelectList: [{ label: "全区", value: "-1" }],
         // 当前选中的坐标点
         markerActive: null,
         // 当前渲染坐标点
         makerList: [],

         // 接口数组
         apiList: [],

         // 地图开关
         mapIsShow: true,
         // 轮播图容器
         swiperBox: null,
         // 轮播图开关
         swiperIsShow: false,
         // 轮播图数组
         swiperImgList: [],
      };
   },

   mounted() {
      this.pubSub && this.pubSub.subscribe("updateChart" + this.componentId, (data) => {});
      window.componentCenter?.register && window.componentCenter.register(this.componentId, "comp", this, MsgCompConfig);
      this.updateProcess && this.updateProcess();
      let id = this.options?.externalletiables?.id;
      this.id = id ? `secondary_analyzer_${id}` : `secondary_bigscreen_${Utils.generateUUID()}`;

      this.configurationForm = JSON.parse(JSON.stringify(this.configuration));
      this.mapType = this.configuration.mapType;

      // 生成地图
      this.initMap();
      // 创建轮播图
      this.createSwiper();
   },

   methods: {
      // 创建轮播图
      createSwiper() {
         this.swiperBox = new Swiper(".swiper-container", {
            pagination: {
               el: ".swiper-pagination",
               clickable: true,
            },
            autoplay: {
               delay: 1000, //1秒切换一次
            },

            // swiper的滑动方式,水平(horizontal),垂直(vertical)
            direction: "horizontal",
            // 鼠标覆盖Swiper时指针会变成手掌形状
            grabCursor: true,
            // 每页显示的side个数
            slidesPerView: 1,
            // 选中的slider居中
            centeredSlides: true,
            // 每个side的距离
            spaceBetween: 0,
            // 初始位置
            initialSlide: 0,
            // 可点击选择slider
            slideToClickedSlide: true,
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
      async handleLayerPanelData() {
         // 获取资产点位数据
         await queryAssetById("76edeee3-2408-8512-f9d7-2e910c63baa1").then((res) => {
            this.assetPointList = this.translatePlatformDataToJsonArray(res);

            // 过滤出id为-1的坐标
            let initial = this.assetPointList.filter((item) => {
               return item.area_id == "-1";
            });
            // 赋值标题
            this.gisTitle = initial[0].area_name;
            // 赋值简介文本
            this.introduceText = initial[0].content;

            // 过滤出全区的数据
            let totalArea = this.assetPointList.filter((item) => {
               return item.area_type == "全区";
            });
            // 生成坐标点
            this.createMarker(this.AMap, totalArea);
         });
      },

      // 创建坐标点
      createMarker(AMap, dataList) {
         dataList.forEach((item) => {
            // 创建坐标点
            let marker = new AMap.Marker({
               icon: this.getIconImg(AMap, false),
               position: [Number(item.long), Number(item.lat)],
               offset: new AMap.Pixel(-13, -30),
               extData: item,
            });

            // 创建坐标点悬浮标题
            if (item.content) {
               marker.content = `<div class="map_infoWindow">
                  <div class="infoWindow_title">${item.area_name}</div>
               </div>`;
               // 添加坐标点事件
               marker.on("click", this.replaceMarkerIcon);
            } else {
               marker.content = `<div class="map_infoWindow">
                  <div class="infoWindow_title">暂无数据</div>
               </div>`;
            }

            marker.on("mouseover", this.openInfoDialog);
            marker.on("mouseout", this.closeInfoDialog);

            this.map.add(marker);
            this.makerList.push(marker);
         });
      },

      // 展示坐标点悬浮标题
      openInfoDialog(e) {
         this.mapInfoWindow = new AMap.InfoWindow({ anchor: "top-center", isCustom: true, offset: new AMap.Pixel(-55, -80) });
         this.mapInfoWindow.setContent(e.target.content);
         this.mapInfoWindow.open(this.map, e.target.getPosition());
      },

      // 关闭坐标点悬浮标题
      closeInfoDialog(e) {
         this.mapInfoWindow.close(this.map, e.target.getPosition());
      },

      // 点击坐标点
      replaceMarkerIcon(e) {
         // 打开下拉框
         this.selectIsShow = true;

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

         // 替换标题
         this.gisTitle = point.area_name;
         // 替换简介
         this.introduceText = point.content;
         // 替换轮播图
         if (point.img_url) {
            // 隐藏地图
            this.mapIsShow = false;
            // 添加轮播图片
            this.swiperImgList = JSON.parse(point.img_url);
            // 展示轮播容器
            this.swiperIsShow = true;
            // 设置轮播图属性
            this.swiperBox.slideTo(0, 1000, false);
         }

         // 过滤当前总区的子区
         let selectList = this.assetPointList.filter((item) => {
            return item.area_parent_id == point.area_id;
         });

         // 储存下拉框数据
         let _areaSelectList = [];
         // 处理下拉框数据
         selectList.forEach((item) => {
            _areaSelectList.push({
               label: item.area_type,
               value: item.area_id,
            });
         });
         // 调换全区顺序
         _areaSelectList.map((item, index) => {
            if (item.label == "全区") {
               _areaSelectList.unshift(_areaSelectList.splice(index, 1)[0]);
            }
         });

         // 重置下拉框
         this.areaSelectList = _areaSelectList;
         this.areaSelect = _areaSelectList[0].value;

         // 触发逻辑控制
         window.eventCenter?.triggerEvent &&
            window.eventCenter.triggerEvent(this.componentId, "clickMarker", {
               id: point.area_id,
               area: point.area_type,
            });
      },

      // 切换区域
      changeArea(areaId) {
         let areaData = this.assetPointList.filter((item) => {
            return item.area_id == areaId;
         });

         // 赋值标题
         this.gisTitle = areaData[0].area_name;
         // 赋值简介文本
         this.introduceText = areaData[0].content;

         // 替换轮播图
         if (areaData[0].img_url) {
            // 隐藏地图
            this.mapIsShow = false;
            // 添加轮播图片
            this.swiperImgList = JSON.parse(areaData[0].img_url);
            // 展示轮播容器
            this.swiperIsShow = true;
            // 设置轮播图属性
            this.swiperBox.slideTo(0, 1000, false);
         }

         window.eventCenter?.triggerEvent &&
            window.eventCenter.triggerEvent(this.componentId, "clickMarker", {
               id: areaData[0].area_id,
               area: areaData[0].area_type,
            });
      },

      // 总览按钮
      overView() {
         // 打开下拉框
         this.selectIsShow = false;

         // 清空轮播图
         this.mapIsShow = true;
         this.swiperIsShow = false;
         this.swiperImgList = [];

         // 过滤 id = -1 的数据
         let initial = this.assetPointList.filter((item) => {
            return item.area_id == "-1";
         });
         this.gisTitle = initial[0].area_name;
         this.introduceText = initial[0].content;

         // 下拉框重新赋值
         this.areaSelectList = [{ label: "全区", value: "-1" }];
         this.areaSelect = "全区";

         // 关闭坐标点激活状态
         if (this.markerActive) {
            let markerActive = this.markerActive.target;
            markerActive.setIcon(this.getIconImg("", false));
            this.markerActive = null;
         }

         window.eventCenter?.triggerEvent &&
            window.eventCenter.triggerEvent(this.componentId, "clickMarker", {
               id: "-1",
               area: "全区",
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
         let icon = type ? serviceAreaActive : serviceAreaDefault;
         // 创建图片
         let markerIcon = new AMap.Icon({
            image: icon,
            imageSize: new AMap.Size(25, 35),
         });
         // 返回处理过的图片
         return markerIcon;
      },

      // 注册组件
      Event_Center_getName() {
         return "服务经营GIS";
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
