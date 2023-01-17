<template>
  <div class="customConfig">
    <!-- 底图 -->
    <div class="imageryProvider">
      <div class="imageryServe">
        <span>底图服务地址:</span>
        <el-input
          v-model="ServerImageryProvider"
          type="textarea"
          :rows="3"
          autocomplete="off"
          @input="inputChange"
        ></el-input>
      </div>
    </div>
    <!-- 3D底图服务设置 -->
    <div class="imageryProvider">
      <div class="imageryTitle">
        <span>3D底图服务设置</span>
        <el-button
          type="primary"
          size="small"
          @click="handleClick('imageryForm')"
          >+添加</el-button
        >
      </div>
      <div class="imageryBox">
        <div
          class="imageryList"
          v-for="(imagery, index) in imageryProviderList"
          :key="index"
        >
          <span class="nameTitle" :title="imagery.name">{{
            imagery.name
          }}</span>
          <i
            class="el-icon-edit iconClass"
            @click="handleEdit(index, 'imageryForm')"
          ></i>
          <i
            class="el-icon-copy-document iconClass"
            @click="handleCopy(imagery, 'imageryForm')"
          ></i>
          <i
            class="el-icon-delete iconClass"
            @click="handleDel(index, 'imageryForm')"
          ></i>
        </div>
      </div>
    </div>
    <!-- 点位列表 -->
    <div class="imageryProvider">
      <div class="imageryTitle">
        <span>图层设置</span>
        <el-button type="primary" size="small" @click="handleClick('pointForm')"
          >+添加</el-button
        >
      </div>
      <div class="imageryBox">
        <div
          class="imageryList"
          v-for="(point, pointIndex) in pointList"
          :key="pointIndex"
        >
          <span class="nameTitle" :title="point.name">{{ point.name }}</span>
          <i
            class="el-icon-edit iconClass"
            @click="handleEdit(pointIndex, 'pointForm')"
          ></i>
          <i
            class="el-icon-copy-document iconClass"
            @click="handleCopy(point, 'pointForm')"
          ></i>
          <i
            class="el-icon-delete iconClass"
            @click="handleDel(pointIndex, 'pointForm')"
          ></i>
        </div>
      </div>
    </div>
    <!-- 底图弹窗 -->
    <el-dialog
      title="底图服务设置"
      :visible.sync="imageryDialogVisible"
      :append-to-body="true"
      :rules="rules"
      width="40%"
    >
      <div class="dialogBody">
        <el-form :model="imageryForm" ref="imageryForm" :rules="rules">
          <el-form-item label="图层名称:" label-width="80" prop="name">
            <el-input
              v-model="imageryForm.name"
              autocomplete="off"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="服务地址:" label-width="80" prop="serveUrl">
            <el-input
              type="textarea"
              :rows="6"
              v-model="imageryForm.serveUrl"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="模型颜色:" label-width="80" prop="color">
            <el-input
              type="text"
              v-model="imageryForm.color"
              placeholder="rgb类型"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('imageryForm')">取 消</el-button>
        <el-button type="primary" @click="subBtn('imageryForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 点位弹窗 -->
    <el-dialog
      title="数据图层设置"
      :visible.sync="pointVisible"
      :append-to-body="true"
      :rules="rules"
      width="40%"
    >
      <div class="dialogBody">
        <el-form :model="pointForm" ref="pointForm" :rules="rules">
          <el-form-item label="图层名称:" label-width="80" prop="name">
            <el-input
              v-model="pointForm.name"
              autocomplete="off"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="经度:" label-width="80" prop="LongitudeKey">
            <el-select
              style="width: 100%"
              v-model="pointForm.LongitudeKey"
              placeholder="请选择经度"
            >
              <el-option
                v-for="(item, ins) in selectKey"
                :key="ins"
                :label="item.column"
                :value="item.column"
                >{{ item.column }}</el-option
              >
            </el-select>
          </el-form-item>
          <el-form-item label="维度:" label-width="80" prop="LatitudeKey">
            <el-select
              style="width: 100%"
              v-model="pointForm.LatitudeKey"
              placeholder="请选择维度"
            >
              <el-option
                v-for="(items, inse) in selectKey"
                :key="inse"
                :label="items.column"
                :value="items.column"
                >{{ items.column }}</el-option
              >
            </el-select>
          </el-form-item>
          <el-form-item label="图形符号:" label-width="80">
            <el-upload
              class="upload-demo"
              action="/sdata/rest/image/upload"
              :on-success="successHan"
              :on-remove="removeHan"
              :multiple="false"
              :limit="1"
              :file-list="imgList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="宽度:" label-width="80" prop="modalWidth">
                <el-input
                  v-model="pointForm.modalWidth"
                  autocomplete="off"
                  clearable
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12">
              <el-form-item label="高度:" label-width="80" prop="modalHeight">
                <el-input
                  v-model="pointForm.modalHeight"
                  autocomplete="off"
                  clearable
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-form-item
            label="弹窗列表标题:"
            label-width="80"
            prop="modalTitle"
          >
            <el-input
              v-model="pointForm.modalTitle"
              autocomplete="off"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            label="弹窗列表字段:"
            label-width="80"
            prop="modalTableColumn"
          >
            <el-row
              v-for="(item, index) in pointForm.modalTableColumn"
              :key="index"
              :gutter="10"
              :style="{
                display: 'inline-block',
                width: '100%',
              }"
            >
              <el-col :span="10">
                <el-select
                  style="width: 100%"
                  v-model="item.column"
                  placeholder="请选择字段"
                >
                  <el-option
                    v-for="(items, inse) in selectKey"
                    :key="inse"
                    :label="items.column"
                    :value="items.column"
                    >{{ items.column }}</el-option
                  >
                </el-select>
              </el-col>
              <el-col :span="10">
                <el-input-number
                  v-model="item.width"
                  autocomplete="off"
                  clearable
                  :style="{ width: '100%' }"
                  min="0"
                ></el-input-number
              ></el-col>
              <el-col :span="4">
                <i
                  class="el-icon-delete"
                  :style="{ cursor: 'pointer' }"
                  @click="modalTableColumnChange('DELETE', index)"
                ></i>
              </el-col>
            </el-row>
            <el-button
              :style="{ width: '100%' }"
              @click="modalTableColumnChange('ADD')"
              >添加</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('pointForm')">取 消</el-button>
        <el-button type="primary" @click="subBtn('pointForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  Input,
  Button,
  Dialog,
  Form,
  FormItem,
  Icon,
  Select,
  Option,
  Upload,
  Row,
  Col,
  InputNumber,
} from "element-ui";
import Vue from "vue";

