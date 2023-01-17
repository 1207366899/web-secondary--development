export const dataSource = [
  ["城市", "经度", "纬度", "种类", "利润", "销售额"],
  ["南京市", "121.204417", "31.14", "A", 100010001000100010001000, 2500],
  ["南通市", "121.186564", "31.885252", "A", 2000, 5000],
  ["无锡市", "121.118758", "31.887438", "A", 3000, 9500],
  ["盐城市", "121.364062", "32.007754", "A", 900, 5200],
  ["南京市", "121.204417", "31.14", "A", 100010001000100010001000, 2500],
  ["南通市", "121.186564", "31.885252", "A", 2000, 5000],
  ["无锡市", "121.118758", "31.887438", "A", 3000, 9500],
  ["盐城市", "121.364062", "32.007754", "A", 900, 5200],
  ["南京市", "121.204417", "31.14", "A", 100010001000100010001000, 2500],
  ["南通市", "121.186564", "31.885252", "A", 2000, 5000],
  ["无锡市", "121.118758", "31.887438", "A", 3000, 9500],
  ["盐城市", "121.364062", "32.007754", "A", 900, 5200],
  ["南京市", "121.204417", "31.14", "A", 100010001000100010001000, 2500],
  ["南通市", "121.186564", "31.885252", "A", 2000, 5000],
  ["无锡市", "121.118758", "31.887438", "A", 3000, 9500],
  ["盐城市", "121.364062", "32.007754", "A", 900, 5200],
  ["南京市", "121.204417", "31.14", "A", 100010001000100010001000, 2500],
  ["南通市", "121.186564", "31.885252", "A", 2000, 5000],
  ["无锡市", "121.118758", "31.887438", "A", 3000, 9500],
  ["盐城市", "121.364062", "32.007754", "A", 900, 5200],
  ["南京市", "121.204417", "31.14", "A", 100010001000100010001000, 2500],
  ["南通市", "121.186564", "31.885252", "A", 2000, 5000],
  ["无锡市", "121.118758", "31.887438", "A", 3000, 9500],
  ["盐城市", "121.364062", "32.007754", "A", 900, 5200],
  ["南京市", "121.204417", "31.14", "A", 100010001000100010001000, 2500],
  ["南通市", "121.186564", "31.885252", "A", 2000, 5000],
  ["无锡市", "121.118758", "31.887438", "A", 3000, 9500],
  ["盐城市", "121.364062", "32.007754", "A", 900, 5200],
  ["南京市", "121.204417", "31.14", "A", 100010001000100010001000, 2500],
  ["南通市", "121.186564", "31.885252", "A", 2000, 5000],
  ["无锡市", "121.118758", "31.887438", "A", 3000, 9500],
  ["盐城市", "121.364062", "32.007754", "A", 900, 5200],
  ["南京市", "121.204417", "31.14", "A", 100010001000100010001000, 2500],
  ["南通市", "121.186564", "31.885252", "A", 2000, 5000],
  ["无锡市", "121.118758", "31.887438", "A", 3000, 9500],
  ["盐城市", "121.364062", "32.007754", "A", 900, 5200],
  ["南京市", "121.204417", "31.14", "A", 100010001000100010001000, 2500],
  ["南通市", "121.186564", "31.885252", "A", 2000, 5000],
  ["无锡市", "121.118758", "31.887438", "A", 3000, 9500],
  ["盐城市", "121.364062", "32.007754", "A", 900, 5200],
  ["南京市", "121.204417", "31.14", "A", 100010001000100010001000, 2500],
  ["南通市", "121.186564", "31.885252", "A", 2000, 5000],
  ["无锡市", "121.118758", "31.887438", "A", 3000, 9500],
  ["盐城市", "121.364062", "32.007754", "A", 900, 5200],
  ["南京市", "121.204417", "31.14", "A", 100010001000100010001000, 2500],
  ["南通市", "121.186564", "31.885252", "A", 2000, 5000],
  ["无锡市", "121.118758", "31.887438", "A", 3000, 9500],
  ["盐城市", "121.364062", "32.007754", "A", 900, 5200],
];
import configJson from "../../../pluginTemp/config.json";
const CUSTOM_PLUGIN_ID = configJson.id;
let externalVariables =
  JSON.parse(localStorage.getItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`))
    ?.options?.externalVariables || {};
let customConfig =
  JSON.parse(localStorage.getItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`))
    ?.customConfig || {};
