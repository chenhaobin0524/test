<template>
  <paper class="net-task">
    <m-pane ref="tablePage" :config="config" :pageTotal="pageTotal" :loading="loading" :totalData="totalData"
      :searchTotalTitle="config.searchTotalTitle"
      @selectChange="selectChange" @searchChange="searchChange" @pageChange="pageChange" @sizeChange="sizeChange"
      @row-db-click="rowDBclick">
      <!-- <div slot="table-module-btn">
        <el-tooltip effect="dark" content="导出" placement="bottom" v-has="'10030001'">
          <span class="mgl-10">
            <el-button icon="el-icon-download" size="mini" @click="exportFile"></el-button>
          </span>
        </el-tooltip>
      </div> -->
      <!-- <div slot="page-module-btn">
        <span>
          <el-button type="primary" @click="handleAppointNote" v-has="'10030003'">预约备注</el-button>
        </span>
        <span class="page-module-btn">
          <el-button type="primary" @click="handleNetDispatch" v-has="'10030004'">网点派工</el-button>
        </span>
        <span class="page-module-btn">
          <el-button type="primary" @click="mulAllTypeUpload" v-has="'10030005'">附件上传</el-button>
        </span>
      </div> -->
    </m-pane>
  </paper>
</template>

<script>
import mPane from '@/components/otpPanel';
import paper from '@/components/core/paper/Paper';
import config from './config.js';
import formatTime from '@/utils/common.js';
import { transportData } from '../../../../api/transportDetails';
export default {
    name: 'transportPage',
    components: { paper, mPane },
    data () {
        return {
            config,
            pageTotal: 0,
            loading: false,
            selected: [],
            totalData: [],
            searchParams: {
                pageSize: 10,
                pageNo: 1
            }
        };
    },
    methods: {
        load () {
            this.getList();
        },
        searchChange (data) {
            if (data.createTime && data.createTime.length > 0) {
                data.beginDate = formatTime.formatDateTime(data.createTime[0]);
                data.endDate = formatTime.formatDateTime(data.createTime[1]);
            } else if (!data.createTime) {
                data.beginDate = '';
                data.endDate = '';
            }
            delete data.createTime;
            this.searchParams = {
                ...this.searchParams,
                ...data,
                pageNo: 1
            };
            // if (!this.searchParams.orderNo && !this.searchParams.beginDate) return this.$message.warning('订单号 或 时间必须选一个进行查询！');
            this.getList();
        },
        getList () {
            this.loading = true;
            const initialTime = this.$refs.tablePage.$refs.searchList.searchData.createTime;
            var params = {
                beginDate: initialTime ? formatTime.formatDateTime(initialTime[0]) : '',
                endDate: initialTime ? formatTime.formatDateTime(initialTime[1]) : ''
            };
            this.searchParams = {
                ...params,
                ...this.searchParams
            };
            transportData(this.searchParams).then(res => {
                this.loading = false;
                if (res && +res.code === 0) {
                    this.totalData = res.data.list || [];
                    this.pageTotal = res.data.totalCount;
                    this.totalData.forEach(item => {
                        item.taskStatusName = window.sessionStorage.TRANSPORT_STATUS ? (JSON.parse(window.sessionStorage.TRANSPORT_STATUS))[item.taskStatus] : item.taskStatus;
                        item.orderTypeName = window.sessionStorage.ORDER_TYPE ? (JSON.parse(window.sessionStorage.ORDER_TYPE))[item.orderType] : item.orderType;
                        item.deliveryTypeName = window.sessionStorage.DELIVERY_TYPE ? (JSON.parse(window.sessionStorage.DELIVERY_TYPE))[item.deliveryType] : item.deliveryType;
                        item.taskTypeName = window.sessionStorage.TASK_TYPE ? (JSON.parse(window.sessionStorage.TASK_TYPE))[item.taskType] : item.taskType;
                    });
                }
            }).catch(() => {
                this.loading = false;
            });
        },
        pageChange (data) {
            this.searchParams.pageNo = data;
            this.getList();
        },
        sizeChange (data) {
            this.searchParams.pageSize = data;
            this.getList();
        },
        selectChange (data) {
            this.selected = data;
        },
        // exportFile () {
        //     const params = { ...this.searchParams };
        //     Reflect.deleteProperty(params, 'pageNo');
        //     Reflect.deleteProperty(params, 'pageSize');
        //     netTaskExport(params).then(res => {
        //         if (res) this.$message.success('已发送导出请求，请稍后到右上角“用户文件列表”中下载');
        //     });
        // },
        rowDBclick (row) {
            this.$router.push({
                query: { taskNo: row.taskNo },
                path: '/distribute/transport-details'
            });
        }
    },
    mounted() {
        // this.getList();
    }
};
</script>
<style lang="less">
.net-task {
  .page-module-btn {
    margin-left: 10px;
  }
  .viewer-backdrop,
  .viewer-navbar {
    background-color: #fff;
  }
  .viewer-backdrop.viewer-fixed {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .viewer-backdrop {
    background-color: #fff;
  }
  .viewer-backdrop.viewer-fixed {
    background-color: rgba(0, 0, 0, 0.5);
    .viewer-navbar {
      height: auto;
    }
  }
  .viewer-navbar {
    height: 0;
  }
  .viewer-button {
    width: 60px;
    height: 60px;
    top: -30px;
    right: -30px;
  }
  .viewer-button::before {
    bottom: 10px;
    left: 10px;
  }
  .viewer-button.viewer-fullscreen-exit {
    width: 80px;
    height: 80px;
    top: -40px;
    right: -40px;
  }
  .viewer-button.viewer-fullscreen-exit::before {
    bottom: 15px;
    left: 15px;
  }
  .viewer-toolbar > ul > .viewer-small {
    margin: 3px;
  }
}
</style>