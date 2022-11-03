import React, { Component } from "react";
import moment from "moment";
import { Button, Radio, DatePicker, ConfigProvider, Table, message } from "antd";
import "moment/locale/zh-cn";
import "./app.less";
import zhCN from "antd/lib/locale/zh_CN";
import { queryMonth } from "./api/asset";
import axios from "axios";

const options = [
  {
    label: "月报",
    value: "month",
  },
  {
    label: "年报",
    value: "year",
  },
];
const monthColumns = [
  {
    title: "月份",
    dataIndex: "date",
    width: "10%",
    // render: (text) => <a>{text}</a>,
    align: "center",
  },
  {
    title: () => (
      <span>
        发电量
        <br />
        (万kWh)
      </span>
    ),
    className: "column-money",
    dataIndex: "powerOutput",
    align: "center",
    render: (text) => <span>{text.toFixed(2)}</span>,
    sorter: (a, b) => a.money - b.money,
  },
  {
    title: () => (
      <span>
        上网电量
        <br />
        (万kWh)
      </span>
    ),
    dataIndex: "powerOngrid",
    align: "center",
    render: (text) => <span>{text.toFixed(2)}</span>,
    sorter: (a, b) => a.money - b.money,
  },
  {
    title: () => (
      <span>
        自发自用电量
        <br />
        (万kWh)
      </span>
    ),
    dataIndex: "powerSelfuse",
    align: "center",
    render: (text) => <span>{text.toFixed(2)}</span>,
    sorter: (a, b) => a.money - b.money,
  },
  {
    title: () => (
      <span>
        自发自用电费
        <br />
        (万元)
      </span>
    ),
    dataIndex: "feesSelfuse",
    align: "center",
    render: (text) => <span>{text.toFixed(2)}</span>,
    sorter: (a, b) => a.money - b.money,
  },
];
const yearColumns = [
  {
    title: "年份",
    dataIndex: "date",
    width: "10%",
    // render: (text) => <a>{text}</a>,
    align: "center",
  },
  {
    title: () => (
      <span>
        发电量
        <br />
        (万kWh)
      </span>
    ),
    className: "column-money",
    dataIndex: "powerOutput",
    align: "center",
    render: (text) => <span>{text.toFixed(2)}</span>,
    sorter: (a, b) => a.money - b.money,
  },
  {
    title: () => (
      <span>
        上网电量
        <br />
        (万kWh)
      </span>
    ),
    dataIndex: "powerOngrid",
    align: "center",
    render: (text) => <span>{text.toFixed(2)}</span>,
    sorter: (a, b) => a.money - b.money,
  },
  {
    title: () => (
      <span>
        自发自用电量
        <br />
        (万kWh)
      </span>
    ),
    dataIndex: "powerSelfuse",
    align: "center",
    render: (text) => <span>{text.toFixed(2)}</span>,
    sorter: (a, b) => a.money - b.money,
  },
  {
    title: () => (
      <span>
        自发自用电费
        <br />
        (万元)
      </span>
    ),
    dataIndex: "feesSelfuse",
    align: "center",
    render: (text) => <span>{text.toFixed(2)}</span>,
    sorter: (a, b) => a.money - b.money,
  },
];

export default class App extends Component {
  componentDidMount() {
    const events = [
      {
        key: "jumpButton",
        name: "跳转按钮",
        payload: [],
      },
    ];

    const actions = [
      {
        key: "queryData",
        name: "查询数据",
        params: [{ name: "id", dataType: "string", key: "id" }],
      },
    ];
    this.props?.customConfig?.componentId &&
      window.componentCenter?.register(this.props?.customConfig?.componentId, "", this, {
        events,
        actions,
      });

    this.setState(
      {
        firstDate: moment().startOf("year"),
        secondDate: moment(),
      },
      () => this.queryData()
    );
    // this.do_EventCenter_queryData();
    // window.componentCenter.registerTriggerForType(
    //   this.props.componentId,
    //   "process",
    //   this,
    //   {
    //     events,
    //     actions,
    //   }
    // );
    console.log(document.getElementsByClassName("ant-picker-input")[0].innerHTML);
  }
  state = {
    id: undefined,
    dataSource: [],
    //服务单位
    // customerServiceUnit: "",
    tabValue: "month",
    firstDate: undefined,
    secondDate: undefined,
  };
  goToStudy = () => {
    this.props?.customConfig?.url && window.open(this.props?.customConfig?.url);
  };

  do_EventCenter_queryData({ id }) {
    console.log("id: ", id);
    //目录点击操作
    this.setState({ id }, () => {
      this.queryData();
    });
  }

