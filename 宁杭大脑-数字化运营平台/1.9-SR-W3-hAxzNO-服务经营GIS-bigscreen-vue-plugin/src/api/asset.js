import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}`, { filters: [] });

export const getApi = () => request.get(`/system/config/queryConfigWithoutToken?type=ning_hang`);

export const queryApi = (url, dataForm) => request.post(`${url}`, dataForm ? dataForm : { param: {} });
