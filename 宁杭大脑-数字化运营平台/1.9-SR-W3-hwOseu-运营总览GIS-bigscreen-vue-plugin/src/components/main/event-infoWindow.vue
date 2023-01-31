<template>
   <div>
      <!-- 小图标 -->
      <div class="small_icon_list">
         <div>
            <img v-if="eventInfoData.videoIcon == '1'" @click="clickVideoIcon" style="cursor: pointer" src="../../assets/监控-激活.png" alt="" />
            <img v-if="eventInfoData.videoIcon == '2'" @click="stopClick" src="../../assets/监控-置灰.png" alt="" />
         </div>
         <div>
            <img v-if="eventInfoData.wreckerIcon == '1'" @click="clickWreckerIcon" style="cursor: pointer" src="../../assets/清障车-激活.png" alt="" />
            <img v-if="eventInfoData.wreckerIcon == '2'" @click="stopClick" src="../../assets/清障车-置灰.png" alt="" />
         </div>
         <div>
            <img v-if="eventInfoData.infoboardIcon == '1'" @click="clickBorardIcon" style="cursor: pointer" src="../../assets/情报板-激活.png" alt="" />
            <img v-if="eventInfoData.infoboardIcon == '2'" @click="stopClick" src="../../assets/情报板-置灰.png" alt="" />
         </div>
      </div>
      <div class="infowindow_outermast" v-if="infoWindowIsShow">
         <div class="infoWindow_title">{{ eventInfoData.name }}</div>
         <div class="infoWindow_line"></div>
         <div class="info_title" v-if="eventInfoData.processList && eventInfoData.processList.length">
            <div class="title_garden"></div>
            过程总览
         </div>
         <!-- 横向时间轴 -->
         <div class="info_transverse" v-if="eventInfoData.processList && eventInfoData.processList.length">
            <div class="time_transverse">
               <div v-for="(item, index) in eventInfoData.processList" :key="index">
                  <div class="transverse_line" :style="`width: ${100 / eventInfoData.processList.length}%`">
                     <div class="contant_top">
                        <div class="top_time">{{ item.duration }}</div>
                     </div>
                     <div class="transverse_circular_outer">
                        <div v-if="item.iconStyle == 'white'" class="circular_outer_white"></div>
                        <div v-if="item.iconStyle == 'redSolid'" class="circular_outer_redSolid"></div>
                        <div v-if="item.iconStyle == 'redBorder'" class="circular_outer_redBorder"></div>
                     </div>
                     <div class="contant_bottom">
                        <div class="bottom_type">{{ item.stepName }}</div>
                        <div class="bottom_time">{{ item.time }}</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <!-- 事件信息 -->
         <div class="info_event">
            <!-- 事件详情 -->
            <div class="info_box">
               <div class="event_title">
                  <div class="title_garden"></div>
                  事件详情
               </div>
               <!-- 交通事故 -->
               <div class="event_box" v-if="eventInfoData.name == '交通事故'">
                  <div class="box_line">
                     <div class="box_field">事发时间：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.eventTime" placement="top">
                        <div class="box_content">{{ eventInfoData.info.eventTime }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">路段：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.section" placement="top">
                        <div class="box_content">{{ eventInfoData.info.section }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">桩号：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.stake" placement="top">
                        <div class="box_content">{{ eventInfoData.info.stake }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">交换事故形态：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.accidentType" placement="top">
                        <div class="box_content">{{ eventInfoData.info.accidentType }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">应急资源：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.emergentResource" placement="top">
                        <div class="box_content">{{ eventInfoData.info.emergentResource }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">人员伤亡：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.deathFlag" placement="top">
                        <div class="box_content">{{ eventInfoData.info.deathFlag }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">简报：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.briefReport" placement="top">
                        <div class="box_content">{{ eventInfoData.info.briefReport }}</div>
                     </el-tooltip>
                  </div>
               </div>
               <!-- 清障救援 -->
               <div class="event_box" v-if="eventInfoData.name == '清障救援'">
                  <div class="box_line">
                     <div class="box_field">清障类型：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.rescueType" placement="top">
                        <div class="box_content">{{ eventInfoData.info.rescueType }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">事发时间：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.eventTime" placement="top">
                        <div class="box_content">{{ eventInfoData.info.eventTime }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">路段：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.section" placement="top">
                        <div class="box_content">{{ eventInfoData.info.section }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">桩号：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.stake" placement="top">
                        <div class="box_content">{{ eventInfoData.info.stake }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">涉及重要位置：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.importantPos" placement="top">
                        <div class="box_content">{{ eventInfoData.info.importantPos }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">事件描述：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.eventRemark" placement="top">
                        <div class="box_content">{{ eventInfoData.info.eventRemark }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">简报：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.briefReport" placement="top">
                        <div class="box_content">{{ eventInfoData.info.briefReport }}</div>
                     </el-tooltip>
                  </div>
               </div>
               <!-- 道口操作 -->
               <div class="event_box" v-if="eventInfoData.name == '道口操作'">
                  <div class="box_line">
                     <div class="box_field">路段：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.section" placement="top">
                        <div class="box_content">{{ eventInfoData.info.section }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">封闭时间：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.closeTime" placement="top">
                        <div class="box_content">{{ eventInfoData.info.closeTime }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">预计开道：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.preOpenTime" placement="top">
                        <div class="box_content">{{ eventInfoData.info.preOpenTime }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_field_colse" style="color: #b9e8ffb2">关闭的道口：</div>
                  <div v-if="eventInfoData.closeJunctionList">
                     <div v-for="(item, index) in eventInfoData.closeJunctionList" :key="index" class="box_line">
                        <div class="box_field_road">
                           {{ index + 1 }}、
                           <el-tooltip effect="dark" :content="item" placement="top">
                              <div class="box_content">{{ item }}</div>
                           </el-tooltip>
                        </div>
                     </div>
                  </div>
                  <div class="box_line">
                     <div class="box_field">事件描述：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.eventRemark" placement="top">
                        <div class="box_content">{{ eventInfoData.info.eventRemark }}</div>
                     </el-tooltip>
                  </div>
               </div>
               <!-- 施工作业 -->
               <div class="event_box" v-if="eventInfoData.name == '施工作业'">
                  <div class="box_line">
                     <div class="box_field">施工类型：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.type" placement="top">
                        <div class="box_content">{{ eventInfoData.info.type }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">预计开始时间：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.preStartTime" placement="top">
                        <div class="box_content">{{ eventInfoData.info.preStartTime }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">预计结束时间：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.preEndTime" placement="top">
                        <div class="box_content">{{ eventInfoData.info.preEndTime }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">路段：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.section" placement="top">
                        <div class="box_content">{{ eventInfoData.info.section }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">桩号：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.stake" placement="top">
                        <div class="box_content">{{ eventInfoData.info.stake }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">涉及重要位置：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.importantPos" placement="top">
                        <div class="box_content">{{ eventInfoData.info.importantPos }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">施工分类：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.sort" placement="top">
                        <div class="box_content">{{ eventInfoData.info.sort }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">施工内容：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.content" placement="top">
                        <div class="box_content">{{ eventInfoData.info.content }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">事件描述：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.briefReport" placement="top">
                        <div class="box_content">{{ eventInfoData.info.briefReport }}</div>
                     </el-tooltip>
                  </div>
               </div>
               <!-- 预警 -->
               <div class="event_box" v-if="eventInfoData.name == '预警'">
                  <div class="box_line">
                     <div class="box_field">事发时间：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.eventTime" placement="top">
                        <div class="box_content">{{ eventInfoData.info.eventTime }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">路段：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.section" placement="top">
                        <div class="box_content">{{ eventInfoData.info.section }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">桩号：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.stake" placement="top">
                        <div class="box_content">{{ eventInfoData.info.stake }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">影响里程：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.affectDistance" placement="top">
                        <div class="box_content">{{ eventInfoData.info.affectDistance }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">天气特情：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.weatherInfo" placement="top">
                        <div class="box_content">{{ eventInfoData.info.weatherInfo }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">预计恢复时间：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.preRecoverTime" placement="top">
                        <div class="box_content">{{ eventInfoData.info.preRecoverTime }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">事件描述：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.briefReport" placement="top">
                        <div class="box_content">{{ eventInfoData.info.briefReport }}</div>
                     </el-tooltip>
                  </div>
               </div>
               <!-- 信息发布 -->
               <div class="event_box" v-if="eventInfoData.name == '信息发布'">
                  <div class="box_line">
                     <div class="box_field">情报板编号：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.boardNum" placement="top">
                        <div class="box_content">{{ eventInfoData.info.boardNum }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">发布时间：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.publishTime" placement="top">
                        <div class="box_content">{{ eventInfoData.info.publishTime }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">关联事件编号：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.relatedEventNo" placement="top">
                        <div class="box_content">{{ eventInfoData.info.relatedEventNo }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">发布内容：</div>
                  </div>
                  <div v-if="eventInfoData.info.content" class="release_content">
                     {{ eventInfoData.info.content }}
                  </div>
               </div>
               <!-- 障碍物 -->
               <div class="event_box" v-if="eventInfoData.name == '障碍物'">
                  <div class="box_line">
                     <div class="box_field">事发时间：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.eventTime" placement="top">
                        <div class="box_content">{{ eventInfoData.info.eventTime }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">路段：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.section" placement="top">
                        <div class="box_content">{{ eventInfoData.info.section }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">桩号：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.stake" placement="top">
                        <div class="box_content">{{ eventInfoData.info.stake }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">涉及重要位置：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.importantPos" placement="top">
                        <div class="box_content">{{ eventInfoData.info.importantPos }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">处置单位：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.toDoDept" placement="top">
                        <div class="box_content">{{ eventInfoData.info.toDoDept }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">障碍物种类：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.blockType" placement="top">
                        <div class="box_content">{{ eventInfoData.info.blockType }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">事件描述：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.briefReport" placement="top">
                        <div class="box_content">{{ eventInfoData.info.briefReport }}</div>
                     </el-tooltip>
                  </div>
               </div>
               <!-- 恶劣天气 -->
               <div class="event_box" v-if="eventInfoData.name == '恶劣天气'">
                  <div class="box_line">
                     <div class="box_field">事发时间：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.eventTime" placement="top">
                        <div class="box_content">{{ eventInfoData.info.eventTime }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">路段：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.section" placement="top">
                        <div class="box_content">{{ eventInfoData.info.section }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">桩号：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.stake" placement="top">
                        <div class="box_content">{{ eventInfoData.info.stake }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">影响里程：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.affectDistance" placement="top">
                        <div class="box_content">{{ eventInfoData.info.affectDistance }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">天气特情：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.weatherInfo" placement="top">
                        <div class="box_content">{{ eventInfoData.info.weatherInfo }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">预计恢复时间：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.preRecoverTime" placement="top">
                        <div class="box_content">{{ eventInfoData.info.preRecoverTime }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">事件描述：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.briefReport" placement="top">
                        <div class="box_content">{{ eventInfoData.info.briefReport }}</div>
                     </el-tooltip>
                  </div>
               </div>
               <!-- 大流量管控 -->
               <div class="event_box" v-if="eventInfoData.name == '大流量管控'">
                  <div class="box_line">
                     <div class="box_field">事发时间：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.eventTime" placement="top">
                        <div class="box_content">{{ eventInfoData.info.eventTime }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">路段：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.section" placement="top">
                        <div class="box_content">{{ eventInfoData.info.section }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">桩号：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.stake" placement="top">
                        <div class="box_content">{{ eventInfoData.info.stake }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">事件来源：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.source" placement="top">
                        <div class="box_content">{{ eventInfoData.info.source }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">拥堵原因：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.reason" placement="top">
                        <div class="box_content">{{ eventInfoData.info.reason }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">事件描述：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.briefReport" placement="top">
                        <div class="box_content">{{ eventInfoData.info.briefReport }}</div>
                     </el-tooltip>
                  </div>
               </div>
               <!-- 其他 -->
               <div class="event_box" v-if="eventInfoData.name == '其他'">
                  <div class="box_line">
                     <div class="box_field">路段：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.section" placement="top">
                        <div class="box_content">{{ eventInfoData.info.section }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">桩号：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.stake" placement="top">
                        <div class="box_content">{{ eventInfoData.info.stake }}</div>
                     </el-tooltip>
                  </div>
                  <div class="box_line">
                     <div class="box_field">事件描述：</div>
                     <el-tooltip effect="dark" :content="eventInfoData.info.briefReport" placement="top">
                        <div class="box_content">{{ eventInfoData.info.briefReport }}</div>
                     </el-tooltip>
                  </div>
               </div>
            </div>
            <!-- 信息报送 -->
            <div class="info_box">
               <div class="event_title">
                  <div class="title_garden"></div>
                  信息报送
               </div>
               <div class="event_timeLine">
                  <div class="no_data" v-if="!eventInfoData.timeLineList.length">暂无数据</div>
                  <!-- 竖向时间轴 -->
                  <el-timeline v-if="eventInfoData.timeLineList.length">
                     <el-timeline-item placement="top" v-for="(item, index) in eventInfoData.timeLineList" :key="index">
                        <div class="timeline_title">
                           <div>{{ item.stepName }}</div>
                           <div>{{ item.time }}</div>
                        </div>
                        <div class="timeline_content">{{ item.content }}</div>
                        <div class="timeline_img_box">
                           <el-image v-for="(i, e) in item.imgList" :key="e" :src="i" :preview-src-list="item.imgList"></el-image>
                        </div>
                     </el-timeline-item>
                  </el-timeline>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import { usePostApi } from "../../api/asset";

export default {
   props: {
      eventInfoData: Object,
   },

   data() {
      return {
         infoWindowIsShow: true,
      };
   },

   mounted() {
      console.log("eventInfoData--->", this.eventInfoData);
   },

   methods: {
      // 点击视频图标
      async clickVideoIcon(e) {
         e.stopPropagation();
         // 储存接口字段
         let detailsField = "";
         // 获取接口字段
         switch (this.eventInfoData.name) {
            case "交通事故":
               detailsField = "accident_carema";
               break;
            case "清障救援":
               detailsField = "rescue_carema";
               break;
            case "道口操作":
               detailsField = "junction_msgBoard";
               break;
            case "施工作业":
               detailsField = "construct_carema";
               break;
            case "障碍物":
               detailsField = "block_carema";
               break;
            case "恶劣天气":
               detailsField = "weather_carema";
               break;

            case "大流量管控":
               detailsField = "control_carema";
               break;
            case "其他":
               detailsField = "other_carema";
               break;
         }
         // 获取接口
         let detailsApi = await this.$parent.getApiData(detailsField);
         // 获取情报板数据
         await usePostApi(detailsApi.value).then((res) => {
            let videoData = res.data.res.data;
            this.$parent.addVideoMarker(videoData.list);
         });
      },

      // 点击清障车图标
      async clickWreckerIcon(e) {
         e.stopPropagation();

         let detailsApi = await this.$parent.getApiData("rescue_searchWrecker");
         // 获取情报板数据
         await usePostApi(detailsApi.value, { param: { id: this.eventInfoData.id } }).then((res) => {
            let wreckerData = res.data.res.data;
            this.$parent.createMapCanvas(this.eventInfoData, wreckerData);
         });
      },

      // 点击情报板图标
      async clickBorardIcon(e) {
         e.stopPropagation();
         // 储存接口字段
         let detailsField = "";
         // 获取接口字段
         switch (this.eventInfoData.name) {
            case "交通事故":
               detailsField = "accident_msgBoard";
               break;
            case "清障救援":
               detailsField = "rescue_msgBoard";
               break;
            case "道口操作":
               detailsField = "junction_msgBoard";
               break;
            case "施工作业":
               detailsField = "construct_msgBoard";
               break;
            case "障碍物":
               detailsField = "block_msgBoard";
               break;
            case "恶劣天气":
               detailsField = "weather_msgBoard";
               break;
            case "大流量管控":
               detailsField = "control_msgBoard";
               break;
            case "其他":
               detailsField = "other_msgBoard";
               break;
         }

         // 获取接口
         let detailsApi = await this.$parent.getApiData(detailsField);
         // 获取情报板数据
         await usePostApi(detailsApi.value, { param: { id: this.eventInfoData.id } }).then((res) => {
            let infoBoardData = res.data.res.data;
            infoBoardData.levelB = "情报板";
            this.$parent.addInfoBoardMarker(infoBoardData);
         });
      },

      // 阻止事件穿透
      stopClick(e) {
         e.stopPropagation();
      },

      // 关闭弹窗
      coloseInfoWindow() {
         this.infoWindowIsShow = false;
      },
   },
};
</script>

<style lang="less">
// 弹窗样式
.infowindow_outermast {
   position: absolute;
   top: 0;
   color: #fff;
   width: 100%;
   height: 100%;
   padding: 12px;
   box-sizing: border-box;
   background: #030d18cc;
   backdrop-filter: blur(4px);
   // 内容标题
   .infoWindow_title {
      font-size: 14px;
      font-family: PingFang SC;
      color: #b2fffc;
   }
   // 分割线
   .infoWindow_line {
      width: 100%;
      height: 1px;
      margin: 8px 0;
      background: linear-gradient(90deg, #03a8f3 0%, #02aaf500 100%);
   }
   // 内容名称
   .info_title {
      width: 100%;
      color: #b9e8ff;
      font-family: PingFang SC;
      font-weight: medium;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0px;
      text-align: left;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
   }
   // 横向时间轴
   .info_transverse {
      width: 100%;
      height: 64px;
      margin-bottom: 16px;
   }
   // 事件信息
   .info_event {
      width: 100%;
      height: 65%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      // 信息盒子整体
      .info_box {
         width: 48%;
         height: 100%;
      }
      // 信息盒子左侧
      .info_box:first-child {
         margin-right: 12px;
         box-sizing: border-box;
      }
      .info_box:last-child {
         width: 52%;
         box-sizing: border-box;
      }
      // 事件标题
      .event_title {
         color: #b9e8ff;
         font-weight: medium;
         font-size: 12px;
         line-height: 16px;
         letter-spacing: 0px;
         text-align: left;
         margin-bottom: 12px;
         display: flex;
         align-items: center;
      }
      // 事件详情
      .event_box {
         width: 100%;
         height: 90%;
         overflow-y: auto;
         overflow-x: hidden;
         .box_line {
            width: 100%;
            display: flex;
            align-items: center;
            margin-bottom: 8px;
         }
         .box_field,
         .box_field_road,
         .box_field_colse {
            min-width: 60px;
            color: #b9e8ffb2;
            font-size: 12px;
            line-height: 16px;
            text-align: left;
         }
         .box_field_road {
            display: flex;
         }
         .box_field_colse {
            margin-bottom: 8px;
         }
         .box_content {
            min-width: 140px;
            color: #b9e8ff;
            font-size: 12px;
            line-height: 16px;
            text-align: left;
            margin-left: 4px;
         }
         .release_content {
            height: 80px;
            padding: 0 15px;
            background: #000000;
            color: red;
            font-size: 12px;
            letter-spacing: 0px;
            display: flex;
            justify-content: center;
            align-items: center;
         }
      }
      .event_timeLine {
         width: 100%;
         height: 90%;
         overflow-y: auto;
         overflow-x: hidden;
         .el-timeline {
            padding-left: 1px;
         }
         .el-timeline-item__wrapper {
            padding-left: 18px;
         }
         .el-timeline-item__timestamp {
            display: none;
         }
      }

      // 时间轴标题
      .timeline_title {
         display: flex;
         width: 100%;
         height: 24px;
         line-height: 24px;
         padding: 4px;
         border-radius: 2px;
         background: linear-gradient(90deg, #0a2436 0%, #0b1623 100%);
         div:nth-child(1) {
            height: 100%;
            color: #15f6eeb2;
            font-size: 15px;
         }
         div:nth-child(2) {
            height: 100%;
            color: #0e8a8e;
            font-size: 12px;
            margin-left: 15px;
         }
      }
      // 时间轴内容
      .timeline_content {
         margin: 8px 0 8px 8px;
         color: #b9e8ffd8;
         font-size: 12px;
         line-height: 16px;
         letter-spacing: 0px;
         text-align: left;
      }
      // 时间轴图片
      .timeline_img_box {
         width: 100%;
         img {
            width: 48px;
            height: 32px;
            margin-right: 8px;
         }
      }
   }
}

// 横向时间轴
.time_transverse {
   width: 100%;
   height: 100%;
   padding-left: 25px;
   position: relative;
   box-sizing: border-box;
   top: 20px;
   //  时间线
   .transverse_line {
      float: left;
   }
   .transverse_circular_outer {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: #1d2d3d;
      margin-top: -8px;
      z-index: -1;
      position: relative;
   }
   //  节点圆点
   .circular_outer_white,
   .circular_outer_redSolid,
   .circular_outer_redBorder {
      width: 7px;
      height: 7px;
      border-radius: 10px;
      background: #7293a7;
      margin-top: 3px;
      margin-left: 3px;
      z-index: 1;
      border: 1px solid #7293a7;
      position: absolute;
   }
   .circular_outer_redSolid {
      background: #ce5c63;
      border: 1px solid #ce5c63;
   }
   .circular_outer_redBorder {
      border: 1px solid #ce5c63;
   }
   // 上部内容
   .contant_top {
      border-bottom: 1px dashed #4f697b;
      position: relative;
      .top_time {
         color: #b9e8ffd8;
         font-size: 10px;
         line-height: 16px;
         letter-spacing: 0px;
         text-align: center;
         width: 100%;
         position: absolute;
         top: -25px;
         left: 5px;
      }
   }
   // 下部内容
   .contant_bottom {
      position: absolute;
      .bottom_type {
         position: absolute;
         left: -6px;
         top: 4px;
         color: #b9e8ffd8;
         font-size: 10px;
         letter-spacing: 0px;
         text-align: left;
         width: 70px;
      }
      .bottom_time {
         position: absolute;
         color: #b9e8ffd8;
         font-size: 10px;
         line-height: 16px;
         top: 20px;
         left: -8px;
         width: 70px;
      }
   }
}

// 小图标
.small_icon_list {
   div:nth-child(1) {
      position: fixed;
      top: -67px;
      left: -85px;
      width: 28px;
      height: 32px;
   }
   div:nth-child(2) {
      position: fixed;
      top: -75px;
      left: -50px;
      width: 28px;
      height: 32px;
   }
   div:nth-child(3) {
      position: fixed;
      top: -67px;
      left: -14px;
      width: 28px;
      height: 32px;
   }
   img {
      width: 100%;
      height: 100%;
   }
}

// 情报板
.infoWindow_board {
   color: #fff;
   width: 350px;
   padding: 12px;
   box-sizing: border-box;
   background: #030d18cc;
   backdrop-filter: blur(4px);
   // 内容标题
   .infoWindow_title {
      font-size: 14px;
      font-family: PingFang SC;
      color: #b2fffc;
   }
   // 分割线
   .infoWindow_line {
      width: 100%;
      height: 1px;
      margin: 8px 0;
      background: linear-gradient(90deg, #03a8f3 0%, #02aaf500 100%);
   }
   // 情报板
   .info_video {
      width: 100%;
      height: 90px;
      background: #000000;
      color: red;
      font-size: 12px;
      letter-spacing: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 20px;
      box-sizing: border-box;
      div {
         white-space: pre-wrap;
      }
   }
}

// 无数据
.no_data {
   text-align: center;
   font-size: 12px;
   margin-top: 80px;
   color: #a1abb0;
}

// 标题小圆点
.title_garden {
   width: 5px;
   height: 5px;
   background: #b9e8ff;
   border-radius: 50%;
   margin: 0 5px;
}
</style>
