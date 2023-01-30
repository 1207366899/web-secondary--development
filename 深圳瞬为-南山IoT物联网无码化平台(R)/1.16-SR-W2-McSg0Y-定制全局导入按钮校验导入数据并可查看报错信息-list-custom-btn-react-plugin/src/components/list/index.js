import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Modal, Button, Input, Upload, message } from "antd";
import { downloadModelApi } from "./../../api/asset";

import "./index.less";

const List = ({ dataSource, customParams, dataId, deleteData }) => {
  const [JsonContent, setJsonContent] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  const [resultValue, setResultValue] = useState("");
  const [resultFile, setResultFile] = useState("");

  useEffect(() => {
    handleClick();
  }, []);

  const handleClick = async () => {
    setModalVisible(true);
  };

  const [modalVisible, setModalVisible] = useState(true);

  const downloadModel = () => {
    downloadModelApi().then((res) => {
      let message = `${window.location.origin}${res.data}`;
      window.open(message);
    });
  };
  const downloadFile = () => {
    let message = `${window.location.origin}${resultFile}`;
    window.open(message);
  };
  const props = {
    name: "file",
    action: "/sdata/rest/ext/import/excel/file",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      console.log(info.file.name);
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        console.log(info.file.response.result);
        message.success("导入成功");
        setResultValue(info.file.response.message);
        setDefaultValue(info.file.name);
        setResultFile(info.file.response.result.fileUrl);
      } else if (info.file.status === "error") {
        message.error("导入失败");
      }
    },
  };
  return (
    <Modal title="导入数据" visible={modalVisible} maxCount={1} footer={null} onCancel={() => setModalVisible(false)} className="tranfer-table-filter-modal  exportEX" width={700}>
      <span>选择文件：</span>
      <Input
        style={{
          width: "calc(100% - 289px)",
        }}
        disabled
        value={defaultValue}
      />
      <Upload {...props} accept=".xlsx,.xls,.xlsm,.xlsb,.xltx,.xltm,.xlt,.xml">
        <Button type="primary">上传文件</Button>
      </Upload>
      <Button onClick={downloadModel} style={{ marginLeft: "15px" }}>
        下载模板
      </Button>
      <br></br>
      <br></br>
      <span>导入结果：</span>
      <div
        style={{
          width: "calc(100% - 200px)",
          height: "80px",
          display: "inline-block",
          border: "1px solid #dedfe0",
          borderRadius: "3px",
        }}
      >
        <span>{resultValue}</span>
        <br></br>
        <span style={{ display: resultValue == "导入失败" ? "table-cell" : "none", textDecoration: "underline", color: "dodgerblue", cursor: "pointer" }} onClick={downloadFile}>
          下载导入失败数据
        </span>
      </div>
    </Modal>
  );
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
