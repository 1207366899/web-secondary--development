---
title: sdk
nav:
  title: 应用
  path: /app
group:
  title: sdk
  path: /dev
toc: menu
---

## **场景说明**

如果开发插件涉及到使用JS SDK基础API功能，并且数睿企业级无代码开发平台也提供此能力，用户可通过接入JS SDK实现。

## **操作步骤**

步骤1、打开cmd窗口，执行以下命令安装JS SDK。

**npm install @sdsdk/app-sdk**

步骤2、使用以下命令将app-sdk引入二开插件中。

**import {getPageData} from '@sdsdk/app-sdk';**

| 字段 | 说明 |
| --- | --- |
| @sdsdk/app-sdk | JS SDK名称 |
| getPageData | 接口名称。此处以getPageData为例，目前支持的接口主要包括：getPageData，getVariable，getMenuData。 |

## 接口名称

### getPageData

* 描述：获取当前页面的相关信息。
* 参数：无
* 返回值

~~~
{
    "id": "b10979e8-6f74-b680-91ce-1aafa9903a68", // 页面id
    "name": "首页", // 页面名称
    "page_type": 0, //页面类型 0:导航页面, 1:基础, 2:弹窗
}
~~~

### getVariable

* 描述：获取当前应用的变量信息。
* 参数：无
* 返回值

~~~
[
    {
        "id": "4a567467-c7b8-4de8-92b4-ed83f3a8a4b8", // 变量id
        "name": "d", // 变量名称
        "data_type": 0, // 变量类型 0:文本,5：日期，6：时间，8：数字
        "default_value": "问问" // 变量默认值
    }
]
~~~

### getMenuData

* 描述：获取当前应用的所有菜单信息，`expandFlag` 传 `true` 时，将所有菜单展开为一维数组，其他情况返回菜单树。
* 参数：expandFlag(boolean)
* 返回值

~~~
[
    {
        "children": [ //子菜单
            {
                "icon": "",//菜单图标，
                "id": "e0d1714a-70f5-db81-1f74-22dc98a2e492", // 菜单主键
                "name": "而我认为", // 菜单名称
                "parent_id": "626523e7-be58-bf2d-6eee-86b2e0b27241",//父级菜单
                "type": 2,// 菜单类型
            }
        ],
        "id": "626523e7-be58-bf2d-6eee-86b2e0b27241",// 菜单主键
        "name": "首页",// 菜单名称
        "type": 3, // 菜单类型
    },
    {
        "children": [], //子菜单
        "id": "abe6b5f9-e2da-4350-93ac-bb7a1d2141ca", // 菜单主键
        "name": "应用管理", // 菜单名称
        "type": 1 // 菜单类型
    }
]
~~~
