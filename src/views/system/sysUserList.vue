<template>
  <el-main>
    <!-- 搜索框 -->
    <el-form
      :model="parms"
      ref="searchform"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item label="姓名">
        <el-input v-model="parms.username"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="parms.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="addUser" icon="el-icon-plus">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 员工表格 -->
    <el-table :height="tableHeight" :data="tableList" empty-text="暂无数据" border stripe>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="idCard" label="身份证"></el-table-column>
      <el-table-column align="center" prop="sex" label="性别">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sex == '1'" size="normal">男</el-tag>
          <el-tag v-if="scope.row.sex == '0'" type="success" size="normal"
            >女</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="是否离职">
        <template slot-scope="scope">
          <el-switch
            :active-value="'0'"
            active-text="否"
            inactive-text="是"
            :inactive-value="'1'"
            v-model="scope.row.status"
            @change="changeStatus(scope.row)"
          ></el-switch>
          <!-- <el-tag v-if="scope.row.status =='1'" type="danger" size="normal"  effect="dark">是</el-tag> -->
          <!-- <el-tag v-if="scope.row.status =='0'" type="danger" size="normal"  effect="dark">否</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isUsed" label="账号状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isUsed"
            :active-value="'0'"
            :inactive-value="'1'"
            active-text="启用"
            inactive-text="禁用"
            @change="changeUsed(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="editUser(scope.row)"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="deleteUser(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="parms.curentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="parms.pageSize"
      :total="parms.total"
      background
    >
    </el-pagination>

    <!-- 新增或编辑弹框 -->
    <sys-dialog
      :title="dialog.title"
      :visible="dialog.visible"
      :height="dialog.height"
      :width="dialog.width"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="addModel"
          ref="addForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item prop="username" label="姓名:">
            <el-input v-model="addModel.username"></el-input>
          </el-form-item>
          <el-form-item style="width:280px;" prop="sex" label="性别:">
            <el-radio-group  v-model="addModel.sex">
              <el-radio :label="'0'">男</el-radio>
              <el-radio :label="'1'">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="phone" label="电话:">
            <el-input v-model="addModel.phone"></el-input>
          </el-form-item>
          <el-form-item prop="idCard"  label="身份证:">
            <el-input v-model="addModel.idCard"></el-input>
          </el-form-item>
          <el-form-item prop="loginName" label="登录名:">
            <el-input v-model="addModel.loginName"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码:">
            <el-input v-model="addModel.password"></el-input>
          </el-form-item>
          <el-form-item style="width:280px;" prop="status" label="离职:">
            <el-radio-group v-model="addModel.status">
              <el-radio :label="'1'">是</el-radio>
              <el-radio :label="'0'">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item style="width:280px;" prop="isUsed" label="启用:">
            <el-radio-group  v-model="addModel.isUsed">
              <el-radio :label="'1'">是</el-radio>
              <el-radio :label="'0'">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import { getUserListApi, addUserApi } from "@/api/user";
import SysDialog from "@/components/system/SysDialog";

export default {
  //组件在使用之前需要注册
  components: {
    SysDialog,
  },
  //所有需要在页面上展示的数据，都需要显示的在data里面进行定义
  data() {
    return {
      rules: {
        username: [
          {
            required: true,
            trigger: "change",
            message: "请填写姓名",
          },
        ],
        phone: [
          {
            required: true,
            trigger: "change",
            message: "请填写电话号码",
          },
        ],
        idCard: [
          {
            required: true,
            trigger: "change",
            message: "请填写身份证号码",
          },
        ],
        status: [
          {
            required: true,
            trigger: "change",
            message: "请选择是否离职",
          },
        ],
        isUsed: [
          {
            required: true,
            trigger: "change",
            message: "请选择是否启用",
          },
        ],
            sex: [
          {
            required: true,
            trigger: "change",
            message: "请选择性别",
          },
        ]
      },
      //新增或编辑表单数据域
      addModel: {
        userId:'',
        type:'', //0： 新增 1： 编辑
        username:'',
        sex:'',
        phone:'',
        idCard:'',
        loginName:'',
        password:'',
        status:'',
        isUsed:''
      },
      //弹框属性
      dialog: {
        title: "",
        visible: false,
        height: 240,
        width: 610,
      },
      //表格的高度
      tableHeight: 0,
      //搜索框数据绑定
      parms: {
        phone: "",
        username: "",
        pageSize: 10,
        curentPage: 1,
        total: 0,
      },
      //表格数据
      tableList: [],
    };
  },
  created() {
    this.getUserList();
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 210;
    });
  },
  methods: {
    //删除按钮
    deleteUser(row) {
      console.log(row);
    },
    //编辑按钮
    editUser(row) {
      console.log(row);
    },
    //表格启用、禁用事件
    changeUsed(row) {
      console.log(row);
    },
    //表格在职、离职点击事件
    changeStatus(row) {
      console.log(row);
    },
    //对话框确认事件
    onConfirm() {
      console.log(this.addModel);
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModel.type == "0") {
            res = await addUserApi(this.addModel);
          }
          //成功，刷新数据列表
          if (res && res.code == 200) {
            this.getUserList();
            this.dialog.visible = false;
          }
          console.log(res);
        }
      });
      // this.dialog.visible = false;
    },
    //对话框关闭
    onClose() {
      this.dialog.visible = false;
    },
    //新增按钮事件
    addUser() {
      //清空表单数据
      this.$resetForm("addForm", this.addModel);
      this.addModel.type = "0";
      this.dialog.title = "新增员工";
      this.dialog.visible = true;
    },
    async getUserList() {
      let res = await getUserListApi(this.parms);
      if (res.code == 200) {
        this.tableList = res.data.records;
      }
      console.log(res);
    },
    //页容量改变的时候触发
    sizeChange(val) {
      console.log(val);
    },
    //页数改变的时候触发
    currentChange(val) {
      console.log(val);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>