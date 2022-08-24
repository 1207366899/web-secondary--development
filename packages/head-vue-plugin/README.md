[toc]
# smardaten前端组件二次开发
## 插件概述
数睿开放平台的 UI 插件为用户提供应用设计、分析仪、大屏、填报设计等核心模块自定义前端组件的能力。用户运用此能力，可以定制 UI 样式和页面逻辑。

框架集成了以下的功能：
+ 本地编辑开发，支持可视化预览。
+ 集成打包命令 npm run plugin ，支持一键打包。
+ 支持css / less / scss 语言。
+ 内置AntD(AntD是一款企业级的UI设计语言和React UI类库)。
+ 接口封装，使用proxy 方式代理接口，调用支持开发请求代理。


## 你需要知道的知识
+ [node.js](http://nodejs.cn/api/)
+ [webpack](https://www.webpackjs.com/)
+ [Vue](https://cn.vuejs.org/) ,[React](https://zh-hans.reactjs.org/) 二选一
(sdata-cli下载的为R4版本的模板，如果为R3版本环境需要使用R3版本的模板)
## 开发前准备

+ scli方式
  1. 本地运行cmd命令，打开运行窗口。
  2. 执行以下命令全局安装sdata-cli服务。

  ```js
    npm i sdata-cli -g
  ```
  3. 安装完成后，运行scli i，选择对应模块及框架
  4. npm i或者yarn install安装相关依赖项，运行npm run serve(Vue版本)/npm run start(React版本)即可开始进行开发
+ github方式
  1. 本地下载github仓库[https://github.com/Orochi-sx/web-secondary--development](https://github.com/Orochi-sx/web-secondary--development/)
  2. 切换对应的分支及插件类型，如vue版本的应用插件为vue-version-app
  3. npm i或者yarn install安装相关依赖项，运行npm run serve(Vue版本)/npm run start(React版本)即可开始进行开发

## 插件包文件说明
| 文件名 | 说明                                                                                                                               |
| --- |----------------------------------------------------------------------------------------------------------------------------------|
| config | config文件下内容Webpack 的编译配置，不建议修改。                                                                                                  |
| pluginTemp | 用于存放模板文件， config.json 文件用于配置插件参数，其他文件不建议修改。                                                                                      |
| public | public目录下是一些静态文件，不建议修改。                                                                                                          |
| scripts | scripts目录下是开发服务器启动和打包脚本，一般不需要改动。                                                                                                 |
| src | src 目录下是插件的源码，用户在此目录下开发定制代码。                                                                                                     |
| src/api | src/api下的文件是接口层，可以添加自己需要的Http 接口。                                                                                                |
| src/App.vue | src/App.js 是插件组件的主文件，用于开发插件的 react 组件。                                                                                           |
| src/main.js | src/index.js 是加载入口，除了构造开发的 mock 数据外一般不需要修改。                                                                                      |
| vue.config.js | webpack proxy 配置，在开发时如果需要调用 http 请求，可以在这里配置代理，可以参考示例或者 [webpack 官方文档](https://webpack.docschina.org/configuration/dev-server/) 。 |

## config.json配置文件字段说明

| 参数      | 参数说明                                                                                            |
|---------|-------------------------------------------------------------------------------------------------|
| id      | 插件标识，用户在下载插件模板时，系统自动生成，用户无需自定义。                                                                 |
| type    | 开发插件类型，主要包括如下类型：<br/>● analyzer：分析仪;<br/>● app:应用模块;<br/>● bigscreen：数据大屏;<br/>● reporting：填报设计 |
| main    | 插件打包后生成的上级JS文件名，插件打包时会自动更新此参数，用户无需手动配置。                                  |
| version | 标识插件的版本，目前默认取值为“2”。                                                                             |
| props   | 传递插件自定义相关属性。不同模块的自定义属性不同,请参见数据交互章节讲解。                                                           |
## 文件结构
### 应用
应用只有一个主页面文件，通常为App.vue

## 数据交互
### 应用
**`定义用户输入`**

config.json,customconf配置项

**`接收用户输入`**
  this.customConfig

**`字符串形式`**

使用JSON.stringify()转化数据

**`查询资产`**

调用queryAssetById接口，使用数据图书馆资产


## 行为交互（逻辑控制）
### 概念引入

原生js的逻辑控制

```js
//原生的点击事件，鼠标点击的时候，浏览器会触发点击事件（浏览器内部提供），开发者只用书写注册代码即可在用户点击时进行交互
document.addEventListener("click",function(e){
  console.log(e.clientX)
})
```

### EventBus
```js
//EventBus使用register注册事件
EventBus.register(eventName,function(e){
  console.log(e)
});

//EventBus使用triggerEvent触发事件，并可对外暴露相关参数
EventBus.triggerEvent(eventName,params)
```
### smardaten平台EventCenter(以应用二开为例)
#### 原理说明
逻辑控制指的将组件事件与动作开放，通过配置事件触发驱动动作的执行，将配置信息集中存储到事件中心，组件事件触发通知事件中心，事件中心按照配置分发执行组件动作，最终实现完全独立的组件之间建立逻辑通信。例如：下拉框组件的内容改变事件关联Input组件动作的显示隐藏，当下拉框内容改变的时候，通过事件中心，触发Input组件显示隐藏动作。

此处的逻辑控制的对象包括应用、大屏、分析仪、填报。
#### 功能说明
逻辑控制的流程的关键组件中心和事件中心。注册中心指的是将所有开放的组件事件与动作集中缓存，输出相关API逻辑控制供配置页面获取相关组件配置信息。事件中心指的是通过逻辑控制配置页面保存下来的配置信息，通过统一的查询接口，暂存到事件中心，所有组件的事件触发全部通知到事件中心，由事件中心统一分发，两者相互配合，实现插件的逻辑控制。
#### 代码演示
```js
//组件挂载完成时，注册对应的事件与动作
const events = [
  {
    key: "selectedValueChange", name: "过滤条件变化", payload: [
      {
        key: "selectedValue", name: "过滤条件", dataType: "string"
      }
    ],
  }, {
    key: "searchValueChange", name: "搜索条件变化", payload: [
      {
        key: "searchValue", name: "搜索条件", dataType: "string"
      }
    ],
  }
];
const actions = [
  {
    key: "setValue",
    name: "设值",
    params: [
      {
        key: "value",
        name: "值",
        dataType: "string"
      },
    ],
  },
  {
    key: "getValue",
    name: "取值",
    hasReturn: true,
    returns: [
      {
        key: "value",
        name: "值",
        dataType: "string"
      },
    ],
  }
]
//组件注册
this.props?.customConfig?.componentId && window.componentCenter?.register(this.props?.customConfig?.componentId, "comp", this, {
      events, actions
    });

//动作声明
do_EventCenter_setValue({ value }) {
  this.data = value;
},

//组件销毁
destroyed() {
    window?.componentCenter?.removeInstance(this.customConfig.componentId);
}
```

**`对应于EventBus的triggerEvent`**

```js
window.eventCenter?.triggerEvent(this.props?.customConfig?.componentId,"searchValueChange", {searchValue: val})
```

**`对应于EventBus的register`**

>smardaten平台  组件的交互页签-逻辑绑定-新增逻辑

**`对应于EventBus的function`**

>smardaten平台  组件的交互页签-逻辑绑定-新增逻辑-组件动作
#### 接口说明
| 接口 | 接口参数说明 | 描述 |
| --- | --- | --- |
| 在组件中心注册组件。<br>;需要将组件注册到组件中心，以供逻辑控制配置的时候可以获取到页面中渲染的组件。 | 注册接口：<br>window.componentCenter.register(id, type, ref, eventActionConfig) | ●　id：二开插件标识，string类型。<br>;●　type:固定配置为“comp”。<br>;●　ref：二开插件组件实例，obj类型。<br>;●　eventActionConfig：事件/动作的声明文件。  <br>; |
| 在组件中心删除组件的注册配置。 <br>;组件移除时，需要将组件中心收录的组件信息删除。 | 注销接口：window.componentCenter.removeInstance(id) | id：二开插件标识，string类型。  <br>; |
| 组件事件触发的时候需要通知事件中心，组件中心获取组件是否注册当前事件的逻辑控制，查询并执行。 | 调用执行接口：window.eventCenter.triggerEvent( id, event, payload) |● id：二开插件标识。<br>;● event：触发的事件名，应与事件的定义相同;● payload： 事件触发返回数据 例：{value: 123 }，obj类型。 |

### 补充(手写实现简易EventBus)

```js
class EventBus {
  constructor() {
    this.listeners = {};
  }
  register(eventName, callback) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push({
      callback
    });
  }
  triggerEvent(eventName, context) {
    let callbacks = this.listeners[eventName] || [];
    callbacks.forEach((callbackObj)=>{
      let callback = callbackObj.callback
      callback.call(null, context);
    })
  }
  clear(){
    this.listeners = {};
  }
}
export default new EventBus();
```
## 远程调试
  1. 修改vue.config.js的target字段为代理地址，
  2. 修改src/api/request.js中document.cookie的token和refreshToken字段为代理地址请求头的相应字段
  3. npm run serve

## 插件的上传及使用
### 插件上传
1. 登录数睿平台，单击“开放平台”，进入开放平台页面。
![](https://img.kancloud.cn/d9/a4/d9a4bec3826204ba416641df86356bb0_3900x1886.png)

2. 单击“插件开发”，进入插件开发页面。
![](https://img.kancloud.cn/f5/69/f5694c4d7824d0b25c6b9ad7a0d8f2d3_3882x1980.png)
3. 单击“我的插件”，进入插件列表页面。
![](https://img.kancloud.cn/77/da/77da3cdf2c67db84589bfeb11a72030e_3896x1460.png)
4. 单击“新增插件”，新增插件弹窗弹出。
![](https://img.kancloud.cn/9f/1e/9f1ec451feaa81f2775220e9a75e1b90_3034x1838.png)

5. 在新增插件弹窗中，输入插件信息。
![](https://img.kancloud.cn/23/13/2313770bb2bac9c2ea9b3a413303710d_866x533.png)

| 参数 | 参数说明 |
| --- | --- |
| 插件名称 | 插件名称。 |
| 插件类型 | 在下拉列表中选择相应的组件类型。 |
| 存储目录 | 选择插件的存放目录。 |
| 是否启动 | 插件是否启动生效。只有设置为“启用”是，插件才可被使用。 |
| 前端插件包 | 在本地选择需要上传的前端插件包。 |
| 图标 | 单击“选择图标”，根据需要选择面性或线性类型的图标，并且可以通过配置主题颜色，配置图标的颜色。也可以选择自定义，上传自定义图标，支持的自定义图标格式有jpg、jpeg、png、bmp和svg，且图片的大小不能超过128K。 |
### 插件使用
#### 应用
1. 新增插件已经上传Smartdata平台

2. 登录 Smartdata 平台，单击“应用设计”，进入应用设计模块。

![](https://img.kancloud.cn/98/d1/98d117ae593271d81cf9b58e99e3045d_1280x494.png)

3. 单击“新增应用”。

![](https://img.kancloud.cn/36/f7/36f717185b52ec6efc2224d0c0599beb_1884x873.png)
4. 选择应用类型， 填写创建的应用名称，单击“创建”。

![](https://img.kancloud.cn/7f/25/7f25d0a22e59fd099e8b091f7db0dc5f_1280x644.png)

5. 选择插件。
二次开发插件显示的名字由开放平台插件名称决定，图标依次取开放平台插件图标和config.json中的img字段。
 注意：r3版本自定义插件显示的名字由插件源码里 pluginTemp/config.json 里的 name 字段决定。
应用的二开插件分为3种： 自定义组件、顶栏和菜单插件。

* **`应用二开组件`**

在顶部插入菜单下，系统组件下拉列表 的最下方找到通过应用插件创建的二次开发组件。

![](https://img.kancloud.cn/0c/2d/0c2d7942dc9005971a44453cea10ab0b_1915x879.png)

![](https://img.kancloud.cn/f9/37/f9371a4b3598436545d7960b9cf4e48b_116x44.png)config.json中的props内的type字段为&quot;customize&quot;时，展现为自定义组件。

* **`顶栏二开插件`**

点击顶栏配置，右侧顶部选择二次开发。

![](https://img.kancloud.cn/72/53/7253ce6bf765da39d084fe6e78a1a87f_1900x900.png)

![](https://img.kancloud.cn/a5/7c/a57c8f3a669c6cb47b09e02b3a3ed24a_1911x774.png)

![](https://img.kancloud.cn/f9/37/f9371a4b3598436545d7960b9cf4e48b_116x44.png)config.json中的props内的type字段为&quot;head&quot;时，展现为顶栏插件。

* **`菜单二开插件`**

点击菜单配置，右侧顶部选择二次开发。

![](https://img.kancloud.cn/83/4e/834eceaf784a74d3e47d5633df34f289_1908x886.png)

![](https://img.kancloud.cn/0a/28/0a28b6068ee1afe875bdce2ed9b8c850_1660x676.png)

![](https://img.kancloud.cn/f9/37/f9371a4b3598436545d7960b9cf4e48b_116x44.png)config.json中的props内的type字段为&quot;navigation&quot;时，展现为菜单插件。

6. 单击选择插件，将插件组件加入页面。选中组件，页面右侧会弹出“组件配置”窗口。

![](https://img.kancloud.cn/1f/be/1fbef56117039cf5052e8ce52bd0e2d4_1648x765.png)

7. 在窗口中输入外部自定义配置参数。

![](https://img.kancloud.cn/be/1f/be1f09789475970eb479b4fffbee4933_1684x705.png)

![](https://img.kancloud.cn/f9/37/f9371a4b3598436545d7960b9cf4e48b_116x44.png)插件源码里“../pluginTemp/config.json”里的customconf字段决定了用户的配置项。



## 功能验证
+ 上传二开插件包到验证环境上，写入对应的配置字段即可。基本的功能验证与本地调试基本一致
+ events的验证，需要点到二开组件的交互界面，点击相应事件名，添加相应的打印输出逻辑，即可判断事件是否已经接入smardaten平台
+ actions验证，可搭建最简单的场景，如一个按钮，点击事件触发对应的动作，看能否正常生效即可。


## 其他注意事项（开发过程中务必关注）
+ 在组件的模板中，预置了一些事件动作相关的函数及定义，请在正式开发中将$\color{red}{用不到的事件与动作清除掉}$，并正确书写`Event_Center_getName`函数的返回值，以防止对配置人员造成困扰。
+ 因为二开插件外层布局由配置人员通过平台布局组件实现，四种类型的前端二开组件，除非特殊要求，理论上都应该将最外层的宽高设置为100%。
+ 二开组件代码中，如果需要获取dom元素并进行操作，react版本或vue版本都应通过ref去获取dom元素而非通过选择器，以防止组件复用时造成冲突
+ 分析仪二开通常对图表类进行二次开发，所以应加上窗口监听事件，并在其中写入图表重绘方法
  eg.
  ```js
  let chart= echarts.init(this.refs.chart)
  window.addEventListener("resize",function(){
    chart.resize()
  })
  ```