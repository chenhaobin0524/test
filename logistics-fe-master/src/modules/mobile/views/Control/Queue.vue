<template>
  <div class="queue-container">
    <el-row :gutter="10">
      <el-col :span="5">
        <div class="sideBar">
          <div class="s-title">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                {{crenel === '' ? (getCrenelLists[0] && getCrenelLists[0].lable) : crenel}}
                <i
                  class="el-icon-caret-bottom el-icon--right"
                ></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  class="clearfix"
                  v-for="v in getCrenelLists"
                  :key="'crenel'+v.value"
                  @click.native="chooseCrenel(v.lable)"
                >{{v.lable}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              type="primary"
              size="medium"
              style="float: right; padding: 3px 3px"
              icon="el-icon-plus"
              @click="handleAddQueue"
            ></el-button>
            <el-dialog title="新增" :visible.sync="dialogFormVisible" width="30%">
              <el-form>
                <el-form-item label="垛口名称" :label-width="formLabelWidth">
                  <el-select v-model="crenelCode" placeholder="请选择垛口名称">
                    <el-option
                      v-for="item in getCrenelLists"
                      :key="item.value"
                      :label="item.lable"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车牌号码" :label-width="formLabelWidth">
                  <el-input
                    v-model="licenseNum"
                    autocomplete="off"
                    maxlength="8"
                    show-word-limit
                    placeholder="请输入车牌号码"
                  ></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleCommit">确 定</el-button>
              </div>
            </el-dialog>
          </div>
          <div class="s-list">
            <ul>
              <li
                v-for="(val, index) in itemList"
                :key="index+'play'"
                @mouseover="mouseOver($event)"
                @mouseleave="mouseLeave($event)"
                class="lis"
              >
                <el-col :span="3">{{index+1}}</el-col>
                <el-col :span="21">
                  {{val}}
                  <span class="disappear" @click="handleDeleteQueue(val)">x</span>
                </el-col>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
      <el-col :span="19">
        <el-row class="queue-list">
          <el-col
            :span="4"
            v-for="(v, i) in queueArr"
            :key="v.id"
            :class="{current:v.crenelStatus===0}"
          >
            <div class="crenel" :class="{ active:i==currentIndex}" @click="select(v, i)">
              <div class="top">
                <div class="crenel-num">{{v.crenelName}}</div>
                <div class="queue" v-if="+v.crenelStatus!==0">
                  <span>{{v.queueList?v.queueList.length:0}}</span>人排队
                </div>
              </div>
              <div class="content">
                <div class="crenel-status">
                  <div class="carNum" v-if="+v.crenelStatus===20">{{v.currentVehicle}}</div>
                  <div class="carNum" v-if="+v.crenelStatus===10">{{v.nextVehicle}}</div>
                  <div class="status" v-if="+v.crenelStatus===20">作业中...</div>
                  <div class="calling" v-if="+v.crenelStatus===10">正在叫号</div>
                  <div class="calling" v-if="+v.crenelStatus===30">空闲</div>
                  <div class="disabled" v-if="+v.crenelStatus===0">不可用</div>
                </div>
                <div class="btns" v-if="+v.crenelStatus===10">
                  <div class="close" @click="closeCalling(v, i)">关闭</div>
                  <div class="driver" @click="handleDriver(v, i)">司机到位</div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
    getCrenelList,
    addQueue,
    closeQueue,
    driverReady,
    deleteQueue
} from '../../api/control/Queue';
export default {
    data() {
        return {
            crenelCode: '',
            licenseNum: '',
            dialogFormVisible: false,
            formLabelWidth: '80px',
            currentIndex: 0,
            itemList: [],
            crenel: '',
            crenelList: [],
            queueArr: [],
            timer: null
        };
    },
    methods: {
        mouseOver(e) {
            e.currentTarget.className = 'lis detail';
            e.currentTarget.lastElementChild.firstElementChild.className = 'closeBtn';
        },
        mouseLeave(e) {
            e.currentTarget.className = 'lis';
            e.currentTarget.lastElementChild.firstElementChild.className =
          'disappear';
        },
        select(item, index) {
            this.crenel = item.crenelName;
            this.itemList = item.queueList;
            this.currentIndex = index;
        },
        chooseCrenel(v) {
            this.crenel = v;
            this.queueArr.map((item, i) => {
                if (item.crenelName === v) {
                    this.itemList = item.queueList;
                }
            });
        },
        getItemLsit(index = 0) {
            this.queueArr.map((item, i) => {
                if (this.crenel) {
                    if (item.crenelName === this.crenel) {
                        this.itemList = item.queueList;
                    }
                } else {
                    this.itemList = this.queueArr[index].queueList;
                }
            });
        },
        // 关闭叫号
        closeCalling(item, index) {
            this.$confirm('关闭后该车牌在排队队列中降至最后一位！', '确认关闭？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
            })
                .then(() => {
                    const obj = {
                        id: item.id,
                        crenelCode: item.crenelCode,
                        currentVehicle: item.nextVehicle,
                        crenelStatus: 0,
                        version: item.version
                    };
                    if (!this.timer) {
                        clearInterval(this.timer);
                    }
                    closeQueue(obj).then(res => {
                        if (+res.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '关闭成功!'
                            });
                            this.getCrenel(index);
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消关闭'
                    });
                });
        },
        handleDriver(item, index) {
            const obj = {
                id: item.id,
                crenelCode: item.crenelCode,
                currentVehicle: item.nextVehicle,
                crenelStatus: 20,
                version: item.version
            };
            if (!this.timer) {
                clearInterval(this.timer);
            }
            driverReady(obj).then(res => {
                if (+res.code === 0) {
                    this.getCrenel(index);
                }
            });
        },
        getCrenelName() {
            this.getCrenelLists = [];
            this.queueArr.forEach((v, i) => {
                const tempObj = {};
                tempObj.value = v.crenelCode;
                tempObj.lable = v.crenelName;
                this.$set(this.getCrenelLists, i, tempObj);
            });
        },
        getCrenel(index = 0) {
            if (!this.timer) {
                clearInterval(this.timer);
            }
            getCrenelList().then(res => {
                if (+res.code === 0) {
                    const { list } = res.data;
                    this.queueArr = list;
                    if (list.length) {
                        this.getItemLsit(index);
                    }
                }
            });
        },
        // 新增排队
        handleCommit() {
            this.dialogFormVisible = false;
            const obj = {};
            this.queueArr.map(v => {
                if (v.crenelName === this.crenelCode) {
                    obj.id = v.id;
                    obj.version = v.version;
                }
            });
            const params = {
                crenelCode: this.crenelCode,
                currentVehicle: this.licenseNum,
                ...obj
            };
            if (!this.timer) {
                clearInterval(this.timer);
            }
            addQueue(params).then(res => {
                if (+res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                    this.getCrenel(this.currentIndex);
                }
            });
        },
        // 点击删除排队车牌
        handleDeleteQueue(value) {
            this.$confirm('是否确认删除该车牌的排队？', '确认删除？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
            })
                .then(() => {
                    const params = {};
                    this.queueArr.map(v => {
                        if (v.queueList && v.queueList.indexOf(value) !== -1) {
                            params.id = v.id;
                            params.currentVehicle = value;
                        }
                    });
                    if (!this.timer) {
                        clearInterval(this.timer);
                    }
                    deleteQueue(params).then(res => {
                        if (+res.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getCrenel();
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除!'
                    });
                });
        },
        handleAddQueue() {
            this.dialogFormVisible = true;
            this.crenelCode = this.crenel
                ? this.crenel
                : this.getCrenelLists[0] && this.getCrenelLists[0].lable;
        }
    },
    created() {
        this.timer = setInterval(() => {
            this.getCrenel();
        }, 60000);
        this.getCrenel();
    },
    computed: {
        getCrenelLists() {
            return this.queueArr.map(item => {
                return {
                    value: item.crenelCode,
                    lable: item.crenelName
                };
            });
        }
    }
};
</script>
<style lang="less">
  .queue-container {
    .closeBtn {
      font-size: 12px;
      float: right;
      color: #ccc;
      cursor: pointer;
    }
    .disappear {
      font-size: 0;
    }
    .sideBar {
      display: flex;
      flex-direction: column;
      width: 100%;
      .s-title {
        background: #eef0f2;
        padding: 10px;
        margin-bottom: 10px;
      }
    }
    .s-list {
      background: #fafbfc;
      padding-bottom: 50px;
      .detail {
        background: #f3f4f5;
      }
    }
    .lis {
      height: 30px;
      padding: 0 10px;
      line-height: 30px;
      color: #333;
      font-size: 14px;
      .el-col {
        height: 30px;
      }
    }
    .queue-list {
      display: flex;
      flex-wrap: wrap;
      background: #f6fcfe;
      border-top: 1px solid #e4e4e4;
      border-left: 1px solid #e4e4e4;
    }
    .current {
      background: #f6f8fa;
    }
    .crenel {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      height: 130px;
      padding: 10px;
      border-right: 1px solid #e4e4e4;
      border-bottom: 1px solid #e4e4e4;
      .top {
        display: flex;
        height: 20px;
        justify-content: space-between;
        align-items: center;
      }
      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
      .btns {
        display: flex;
        justify-content: space-around;
        font-size: 12px;
        color: #fff;
        > div {
          padding: 5px 10px;
          background: #ff4425;
          border-radius: 2px;
          cursor: pointer;
        }
        .driver {
          background: #00bcbf;
        }
      }
    }
    .queue {
      font-size: 12px;
      color: #666;
      span {
        color: #00bcbf;
      }
    }
    .crenel-status {
      text-align: center;
      .carNum {
        font-size: 14px;
        margin-bottom: 5px;
      }
      .status {
        font-size: 12px;
        color: #999;
      }
      .calling {
        font-size: 12px;
        color: #00bcbf;
      }
      .disabled {
        font-size: 12px;
        color: #999999;
      }
    }
    .active {
      background: #fff8f0;
      outline: 1px solid #ff8800;
    }
    .el-dialog__header {
      padding: 10px 20px;
    }
    .el-dialog__title {
      font-size: 14px;
      color: #121212;
      line-height: 14px;
    }
    .el-dialog__headerbtn {
      top: 10px;
    }
    .el-dialog__body {
      padding: 30px;
      padding-bottom: 20px;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
    .el-form-item__label {
      font-size: 14px;
      color: #333333;
    }
    .el-dialog__footer {
      border-top: 1px solid #e6e6e6;
      padding: 15px 20px;
    }
    .el-select {
      width: 100%;
    }
  }
</style>