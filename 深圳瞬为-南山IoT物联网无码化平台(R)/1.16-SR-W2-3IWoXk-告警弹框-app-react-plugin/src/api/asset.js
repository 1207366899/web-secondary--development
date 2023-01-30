import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id, count = 200) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, { filters: [] });



/**
 * 查询信息
 * @param id 资产ID
 */
export const queryMessage = id =>
  request.get(`/remind/queryRemindData?userId=${id}`);

/**
 * 查询信息
 * @param id 资产ID
 */
export const getWarning = id =>
  request.get(`/yidong/getWarning`);



export const queryData = (data) => request.post(`/form/list/model/data/queryData?modelId=${data.params.modelId}`, data.data);
export const queryById = (data) => request.get(`/form/list/model/queryById?modelId=${data.params.modelId}`);