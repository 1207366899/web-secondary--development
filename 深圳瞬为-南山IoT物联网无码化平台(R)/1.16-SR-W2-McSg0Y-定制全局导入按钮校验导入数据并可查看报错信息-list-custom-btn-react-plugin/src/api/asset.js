import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const downloadModelApi = (params) => request.get(`/ext/import/excel/file/download`);
