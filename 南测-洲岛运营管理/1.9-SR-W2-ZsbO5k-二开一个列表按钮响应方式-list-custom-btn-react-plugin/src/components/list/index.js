import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Modal, Button } from "antd";
import { getAssetJSONForProduct } from "./../../api/asset";
import qs from "qs";
import "./index.less";

const List = ({ dataSource, customParams, dataId, deleteData }) => {
  let { filedNo, appFiledName } = customParams;
  const changeAppVariables = window["APP_SDK_FUNCTION"][qs.parse(window?.location.search.split("?")[1])?.appid].changeAppVariables || new Function();

  useEffect(() => {
    let message = {
      [appFiledName]: dataSource[Number(filedNo) - 1].value.value,
    };
    console.log(message, changeAppVariables);
    window["APP_SDK_FUNCTION"][qs.parse(window?.location.search.split("?")[1])?.appid].changeAppVariables && changeAppVariables(message);
  }, []);

  return <></>;
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
