import request from "./request";

export const getApi = () => request.get(`/system/config/queryConfigWithoutToken?type=ning_hang`);

export const usePostApi = (url, dataForm) => request.post(`${url}`, dataForm ? dataForm : { param: {} });
