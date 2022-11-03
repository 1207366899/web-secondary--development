import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id) =>
  request.post(`/asset/getAssetData?asset_id=${id}`, []);
// 查询数据接口
export const queryMonth = (params) =>
  request.post(`/electricitySettlement/query`, params);
// 导出
export const exportTable = (params) =>
  request.post(`/electricitySettlement/export`, params);
