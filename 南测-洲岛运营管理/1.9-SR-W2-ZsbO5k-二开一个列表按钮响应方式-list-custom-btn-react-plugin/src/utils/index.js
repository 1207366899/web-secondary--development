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
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
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
  getHideElementSize: function(elem) {
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
      height: height
    };

    function getNoneNode(node) {
      let display = getStyles(node).getPropertyValue("display"),
        tagName = node.nodeName.toLowerCase();
      if (display != "none"
          && tagName != "body") {
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
    };


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
          display: display
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
  isVisiable: function(element) {
    if (element === null || element === undefined) {
      return false;
    }

    if (
      element.style &&
      ((element.style.display && element.style.display == "none") ||
       (element.style.visibility && element.style.visibility == "hidden"))
    ) {
      return false;
    }

    let parent = element.parentNode;

    while (parent) {
      if (
        parent.style &&
        ((parent.style.display && parent.style.display == "none") ||
         (parent.style.visibility && parent.style.visibility == "hidden"))
      ) {
        return false;
      } else {
        parent = parent.parentNode;
      }
    }

    return true;
  }
};

export default Utils;