export let mockOptions = {
  externalVariables,
};
// export let mockCustomConfig = customConfig;

export const mockChangeOptions = (options) => {
  const mockData =
    JSON.parse(
      localStorage.getItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`)
    ) || {};
  mockData.options = options;
  localStorage.setItem(
    `analyzer-secondary-${CUSTOM_PLUGIN_ID}`,
    JSON.stringify(mockData)
  );
};

export const mockChangeCustomConfig = (customConfig) => {
  const mockData =
    JSON.parse(
      localStorage.getItem(`analyzer-secondary-${CUSTOM_PLUGIN_ID}`)
    ) || {};
  mockData.customConfig = customConfig;
  localStorage.setItem(
    `analyzer-secondary-${CUSTOM_PLUGIN_ID}`,
    JSON.stringify(mockData)
  );
};

// export const dataSource = {
//   dims: [
//     {
//       date: false,
//       displayed: 1,
//       is_private: false,
//       col_index: 1,
//       timeGranularity: 0,
//       column: "城市",
//       multipleComponentFlag: false,
//       index: 0,
//       asset_id: "59dffb4d-242d-498a-a931-5c085ad1a0f4",
//       col_name: "城市",
//       col_datatype: 0,
//       import_flag: false,
//       is_ciphertext: false,
//       datatype: 0,
//       id: "4f445f98-de1e-4ab7-a75d-dd056fa183c9",
//       inChart: true,
//       data: ["南京市", "南通市", "无锡市", "盐城市"],
//     },
//   ],
//   vals: [
//     {
//       date: false,
//       displayed: 1,
//       is_private: false,
//       col_index: 3,
//       timeGranularity: 0,
//       column: "经度",
//       multipleComponentFlag: false,
//       index: 1,
//       asset_id: "59dffb4d-242d-498a-a931-5c085ad1a0f4",
//       col_name: "经度",
//       col_datatype: 0,
//       import_flag: false,
//       is_ciphertext: false,
//       datatype: 0,
//       id: "39282bff-a5c5-4b4f-a75e-abe806273a0c",
//       inChart: true,
//       data: ["121.204417", "121.186564", "121.118758", "121.364062"],
//     },
//     {
//       date: false,
//       displayed: 1,
//       is_private: false,
//       col_index: 4,
//       timeGranularity: 0,
//       column: "纬度",
//       multipleComponentFlag: false,
//       index: 2,
//       asset_id: "59dffb4d-242d-498a-a931-5c085ad1a0f4",
//       col_name: "纬度",
//       col_datatype: 0,
//       import_flag: false,
//       is_ciphertext: false,
//       datatype: 0,
//       id: "a6025d77-c49f-484d-9586-549b5fb64f28",
//       inChart: true,
//       data: [
//         '[\n      { ddd: 123, zzz: "aaa" },\n      { ccc: 123, xxx: "aaa" },\n    ]',
//         "31.885252",
//         "31.887438",
//         "32.007754",
//       ],
//     },
//   ],
//   keys: [],
//   sers: [],
// };

export const mockCustomConfig = {
  pointList: [
    {
      modalWidth: 1400,
      modalHeight: 700,
      LongitudeKey: "经度",
      LatitudeKey: "纬度",
      modalTitle: "A",
      modalTableColumn: [
        {
          width: 100,
          column: "城市",
        },
        {
          width: 100,
          column: "种类",
        },
        {
          width: 100,
          column: "利润",
        },
        {
          width: 100,
          column: "销售额",
        },
      ],
      name: "点位详情",
      backgroundList: [],
      imgList: [
        {
          uid: 1673251946982,
          name: "custom_table.png",
          url: "/storage_area/form/1234567890/7f81d4c20ff6420a911cdb1e4609862d.png",
          status: "success",
        },
      ],
    },
  ],
  ServerImageryProvider:
    "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
};
export default {
  dataSource,
};
