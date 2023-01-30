const Utils = {
  /**
   * 将平台返回数据转化为对象数组的形式
   * @param {Array} originTableData 平台接口查询回来的数据
   * @returns {Array} 返回对象数组 形如[{name:"小红",age:23},{name:"小刚",age:23}]
   */
  translatePlatformDataToJsonArray(originTableData) {
    let originTableHeader = originTableData.data[0];
    let tableHeader = [];
    originTableHeader.forEach((item) => {
      tableHeader.push(item.col_name);
    });
    let tableBody = originTableData.data[1];
    let tableData = [];
    tableBody.forEach((tableItem) => {
      let temp = {};
      tableItem.forEach((item, index) => {
        temp[tableHeader[index]] = item;
      });
      tableData.push(temp);
    });
    return tableData;
  },
  computeSunRiseSunSet(Latitude, Longitude, TimeZone) {
    function parseTime(aTime) {
      var aDateTimeObject = "none";

      if (aTime !== undefined && aTime.length) {
        var aDate = new Date();

        var aDateAdjustedToGMTInMS = aDate.getTime() + aDate.getTimezoneOffset() * 60 * 1000;

        aDateTimeObject = new Date(aDateAdjustedToGMTInMS);

        try {
          var theHour = parseInt(aTime.split(":")[0]);

          var theMinutes = parseInt(aTime.split(":")[1]);

          aDateTimeObject.setHours(theHour);

          aDateTimeObject.setMinutes(theMinutes);
        } catch (ex) {}
      }

      return aDateTimeObject;
    }

    var curTime = new Date(); // Variable names used: B5, C, C2, C3, CD, D, DR, H, HR, HS, L0, L5, M, MR, MS, N, PI, R1, RD, S1, SC, SD, str

    var retVal = new Object();

    var PI = Math.PI;

    var DR = PI / 180;

    var RD = 1 / DR;

    var B5 = Latitude;

    var L5 = Longitude;

    var H = -1 * ((curTime.getTimezoneOffset() / 60) * -1); // Local timezone // Overriding TimeZone to standardize on UTC // H = 0;

    var M = curTime.getMonth() + 1;

    var D = curTime.getDate();

    B5 = DR * B5;

    var N = parseInt((275 * M) / 9) - 2 * parseInt((M + 9) / 12) + D - 30;

    var L0 = 4.8771 + 0.0172 * (N + 0.5 - L5 / 360);

    var C = 0.03342 * Math.sin(L0 + 1.345);

    var C2 = RD * (Math.atan(Math.tan(L0 + C)) - Math.atan(0.9175 * Math.tan(L0 + C)) - C);

    var SD = 0.3978 * Math.sin(L0 + C);

    var CD = Math.sqrt(1 - SD * SD);

    var SC = (SD * Math.sin(B5) + 0.0145) / (Math.cos(B5) * CD);

    if (Math.abs(SC) <= 1) {
      var C3 = RD * Math.atan(SC / Math.sqrt(1 - SC * SC));

      var R1 = 6 - H - (L5 + C2 + C3) / 15;

      var HR = parseInt(R1);

      var MR = parseInt((R1 - HR) * 60);

      retVal.SunRise = parseTime(HR + ":" + MR);

      var TargetTimezoneOffset = TimeZone * 60 * 60 * 1000 + retVal.SunRise.getTimezoneOffset() * 60 * 1000;

      var transformedSunRise = new Date(retVal.SunRise.getTime() + TargetTimezoneOffset);

      var strSunRise = transformedSunRise.getHours() + ":" + (transformedSunRise.getMinutes() < 10 ? "0" + transformedSunRise.getMinutes() : transformedSunRise.getMinutes());

      var S1 = 18 - H - (L5 + C2 - C3) / 15;

      var HS = parseInt(S1);

      var MS = parseInt((S1 - HS) * 60);

      retVal.SunSet = parseTime(HS + ":" + MS);

      var transformedSunSet = new Date(retVal.SunSet.getTime() + TargetTimezoneOffset);

      var strSunSet = transformedSunSet.getHours() + ":" + (transformedSunSet.getMinutes() < 10 ? "0" + transformedSunSet.getMinutes() : transformedSunSet.getMinutes());

      retVal.Noon = new Date((retVal.SunRise.getTime() + retVal.SunSet.getTime()) / 2);

      var transformedNoon = new Date(retVal.Noon.getTime() + TargetTimezoneOffset);

      var strNoon = transformedNoon.getHours() + ":" + (transformedNoon.getMinutes() < 10 ? "0" + transformedNoon.getMinutes() : transformedNoon.getMinutes());
    } else {
      if (SC > 1) {
        // str="Sun up all day";

        strSunRise = ".";

        strNoon = ".";

        strSunSet = ".";

        var tDate = new Date(); // Set Sunset to be in the future ...

        retVal.SunSet = new Date(tDate.getFullYear() + 1, tDate.getMonth(), tDate.getDay(), tDate.getHours()); // Set Sunrise to be in the past ...

        retVal.SunRise = new Date(tDate.getFullYear() - 1, tDate.getMonth(), tDate.getDay(), tDate.getHours() - 1);
      }

      if (SC < -1) {
        // str="Sun down all day";

        strSunRise = ".";

        strNoon = ".";

        strSunSet = "."; // Set Sunrise and Sunset to be in the future ...

        retVal.SunRise = new Date(tDate.getFullYear() + 1, tDate.getMonth(), tDate.getDay(), tDate.getHours());

        retVal.SunSet = new Date(tDate.getFullYear() + 1, tDate.getMonth(), tDate.getDay(), tDate.getHours());
      }
    }

    retVal.strSunRise = strSunRise;

    retVal.strNoon = strNoon;

    retVal.strSunSet = strSunSet;

    retVal.str = "日出" + strSunRise + " | " + "正午" + strNoon + " | " + "日落" + strSunSet;

    return retVal;
  },
  /**
   * 自定义定时器，将在执行指定次数之后结束
   * @param {Number} time 定时器执行的时间间隔，单位ms
   * @param {Number} maxTimes 定时器最大执行次数
   * @param {Function} callback 定时器回调函数,若需要提前结束，请返回false
   */
  customInterval(time, maxTimes, callback) {
    if (time < 1 || maxTimes < 1 || Object.prototype.toString.call(callback) != "[object Function]") {
      return;
    }
    let count = 0;
    let timer = setInterval(() => {
      count++;
      if (count === maxTimes || callback() === false) {
        clearInterval(timer);
      }
    }, time);
  },
  /**
   * 判断两个数组是否包含相同的元素（只能比较基础数据类型）
   * @param {Array} arr1
   * @param {Array} arr2
   * @returns {Boolean}
   */
  arrayContainsSame: (arr1, arr2) => {
    let result = [...arr1, ...arr2];
    let set = new Set(result);
    if (set.size === result.length) {
      return false;
    }
    return true;
  },
  /**
   * 生成UUID，形如1688990e-c49c-4439-a50c-51dc8017cb8f,c45e18b5-27ed-4cd2-93b5-7800243b5a02
   *
   */
  generateUUID: () => {
    let d = new Date().getTime();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  },
  /**
   * 获取隐藏元素的宽高
   *
   * @param {Node} elem 元素节点
   */
  getHideElementSize: function (elem) {
    let width,
      height,
      // elem = document.querySelector(ele),
      noneNodes = [],
      nodeStyle = [];
    getNoneNode(elem); //获取多层display：none;的元素
    setNodeStyle();
    width = elem.clientWidth;
    height = elem.clientHeight;
    resumeNodeStyle();

    return {
      width: width,
      height: height,
    };

    function getNoneNode(node) {
      let display = getStyles(node).getPropertyValue("display"),
        tagName = node.nodeName.toLowerCase();
      if (display != "none" && tagName != "body") {
        getNoneNode(node.parentNode);
      } else {
        noneNodes.push(node);
        if (tagName != "body") {
          getNoneNode(node.parentNode);
        }
      }
    }

    //这方法才能获取最终是否有display属性设置，不能style.display。
    function getStyles(elem) {
      // Support: IE<=11+, Firefox<=30+ (#15098, #14150)
      // IE throws on elements created in popups
      // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
      let view = elem.ownerDocument.defaultView;

      if (!view || !view.opener) {
        view = window;
      }
      return view.getComputedStyle(elem);
    }

    function setNodeStyle() {
      let i = 0;
      for (; i < noneNodes.length; i++) {
        let visibility = noneNodes[i].style.visibility,
          display = noneNodes[i].style.display,
          style = noneNodes[i].getAttribute("style");
        //覆盖其他display样式
        noneNodes[i].setAttribute("style", "visibility:hidden;display:block !important;" + style);
        nodeStyle[i] = {
          visibility: visibility,
          display: display,
        };
      }
    }

    function resumeNodeStyle() {
      let i = 0;
      for (; i < noneNodes.length; i++) {
        noneNodes[i].style.visibility = nodeStyle[i].visibility;
        noneNodes[i].style.display = nodeStyle[i].display;
      }
    }
  },
  /**
   * 判断元素是否可见
   * @param {Node} element 元素节点
   */
  isVisiable: function (element) {
    if (element === null || element === undefined) {
      return false;
    }

    if (element.style && ((element.style.display && element.style.display == "none") || (element.style.visibility && element.style.visibility == "hidden"))) {
      return false;
    }

    let parent = element.parentNode;

    while (parent) {
      if (parent.style && ((parent.style.display && parent.style.display == "none") || (parent.style.visibility && parent.style.visibility == "hidden"))) {
        return false;
      } else {
        parent = parent.parentNode;
      }
    }

    return true;
  },
};

export default Utils;
