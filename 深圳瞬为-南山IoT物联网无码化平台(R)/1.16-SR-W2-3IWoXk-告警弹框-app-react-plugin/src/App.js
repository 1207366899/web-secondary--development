import React, { Component } from "react";
import { notification, Button } from "antd";
// import appService from "@njsdata/app-sdk";
import { getWarning, queryAssetById, queryData, queryById } from "./api/asset";
import moment from "moment";
import "./app.less";

export default class App extends Component {
  constructor(props) {
    super(props);
    console.log('props', props);
  }
  state = { list: [], buttonTitle: '一键关闭', newProps: {} }
  componentDidMount() {
    notification.config({
      placement: 'bottomRight',
      // maxCount: 2,
    });
    this.intervalId = null;
    this.listTimeOut = []
    let intervalTime = this.props.customConfig.intervalTime ? parseInt(this.props.customConfig.intervalTime) * 1000 : 8000;

    this.props.eventBus.on((newProps) => {
      if (JSON.stringify(this.state.newProps.appVariables || {}) !== JSON.stringify(newProps.appVariables)) {
        this.setState({ newProps })
        if (this.intervalId) {
          this.listTimeOut.forEach(x => {
            clearTimeout(x)
          })
          clearInterval(this.intervalId)
          this.intervalId = null
          this.listTimeOut = []
          notification.destroy()
          this.setState({ list: [] })
        }
        this.myFunction(newProps);
        this.intervalId = setInterval(() => {
          this.myFunction(newProps);
        }, intervalTime);
      }

    })
    const events = [];
    const actions = [];
    this.props?.customConfig?.componentId &&
      window.componentCenter?.register(
        this.props?.customConfig?.componentId,
        "",
        this,
        {
          events,
          actions,
        }
      );

    window.onhashchange = function (e) {
      console.log(e, '===网页变化');
    }
    window.history.pushState = (fn => function pushState() {
      var ret = fn.apply(this, arguments)
      window.dispatchEvent(new Event('pushstate'))
      window.dispatchEvent(new Event('locationchange'))
      return ret
    })(window.history.pushState)

    window.history.replaceState = (fn => function replaceState() {
      var ret = fn.apply(this, arguments)
      window.dispatchEvent(new Event('replacestate'))
      window.dispatchEvent(new Event('locationchange'))
      return ret
    })(window.history.replaceState)

    window.addEventListener('popstate', () => {
      window.dispatchEvent(new Event('locationchange'))
    })

    window.addEventListener('locationchange', () => {
      this.listTimeOut.forEach(x => {
        clearTimeout(x)
      })
      clearInterval(this.intervalId)
      this.intervalId = null
      this.listTimeOut = []
      notification.destroy()
      this.setState({ buttonTitle: '一键开启', list: [] })
      console.log('location changed!')
    })
    // window.componentCenter.registerTriggerForType(
    //   this.props.componentId,
    //   "process",
    //   this,
    //   {
    //     events,
    //     actions,
    //   }
    // );
  }
  //资产数据转对象
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
    tableData.sort((a, b) => {
      return new Date(a.alarm_time) - new Date(b.alarm_time)
    })
    return tableData


  }
  //列表数据转对象
  async formListFn(newProps) {
    const { customConfig, appVariables = [] } = newProps
    const appVariablesSearch = {}
    appVariables.forEach((item, index) => {
      if (item.name == 'parkname') {
        appVariablesSearch.id = item.id;
        appVariablesSearch.variable_name = item.name;
        appVariablesSearch.variable_value = item.default_value;
      }
    });
    let infoById = {
      params: {
        modelId: customConfig.modelId || "09e40afc-666e-47b5-addc-3f864d390366",
      },
    };
    let alarmData = []
    let response = await queryById(infoById)
    let message = {
      params: {
        modelId: customConfig.modelId || "09e40afc-666e-47b5-addc-3f864d390366",
      },
      data: {
        pageSize: 99999,
        pageNum: 1,
        variables: [appVariablesSearch],
        orderBy: "",
        orderSort: "",
      },
    };
    let res = await queryData(message)
    res.data.results.forEach((item, index) => {
      let message = {
      };
      response.data.formListModelComponentList.forEach((itemList, indexList) => {
        if (itemList.componentAlias == "处理进展") {
          item.componentResultList.forEach((compItem, compIndex) => {
            if (compItem.componentId == itemList.componentId) {
              message.alarmStat = compItem.result.value;
            }
          });
        }
        if (itemList.componentAlias == "告警时间") {
          item.componentResultList.forEach((compItem, compIndex) => {
            if (compItem.componentId == itemList.componentId) {
              message.alarmDate = compItem.result.label;
            }
          });
        }
        if (itemList.componentAlias == "告警来源") {
          item.componentResultList.forEach((compItem, compIndex) => {
            if (compItem.componentId == itemList.componentId) {
              message.alarmTypeName = compItem.result.label;
            }
          });
        }
        if (itemList.componentAlias == "所属园区") {
          item.componentResultList.forEach((compItem, compIndex) => {
            if (compItem.componentId == itemList.componentId) {
              message.parkname = compItem.result.label;
            }
          });
        }
        if (itemList.componentAlias == "area") {
          item.componentResultList.forEach((compItem, compIndex) => {
            if (compItem.componentId == itemList.componentId) {
              message.area = compItem.result.label;
            }
          });
        }
        if (itemList.componentAlias == "TSFCC.PRIMARY_KEY") {
          item.componentResultList.forEach((compItem, compIndex) => {
            if (compItem.componentId == itemList.componentId) {
              message.data_id = compItem.result.label;
            }
          });
        }
      });
      alarmData.push(message);
    });
    return alarmData
  }

  myStopFunction = () => {
    console.log('this.intervalId', this.intervalId);
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  myFunction = (newProps) => {
    let intervalTime = this.props.customConfig.intervalTime ? parseInt(this.props.customConfig.intervalTime) * 1000 : 8000;
    // let assetId = this.props.customConfig.assetId || 'd7613878-5368-499e-a4b5-9d2b7434ee33';
    // queryAssetById('e61b519e-16e4-a422-6d5e-ca9c0f6efd3d').then(res => {
    // queryAssetById(assetId).then(res => {
    //   let temp = this.Processing(res.data)
    //   const alarmList = this.state.list
    //   let alarmDa = temp.map(x => {
    //     return {
    //       alarmStat: x.status,
    //       alarmDate: x.alarm_time,
    //       alarmPosition: x.area + x.parkname,
    //       alarmCode: x.alarm_id,
    //       alarmTypeName: x.alarm_source,
    //       data_id: x.data_id
    //     }
    //   })
    //   let resList = []
    //   if (alarmList.length > 0) {
    //     alarmDa.forEach((x, i) => {
    //       alarmList.forEach((y, index) => {
    //         // console.log(y, '====d');
    //         // console.log(x.alarmCode == y.alarmCode && x.alarmDate != y.alarmDate, '======wenjian');
    //         if (x.data_id == y.data_id && x.alarmDate != y.alarmDate) {
    //           resList.push(x)
    //         }
    //       })
    //     })
    //   } else {
    //     resList = alarmDa
    //   }
    //   // if (resList.length > 0) {
    //   //   this.openNotification(resList)
    //   // }
    //   this.setState({ list: alarmDa })
    // }).catch(err => {
    //   this.myStopFunction()
    //   this.intervalId = setInterval(() => {
    //     this.myFunction();
    //   }, intervalTime);
    // })

    this.formListFn(newProps).then(res => {

      const alarmList = this.state.list
      let alarmDa = res.map(x => {
        return {
          alarmStat: x.alarmStat,
          alarmDate: x.alarmDate,
          alarmPosition: x.area + x.parkname,
          // alarmCode: x.alarm_id,
          alarmTypeName: x.alarmTypeName,
          data_id: x.data_id
        }
      })
      alarmDa.sort((a, b) => {
        return a.alarmDate - b.alarmDate
      })
      let resList = []
      if (alarmList.length > 0) {
        alarmDa.forEach((x, i) => {
          alarmList.forEach((y, index) => {
            // console.log(y, '====d');
            // console.log(x.alarmCode == y.alarmCode && x.alarmDate != y.alarmDate, '======wenjian');
            if (x.data_id == y.data_id && x.alarmDate != y.alarmDate) {
              resList.push(x)
            }
          })
        })
      } else {
        resList = alarmDa
      }
      console.log(resList, '====we');
      if (resList.length > 0 && this.state.buttonTitle == '一键关闭') {
        this.openNotification(resList)
      }
      this.setState({ list: alarmDa })
    }).catch(err => {
      this.myStopFunction()
      this.intervalId = setInterval(() => {
        this.myFunction(newProps);
      }, intervalTime);
      console.log(err, '=====err');
    })
  }
  tempClose = (key) => {
    notification.close(key)
  }
  openNotification = (list) => {
    const alarmList = this.state.list

    let duration = parseInt(this.props.customConfig.duration) || null;
    let visibleID = Boolean(this.props.customConfig.visibleID);
    let { styleJosn = '[]' } = this.props.customConfig
    let styleNot = JSON.parse(styleJosn)
    let resList = []
    resList = list.filter(x => {
      return x.alarmStat == '0'
    })
    resList.forEach(x => {
      notification.close(x.data_id)
    })
    // console.log(resList, alarmList, '===========aa');
    // let resList = list?.reverse()
    for (let index = 0; index < resList.length; index++) {
      let sIndex = styleNot.findIndex(x => {
        return x.value == resList[index][x.key]
      })
      let type = sIndex && sIndex != -1 || sIndex === 0 ? styleNot[sIndex]?.type : 'info'
      let style = sIndex && sIndex != -1 || sIndex === 0 ? styleNot[sIndex].style : {}
      let jsCode = () => {
        notification[type || 'info']({
          message: resList[index].alarmTypeName,
          duration: duration,
          style,
          key: resList[index].data_id,
          className: 'two_notification',
          description: <p>状态：{resList[index].alarmStat == "0" ? "报警产生" : "报警消失"}<br />
            时间：{moment(resList[index].alarmDate).format('YYYY-MM-DD HH:mm:ss')}<br />
            地点：{resList[index].alarmPosition}<br />
            {visibleID && `编号:${resList[index].alarmCode} `}  </p>
        });
      }
      this.listTimeOut.push(setTimeout(jsCode, (index * 500)))
      // setTimeout(jsCode, (index * 500))
    }
  };

  componentWillUnmount() {
    console.log('8-组件销毁')
    this.myStopFunction()
    this.listTimeOut.forEach(x => {
      clearTimeout(x)
    })
    clearInterval(this.intervalId)
    this.intervalId = null
    this.listTimeOut = []
    notification.destroy()
    this.setState({ buttonTitle: '一键开启', list: [] })
  }
  closeFn() {
    if (this.state.buttonTitle == '一键关闭') {
      this.listTimeOut.forEach(x => {
        clearTimeout(x)
      })
      clearInterval(this.intervalId)
      this.intervalId = null
      this.myStopFunction()
      this.listTimeOut = []
      notification.destroy()
      this.setState({ buttonTitle: '一键开启', list: [] })
    } else {
      let intervalTime = this.props.customConfig.intervalTime ? parseInt(this.props.customConfig.intervalTime) * 1000 : 8000;
      this.myFunction(this.state.newProps);
      this.intervalId = setInterval(() => {
        this.myFunction(this.state.newProps);
      }, intervalTime);
      this.setState({ buttonTitle: '一键关闭' })
    }

  }
  do_EventCenter_messageSuccess() {
    window.location.reload();
  }

  // 逻辑控制用，不可删
  Event_Center_getName() {
    return "";
  }

  render() {
    const { buttonTitle, visiaButton } = this.state
    return (
      <>{
        <div style={{ position: 'relative', zIndex: 999999 }}>
          <Button onClick={() => { this.closeFn() }} >{buttonTitle}</Button>
        </div>
      }
      </>

    )
  }
}
