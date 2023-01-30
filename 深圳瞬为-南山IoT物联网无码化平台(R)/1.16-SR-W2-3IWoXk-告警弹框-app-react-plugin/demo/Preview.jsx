import React from "react";
import App from "../src/App";

const AnalyzerComponent = (props) => {
  const customConfig = {
    title: "数据构建",
    desc: "无码化应用搭建，弹指间即完成数据从无到有到收集和使用",
    url: "http://baidu.com",
    imgUrl:
      "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
  };
  return <App {...customConfig}></App>;
};

AnalyzerComponent.propTypes = {};

export default AnalyzerComponent;
