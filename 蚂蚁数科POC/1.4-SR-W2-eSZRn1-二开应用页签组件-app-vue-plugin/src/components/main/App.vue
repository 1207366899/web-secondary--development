<template>
  <div :id="id" ref="app-secondary" class="app-secondary">
    <el-tabs tab-position="left" :stretch="true" class="tab_two" @tab-click="testFn" >
      <el-tab-pane v-for="(item, i) in jqReports" :key="i">
        <div slot="label" class="two_label">
          <div class="label_title">
            <div class="label_title_label">{{ item[tab_filed] }}</div>
            <div class="label_title_text">{{ item.tab_describe }}</div>
          </div>
          <div class="label_icon" v-html="item[tab_icon]">
          </div>
          <!-- <div class="label_icon">
            <div class="anticon">
              aaa
            </div>
          </div> -->
        </div>
        <div class="tab_content_two">
          <div class="two_content">
            <div class="two_content_left">
              <img :src="item.details_img" width="100%" height="100%" />
            </div>
            <div class="two_content_right">
              <div class="content_right_top">
                <div class="content_right_title">
                  <div class="content_title_two"> {{ item.details_title }}</div>
                  <el-tag v-show="item.details_type" type="warning">{{ item.details_type }}</el-tag>
                </div>
                <div class="content_right_content">{{ item.details_content }}</div>
              </div>
              <div class="content_right_bottom">
                <div class="content_bottom_itme">
                  <div class="content_bottom_itme_title">治理全景</div>
                  <div class="content_bottom_itme_content">{{ item.details_panorama }}</div>
                </div>
                <div class="content_bottom_itme">
                  <div class="content_bottom_itme_title">基础信息治理</div>
                  <div class="content_bottom_itme_content">{{ item.details_basics }}</div>
                </div>
                <div class="content_bottom_itme">
                  <div class="content_bottom_itme_title">应用架构治理</div>
                  <div class="content_bottom_itme_content">{{ item.details_framework }}</div>
                </div>
                <div class="content_bottom_itme">
                  <div class="content_bottom_itme_title">风险治理</div>
                  <div class="content_bottom_itme_content">{{ item.details_risk }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

    </el-tabs>

    <div class="test"></div>
  </div>
</template>

<script>
import { queryAssetById } from '../../api/asset'
import {
  Tabs,
  TabPane, Tag
} from "element-ui";
import Vue from "vue";
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
export default {
  name: "Main",
  props: {
    customConfig: Object,
    info: Object,
    //应用变量和系统变量 2022.7.26 V8R4C50SPC220需求新加 之前版本取不到appVariables和sysVariables
    appVariables: Array,
    sysVariables: Array,
    //2022.8.11 V8R4C60SPC100需求新加，之前版本取不到themeInfo
    themeInfo: Object,
    //2022.10新加，之前取不到国际化方法
    intlGetKey: Function,
    history: Object,
    mainInit: Function
  },
  computed: {
    assetId() {
      let assetId = this.customConfig?.assetId || '56d40c1b-89b5-46d4-bc2e-94dc7d958b5b'
      return assetId
    },
    tab_filed() {
      let tab_filed = this.customConfig?.tab_filed || 'tab_filed'
      return tab_filed
    },
    tab_icon() {
      let tab_icon = this.customConfig?.tab_icon || 'tab_icon'
      return tab_icon
    },
  },
  data() {
    return {
      //必需，不可删除
      id: "",
      jqReports: []
    };
  },
  mounted() {
    //此方法封装了事件注册，不可删除
    this.mainInit(this);
    queryAssetById(this.assetId).then(res => {
      let a = this.Processing(res.data)
      this.jqReports = JSON.parse(JSON.stringify(a))
      let tempData = []
      this.jqReports.forEach(x => {
        x.tab_icon = x.tab_icon && JSON.parse(x.tab_icon)?.html
        // x[this.imgField] = x[this.imgField] && JSON.parse(x[this.imgField])[0]?.url
        // x[this.videoField] = x[this.videoField] && JSON.parse(x[this.videoField])[0]?.url
        // if (x[this.imgField]) tempData.push(x)
      })
      tempData=JSON.parse(JSON.stringify(this.jqReports))

      tempData.sort((a, b) => {
        return new Date(b.create_time) - new Date(a.create_time)
      })
      this.jqReports = tempData.splice(0, 4)
      console.log(this.jqReports, '1==============lunb');
    })
    // this.$nextTick(() => {
    //   let a = document.querySelector('.test')
    //   let b = document.querySelector('.el-tabs__active-bar')
    //   let c = document.querySelector('.el-tabs__nav')

    //   let hei = b.clientHeight
    //   console.log(hei, a, '======dome');
    //   c.appendChild(a)
    // })
  },
  methods: {
    testFn() {
      // this.$nextTick(() => {
      //   let a = document.querySelector('.test')
      //   let b = document.querySelector('.el-tabs__active-bar')
      //   let hei = b.clientHeight / 2 - 8
      //   let trans = Number(b.style.transform.replace('translateY', '').replace('(', '').replace(')', '').replace('px', '')) + hei
      //   a.style.transform = `translateY(${trans}px)`
      //   console.log(b, b.style.transform, hei, trans, '======dome');
      // })

    },
    Processing(arr) {
      let headerData = arr[0]
      let bodyData = arr[1]
      // console.log(headerData);
      let tableData = bodyData.map(x => {
        let ret = {};
        x.forEach((item, index) => {
          ret[headerData[index].col_name] = item;
        });
        return ret
      })
      return tableData


    },
    /**
     * 封装的触发事件方法 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Object} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      let { componentId, appId } = this.customConfig || {};
      componentId && appId && window.eventCenter?.triggerEvent(
        componentId,
        eventName,
        payload
      );
    },
    //必需，不可删除
    Event_Center_getName() {
      return this.id;
    }
  },
  beforeDestroy() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  }
};
</script>

<style lang="less" scoped>
.app-secondary {
  /deep/.el-tabs__active-bar {
    background-color: #274ea7;
    width: 3px;
    // background-image: url('../../api/image/jiantou.png');
    // background-repeat: no-repeat;
    &::before{
      content: '';
      // border: 8px solid transparent;
      background: url('../../api/image/jiantou.png') no-repeat;
    // border-left-color: #274ea7;
    width: 24px;
    height: 80px;
    position: absolute;
    right: -21px;
    left: auto;
    top: 0;
    bottom: auto;
    transform: translateY(21px);
    }
  }

  /deep/.el-tabs__nav-scroll {
    overflow: visible;
  }

  /deep/.el-tabs__nav-wrap {
    overflow: visible;
  }

  /deep/.el-tabs__active-bar::after {
   
  }
  /deep/.el-tabs__item {
    &:hover {
      color: #274ea7;

      .label_icon .anticon {
        color: #274ea7 !important;
        // color: yellow;
      }
    }
  }

  .tab_two {
    .two_label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // width: 190px;

      .label_title_label {
        font-weight: 700;
        font-size: 18px;
        line-height: 34px;
        padding: 5px 0;
      }

      .label_title_text {
        min-width: 130px;
        line-height: 25px;
        font-size: 14px;
      }

      .label_icon {
        margin-left: 28px;
    margin-right: 18px;
        .anticon {
          font-size: 54px !important;

          &:hover {
            color: #274ea7;
          }
        }
      }

      &:hover {
        color: #274ea7;
      }
    }

    /deep/.is-active {
      color: #274ea7 !important;

      .two_label {
        .label_icon {
          .anticon {
            color: #274ea7 !important;
          }
        }
      }
    }

    /deep/ .el-tabs__item {
      height: auto;
      line-height: 1;
      min-height: 40px;
      padding: 22px 20px;
    }

    .tab_content_two {
      padding: 0 20px;
      padding-left: 35px;

      .two_content {
        border: 1px solid rgb(224, 224, 224);
        border-radius: 5px;
        background: #fff;
        display: flex;
        // min-height: 400px;
        padding: 52px  66px;
        box-shadow: 0px 10px 20px rgba(3, 71, 204, 0.1);
border-radius: 8px;
        .two_content_right {
          padding: 0 0px 0px 42px;
          box-sizing: content-box;
          flex: 1;

          .content_right_title {
            display: flex;
            justify-content: space-between;

            .content_title_two {
              font-weight: 700;
              font-size: 24px;
            }
            /deep/.el-tag--warning{
              background: rgba(227, 126, 94, 0.12);
              color: #E37E5E;
              padding: 0 20px;
            }
          }


          .content_right_top {
            .content_right_content {
              padding: 20px 0 40px 0;
              border-bottom: 2px solid rgb(224, 224, 224);
              color: #626973;
              font-size: 16px;
line-height: 22px;
            }
          }

          .content_right_bottom {
            padding-top: 40px;

            .content_bottom_itme {
              display: flex;
              // padding-bottom: 8px;
              .content_bottom_itme_title {
                min-width: 130px;
                color: #959CA6;
                font-size: 18px;
                line-height: 32px;
              }
              .content_bottom_itme_content {
                color: #274ea7;
                font-size: 18px;
                line-height: 32px;
              }
            }
          }
        }
      }

    }

    .two_content_left {
      width: 310px;
      height: 392px;
    }
  }

  .test {
    border: 8px solid transparent;
    border-left-color: #274ea7;
    position: absolute;
    right: -16px;
    left: auto;
    top: 0;
    bottom: auto;
    transform: translateY(21px);
  }
/deep/.el-tabs--left .el-tabs__nav-wrap.is-left::after, .el-tabs--left .el-tabs__nav-wrap.is-right::after, .el-tabs--right .el-tabs__nav-wrap.is-left::after, .el-tabs--right .el-tabs__nav-wrap.is-right::after{
  height: 492px;
}
}
</style>