import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { message, Upload, Button, Modal } from "antd";
import { postFile } from './../../api/asset';
import { CloudUploadOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

import './index.less';
const getQueryString = name => {
  const reg = new RegExp(name + "=([^&]*)(&|$)", "i");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return r[1];
  return "";
};
let projectId = getQueryString('zj');
let propsAttr = {
  name: 'file',
  listType: "picture-card",
  action: `/sdata/rest/ext/import/excel/file?projectId=${projectId}`,
  maxCount: 1,
  headers: {
    authorization: 'authorization-text',
  },
  // beforeUpload: (file) => {
  //   let type = file.name.split('.');
  //   let last = type.length - 1;
  //   const isPNG = type[last] === 'xlsx';
  //   if (!isPNG) {
  //     message.error(`${file.name}不是.xlsx文件`);
  //   } else {
  //     setModalTwoVisible(true);
  //     let formData = new FormData();
  //     formData.append("file", file);
  //     postFile(projectId, formData).then(res => {
  //       // console.log('res',res);
  //       let { data } = res;
  //       // message.success(`成功${data.successNum}条，失败${data.errorNum}条`);
  //       setModalTwoVisible(true);
  //     }).catch(err => {
  //       let { data: errData } = err;
  //       // console.log('data', errData);
  //       message.error(`${errData.message}`);
  //     })
  //   }
  //   return false;
  //   // return isPNG || Upload.LIST_IGNORE;
  // },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
const List = (props) => {
  let {
    dataSource,
      customParams,
      dataId,
      deleteData
  } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTwoVisible, setModalTwoVisible] = useState(false);
  const [successData, setSuccessData] = useState({});

  useEffect(() => {
    setModalVisible(true);
    // postFile("001")
  }, [])

  const handleCancel = () => {
    setModalVisible(false);
  }
  const handleCancelTwo = () => {
    setModalTwoVisible(false);
    setModalVisible(false);
  }
  const downLoadHandel = (fileUrl) => {
    window.location.href = fileUrl;
  }

  const handleBeforeUpload = (file) => {
    // beforeUpload: (file) => {
      let type = file.name.split('.');
      let last = type.length - 1;
      const isPNG = type[last] === 'xlsx';
      if (!isPNG) {
        message.error(`${file.name}不是.xlsx文件`);
      } else {
        let formData = new FormData();
        formData.append("file", file);
        postFile(projectId, formData).then(res => {
          let { data } = res;
          setSuccessData(data)
          // message.success(`成功${data.successNum}条，失败${data.errorNum}条`);
          props.handleSearch();
          setModalTwoVisible(true);
        }).catch(err => {
          let { data: errData } = err;
          message.error(`${errData.message}`);
        })
      }
      return false;
      // return isPNG || Upload.LIST_IGNORE;
    // },
  }

  return (
    <div className="pinks">
      <Modal title="导入文件" visible={modalVisible} footer={null} destroyOnClose={true} onCancel={handleCancel} width={960} wrapClassName="tranferModal" getContainer={false}>
        <Upload {...propsAttr} className="uploadBtn" beforeUpload={handleBeforeUpload}>
          <div className='upBox'>
            <CloudUploadOutlined className="upIcon" style={{ fontSize: '40px', marginRight: '30px' }} />
            <span className="upTxt">点击上传文件</span>
          </div>
        </Upload>
      </Modal>
      <Modal title="导入文件" visible={modalTwoVisible} footer={null} destroyOnClose={true} onCancel={handleCancelTwo} width={550} wrapClassName="tranferModalTwo" getContainer={false}>
        {
          successData.errorNum > 0 
          ? 
          <div className="successBox">
            <CloseCircleFilled style={{ fontSize: '40px', marginBottom: '30px', color: "#fe5b5e" }} />
            <div className="suceessTextBox">
              成功导入<span className="suceessText">{successData.successNum}</span>条数据，
              导入失败<span className="errText">{successData.errorNum}</span>条数据
            </div>
              <Button type="primary" style={{ marginTop: '20px' }} onClick={() => { downLoadHandel(successData.fileUrl)}}>导出失败数据</Button>
          </div>
          :
          <div className="successBox">
            <CheckCircleFilled style={{ fontSize: '40px', marginBottom: '30px', color: "#33c5aa" }} />
            <div className="suceessTextBox">
              成功导入<span className="suceessText">{successData.successNum}</span>条数据，
              导入失败<span className="errText">{successData.errorNum}</span>条数据
            </div>
          </div>
        }
      </Modal>
    </div>
  );
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