  // 逻辑控制用，不可删
  Event_Center_getName() {
    return "月报";
  }
  queryData = async () => {
    const { tabValue, id, firstDate, secondDate } = this.state;
    if (tabValue === "month" && id) {
      let first = "";
      let second = "";
      if (firstDate) {
        first = moment(firstDate).format("YYYY-MM");
      }
      if (secondDate) {
        second = moment(secondDate).format("YYYY-MM");
      }
      let date = [];
      if (first) date.push(first);
      if (second) date.push(second);
      if (date.length === 2) {
        const { data } = await queryMonth({
          type: tabValue,
          date,
          customerServiceUnitId: id,
        });
        this.setState({
          name: data.customerServiceUnit,
          dataSource: data.propertyList,
        });
      }
    }
    if (tabValue === "year" && id) {
      const { data } = await queryMonth({
        type: tabValue,
        date: [],
        customerServiceUnitId: id,
      });
      this.setState({
        name: data.customerServiceUnit,
        dataSource: data.propertyList,
      });
    }
  };
  // tab切换方法
  onChangeTabValue = ({ target: { value } }) => {
    this.setState({ dataSource: [] }, () => {
      this.setState({ tabValue: value }, () => this.queryData());
    });
  };
  //表格头部渲染
  titleRenderer = () => {
    return (
      <>
        <div className="title">服务单位</div>
        <div className="content">{this.state.name}</div>
      </>
    );
  };
  // 第一个日期框选择方法
  onFirstDatePickerChange = (value) => {
    this.setState({ firstDate: value }, () => this.queryData());
    // 查询方法
  };
  //第二个日期框选择方法
  onSecondDatePickerChange = (value) => {
    this.setState({ secondDate: value }, () => this.queryData()); // 查询方法
  };
  disabledStartDate = (firstDate ) => {
    const { secondDate } = this.state;
    if (!firstDate || !secondDate) {
      return false;
    }
    return firstDate.valueOf() > secondDate.valueOf();
  };
  disabledEndDate = (secondDate ) => {
    const { firstDate } = this.state;
    if (!secondDate || !firstDate) {
      return false;
    }
    return secondDate.valueOf() <= firstDate.valueOf();
  };
  // 导出方法
  onExportClick = () => {
    const { tabValue, id, firstDate, secondDate } = this.state;
    let date = [];
    let fineName = tabValue === "month" ? "月报" : "年报";
    if (tabValue === "month") {
      let first = "";
      let second = "";
      if (firstDate) {
        first = moment(firstDate).format("YYYY-MM");
      }
      if (secondDate) {
        second = moment(secondDate).format("YYYY-MM");
      }
      if (first) date.push(first);
      if (second) date.push(second);
      if (date.length !== 2) {
        message.warning("请选择日期");
        return;
      }
    }
    axios
      .post(
        "/sdata/rest/electricitySettlement/export",
        {
          type: tabValue,
          customerServiceUnitId: id,
          date,
        },
        {
          responseType: "blob",
        }
      )
      .then((res) => {
        const url = window.URL.createObjectURL(
          new Blob([res.data], {
            type: "application/vnd.ms-excel",
          })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fineName);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        message.error(error || "下载数据失败！");
      });
  };
  render() {
    const { tabValue, dataSource, firstDate, secondDate } = this.state;
    return (
      <ConfigProvider locale={zhCN}>
        <div className="allContent" style={{ margin: 8 }}>
          <div className="tabs">
            <Radio.Group options={options} onChange={this.onChangeTabValue} value={tabValue} optionType="button" />
          </div>
          <div className="fitlersAndExport">
            {tabValue === "month" && (
              <div className="datePicks">
                {" "}
                选择月份:&nbsp;&nbsp;
                <DatePicker
                  disabledDate={this.disabledStartDate}
                  value={firstDate}
                  style={{ marginLeft: 6 }}
                  picker="month"
                  onChange={(e) => this.onFirstDatePickerChange(e)}
                />{" "}
                <img src={require("./日期标准.png").default} className="riliIcon1"></img>
                <span style={{ margin: "0px 4px" }}>&nbsp;—&nbsp;</span>{" "}
                <DatePicker value={secondDate} picker="month" disabledDate={this.disabledEndDate} onChange={(e) => this.onSecondDatePickerChange(e)} />
                <img src={require("./日期标准.png").default} className="riliIcon2"></img>
              </div>
            )}

            <div className="exportButton">
              <img src={require("./export.png").default} onClick={this.onExportClick} style={{ cursor: "pointer" }}></img>
            </div>
          </div>
          <div className="tableContent">
            <Table columns={tabValue === "month" ? monthColumns : yearColumns} dataSource={dataSource} bordered title={(data) => this.titleRenderer(data)} />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}
