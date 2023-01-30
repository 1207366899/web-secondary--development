import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryLeftData = (params) => request.get(`/ext/PandectPage/queryLeftData?stationId=${params.stationId}`);
export const queryPowerData = (params) => request.get(`/ext/PandectPage/queryPowerData?stationId=${params.stationId}&time=${params.time}`);
export const queryGeneratingCapacity = (params) => request.get(`/ext/PandectPage/queryGeneratingCapacity?stationId=${params.stationId}&time=${params.time}`);
export const queryApplyTable = (data) => request.post(`/form/list/model/data/queryData?modelId=${data.modelId}`, data.data);
export const queryViewTableInfo = (params) => request.get(`/form/list/model/queryById?modelId=${params.modelId}`);
export const longitudeAndLatitude = (params) => request.get(`/ext/PandectPage/longitudeAndLatitude?stationId=${params.stationId}`);
export const getWeather = (data) => request.post(`/ext/PandectPage/getWeather`,data);
export const buttonUpdateDataList = (data) => request.post(`/form/buttonUpdateDataList?form_id=${data.params.form_id}`, data.data);