Vue.use(Input);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Icon);
Vue.use(Select);
Vue.use(Option);
Vue.use(Upload);
Vue.use(Row);
Vue.use(Col);
Vue.use(InputNumber);

export default {
  name: "DesignConfiguration",
  components: {},
  props: ["customConfig", "changeCustomConfig", "dataSource"],
  data() {
    return {
      ServerImageryProvider: "", // 底图服务
      imageryProviderList: [], // 底图列表
      pointList: [], // 点位列表
      imageryDialogVisible: false,
      selectKey: [], // 数据维度
      pointVisible: false,
      editStatus: false, // 编辑态
      editIndex: null, // 编辑索引
      imageryForm: {
        // 底图表单
        name: "",
        serveUrl: "",
        color: "",
      },
      imgList: [],
      backgroundList: [],
      pointForm: {
        // 点位表单
        name: "",
        LongitudeKey: "",
        LatitudeKey: "",
        imgList: [],
        backgroundList: [],
        modalWidth: 1400,
        modalHeight: 700,
        modalTitle: "点位详情",
        modalTableColumn: [],
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        serveUrl: [{ required: true, message: "请输入地址", trigger: "blur" }],
        LongitudeKey: [
          { required: true, message: "请输入经度", trigger: "change" },
        ],
        LatitudeKey: [
          { required: true, message: "请输入维度", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    console.log("//**配置页customConfig**//", this.customConfig);
    console.log("//**配置页dataSource**//", this.dataSource);
    try {
      this.ServerImageryProvider = this.customConfig?.ServerImageryProvider
        ? this.customConfig?.ServerImageryProvider
        : "";
      this.imageryProviderList = this.customConfig?.imageryProviderList
        ? this.customConfig?.imageryProviderList
        : [];
      this.pointList = this.customConfig?.pointList
        ? _.cloneDeep(this.customConfig?.pointList)
        : [];
    } catch (error) {
      this.ServerImageryProvider = this.customConfig?.ServerImageryProvider
        ? this.customConfig?.ServerImageryProvider
        : "";
      this.imageryProviderList = this.customConfig?.imageryProviderList
        ? this.customConfig?.imageryProviderList
        : [];
      this.pointList = this.customConfig?.pointList
        ? _.cloneDeep(this.customConfig?.pointList)
        : [];
    }
    this.initSelectKeys();
  },
  methods: {
    // 数据维度key
    initSelectKeys() {
      const { dims = [], vals = [] } = this.dataSource || {};
      if (dims?.length) {
        let listOne = JSON.parse(JSON.stringify(dims[0]));
        let listLast = JSON.parse(JSON.stringify(vals));
        listLast.unshift(listOne);
        this.selectKey = listLast.map((x) => {
          return {
            column: x.column,
          };
        });
      }
    },
    // 地图地址
    inputChange() {
      this.customConfig.ServerImageryProvider = JSON.parse(
        JSON.stringify(this.ServerImageryProvider)
      );
      this.changeCustomConfig(this.customConfig);
      // console.log(this.customConfig);
    },
    // 添加图层
    handleClick(formName) {
      if (formName == "imageryForm") {
        this.imageryDialogVisible = true;
      } else {
        this.pointVisible = true;
      }
    },
    // 修改
    handleEdit(inds, formName) {
      this.editStatus = true;
      this.editIndex = inds;
      if (formName == "imageryForm") {
        let obj = this.imageryProviderList[inds];
        this.imageryForm = JSON.parse(JSON.stringify(obj));
        this.imageryDialogVisible = true;
      } else {
        let obj = JSON.parse(JSON.stringify(this.pointList[inds]));
        this.pointForm = obj;
        this.imgList = obj.imgList;
        this.backgroundList = obj.backgroundList;
        this.pointVisible = true;
      }
    },
    // 复制
    handleCopy(imagery, formName) {
      if (formName == "imageryForm") {
        this.imageryProviderList.push(imagery);
        this.customConfig.imageryProviderList = JSON.parse(
          JSON.stringify(this.imageryProviderList)
        );
      } else {
        this.pointList.push(imagery);
        this.customConfig.pointList = JSON.parse(
          JSON.stringify(this.pointList)
        );
      }
      this.changeCustomConfig(this.customConfig);
      // console.log(this.customConfig);
    },
    // 删除
    handleDel(inds, formName) {
      if (formName == "imageryForm") {
        this.imageryProviderList.splice(inds, 1);
        this.customConfig.imageryProviderList = JSON.parse(
          JSON.stringify(this.imageryProviderList)
        );
      } else {
        this.pointList.splice(inds, 1);
        this.customConfig.pointList = JSON.parse(
          JSON.stringify(this.pointList)
        );
      }
      this.changeCustomConfig(this.customConfig);
      // console.log(this.customConfig);
    },
    // 图片上传成功
    successHan(response, file, fileList) {
      let url = response.result[0];
      let obj = {
        name: fileList[0].name,
        url: url,
      };
      this.imgList.push(obj);
    },
    successBackground(response, file, fileList) {
      let url = response.result[0];
      let obj = {
        name: fileList[0].name,
        url: url,
      };
      this.backgroundList.push(obj);
    },
    // 图片删除成功
    removeHan() {
      this.imgList = [];
    },
    removeBackground() {
      this.backgroundList = [];
    },
    // 确定
    subBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 修改
          if (this.editStatus && this.editIndex != null) {
            if (formName == "imageryForm") {
              this.imageryProviderList[this.editIndex] = JSON.parse(
                JSON.stringify(this.imageryForm)
              );
              this.customConfig.imageryProviderList = JSON.parse(
                JSON.stringify(this.imageryProviderList)
              );
            } else {
              this.pointList[this.editIndex] = JSON.parse(
                JSON.stringify(this.pointForm)
              );
              this.customConfig.pointList = JSON.parse(
                JSON.stringify(this.pointList)
              );
            }
            this.editStatus = false;
            this.editIndex = null;
            this.changeCustomConfig(this.customConfig);
            this.resetForm(formName);
            // console.log('this.customConfig', this.customConfig);
          } else {
            // 新增
            if (formName == "imageryForm") {
              let obj = JSON.parse(JSON.stringify(this.imageryForm));
              this.imageryProviderList.push(obj);
              this.customConfig.imageryProviderList = JSON.parse(
                JSON.stringify(this.imageryProviderList)
              );
            } else {
              this.pointForm.imgList = JSON.parse(JSON.stringify(this.imgList));
              this.pointForm.backgroundList = JSON.parse(
                JSON.stringify(this.backgroundList)
              );
              let obj = JSON.parse(JSON.stringify(this.pointForm));
              this.pointList.push(obj);
              // console.log('点位',obj);
              this.customConfig.pointList = JSON.parse(
                JSON.stringify(this.pointList)
              );
            }
            this.changeCustomConfig(this.customConfig);
            this.resetForm(formName);
            console.log("this.customConfig", this.customConfig);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 重置
    resetForm(formName) {
      if (formName == "imageryForm") {
        this.imageryDialogVisible = false;
      } else {
        this.pointVisible = false;
      }
      this.$refs[formName].resetFields();
    },
    modalTableColumnChange(type, index) {
      switch (type) {
        case "ADD":
          this.pointForm.modalTableColumn.push({});
          break;
        case "DELETE":
          this.pointForm.modalTableColumn.splice(index, 1);
        default:
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.customConfig {
  margin-top: 20px;
  width: 100%;

  .imageryProvider {
    margin-top: 15px;
    width: 100%;

    .imageryServe {
      display: flex;
      flex-wrap: wrap;
    }

    .imageryTitle {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .imageryBox {
      margin-top: 10px;
      width: 100%;

      .imageryList {
        margin-top: 5px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .nameTitle {
          width: 200px;
          margin-right: auto;
          color: #5e605f;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .iconClass {
          cursor: pointer;
          margin-right: 10px;
          color: #abaeb3;
          font-size: 18px;
        }
      }
    }
  }
}
</style>
