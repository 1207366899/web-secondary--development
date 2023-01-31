/**
 * bigScreen_options: 大屏配置，包含数据列，数据来源类型，展示列
 * bigScreen_data：配置分析、资产、填报、或者表格的数据内容，不含标题
 * return [] 返回根据配置的字段信息的数据内容，
 */
export const normalizeData = (bigScreen_options = {}, bigScreen_data = []) => {
  let data = [];

  if (bigScreen_options?.dataSourceType) {
    // 填报
    const { showColumns = [], columns = [] } = bigScreen_options;
    const dataindex = {};
    columns.forEach((element, i) => {
      dataindex[element] = i;
    });
    let temData = [];

    switch (bigScreen_options.dataSourceType) {
      case 1:
        // 表格
        temData = bigScreen_data;
        break;
      case 2:
        //分析仪
        temData = bigScreen_data.map((v) => {
          let arr = [];
          showColumns.forEach((e) => {
            arr.push(v[dataindex[e]]);
          });
          return arr;
        });

        break;
      case 3:
        temData = bigScreen_data.map((v) => {
          let arr = [];
          showColumns.forEach((e) => {
            arr.push(v[dataindex[e]]);
          });
          return arr;
        });
        break;
      case 4:
        temData = bigScreen_data.map((v) => {
          let arr = [];
          showColumns.forEach((e) => {
            arr.push(v[dataindex[e]]);
          });
          return arr;
        });
        break;
      default:
        break;
    }
    data = temData;
  }
  return data;
};
