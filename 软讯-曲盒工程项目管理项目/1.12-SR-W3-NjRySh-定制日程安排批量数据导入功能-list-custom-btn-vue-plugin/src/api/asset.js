import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id, count = 200) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, { filters: [] });


/**
* 模板导出
*
*/
export const exportReports = (params) =>
  request.post(`/RXQHBatchInsert/exportExcel`, null, { responseType: 'blob' });
