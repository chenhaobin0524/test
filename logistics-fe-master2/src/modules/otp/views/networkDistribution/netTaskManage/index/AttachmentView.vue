<template>
  <!-- 附件 弹框 -->
  <el-dialog :closeOnClickModal='false' class="net-task-attachment-view receiptSignattachment" :title="titleName"
    :visible="true" :before-close="beforeClose" width="60%">
    <div class="attachment-view-left">
      <div class="attachmentTitle">
        <el-row :gutter="20">
          <el-col :span="13">
            <div class="grid-content bg-purple">
              <span>上传人</span>：
              <span>{{updateUserName}}</span>
            </div>
          </el-col>
          <el-col :span="11">
            <div class="grid-content bg-purple">
              <span>上传时间</span>：
              <span>{{updateTime}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="attachmentLeft">
        <div style="height: 300px;">
          <ul id='viewers' style="display: none;">
            <li v-for='(item, index) in imgArrType' :key='index'>
              <img :src="item.imageUrl + '?certification=' + certification">
            </li>
          </ul>
        </div>
      </div>
      <div class="uploader" v-if="rowData.isShowUpload? false:true">
        <upload ref="attachmentUpload" :dialogLoading='loading' @callback='uploadResponse' :onBeforeUpload="onBeforeUpload" :limit=3>
          <i class="el-icon-plus pictures"></i>
        </upload>
        <i class="el-icon-delete" @click="deleteBtn"></i>
        <i class="el-icon-download" @click="downloadBtn"></i>
      </div>
    </div>
    <div class="attachment-view-right">
      <el-button class="right-btn" v-if="rowData.orderType === 'PO'" @click="branchSignType" :type="imageType === '1' ? 'primary' : ''">网点签收</el-button>
      <el-button class="right-btn" v-if="rowData.orderType === 'PO'" @click="terminalSignType" :type="imageType === '2' ? 'primary' : ''">终端签收</el-button>
      <el-button class="right-btn" @click="inboundType" :type="imageType === '3' ? 'primary' : ''">网点入库</el-button>
      <el-button class="right-btn" @click="serviceType" :type="imageType === '4' ? 'primary' : ''">网点出库</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Upload from '../../../../components/upload/Upload';
import { mapState } from 'vuex';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
import { orderImages, delImages } from '../../../../api/netTaskManage.js';
export default {
    components: {
        Upload
    },
    props: {
        attachmentShow: {
            type: Boolean,
            default () {
                return false;
            }
        },
        rowData: {
            type: Object,
            default () {
                return {};
            }
        },
        certification: {
            type: String,
            default () {
                return '';
            }
        },
        titleName: {
            type: String,
            default: '附件查看'
        },
        onBeforeUpload: {
            type: Function
        }
    },
    data () {
        return {
            dialogLoading: {}, // 弹框loading实例
            viewer: {},
            carouselIndex: 0, // 轮播图当前的索引
            imgArr: [],
            updateUserName: '',
            updateTime: '',
            branchSignImages: [],
            terminalSignImages: [],
            outboundImages: [],
            serviceImages: [],
            imgArrType: [],
            imageType: ''
        };
    },
    methods: {
        loading (status = true) {
            if (status) {
                this.dialogLoading = this.$loading({
                    target: '.receiptSignattachment > div',
                    background: 'rgba(255, 255, 255, .7)'
                });
            } else {
                this.dialogLoading.close();
            }
        },
        uploadResponse (response) {
            this.$emit('attachUploadResponse', response);
        },
        beforeClose () {
            this.$emit('update:attachmentShow', false);
        },
        updateViewer () {
            this.carouselIndex = 0;
            this.updateInfo();
            this.updateImgList();
            this.viewer.destroy();
            setTimeout(() => {
                this.initViewer();
            });
        },
        // 删除图片
        deleteBtn () {
            if (this.imgArr.length === 1) return this.$message.warning('最后一张不允许删除');
            const imageId = this.imgArr[this.carouselIndex].id;
            delImages(imageId).then(res => {
                if (res) {
                    this.imgArr.splice(this.carouselIndex, 1);
                    this.$message.success('删除成功');
                    this.updateViewer();
                }
            }).catch(() => {
                this.$message.error('删除失败');
            });
        },
        downloadBtn () {
            window.location = this.imgArrType[this.carouselIndex].imageUrl + '?certification=' + this.certification;
        },
        updateInfo () {
            this.updateUserName = this.imgArrType[this.carouselIndex].updateUserName;
            this.updateTime = this.imgArrType[this.carouselIndex].updateTime;
        },
        async updateImgList () {
            if (this.viewer.images) this.viewer.destroy();
            await this.getImgList();
            if (this.imageType === '1') {
                this.branchSignType();
            } else if (this.imageType === '2') {
                this.terminalSignType();
            } else if (this.imageType === '3') {
                this.inboundType();
            } else if (this.imageType === '4') {
                this.serviceType();
            }
        },
        initViewer () {
            const barOptions = { show: true, size: 'small' };
            this.viewer = new Viewer(document.getElementById('viewers'), {
                inline: true,
                title: false,
                navbar: true,
                button: true,
                toolbar: {
                    zoomIn: barOptions,
                    zoomOut: barOptions,
                    prev: {
                        show: true,
                        size: 'small',
                        click: () => {
                            if (this.carouselIndex === 0) {
                                this.carouselIndex = this.imgArrType.length - 1;
                            } else {
                                this.carouselIndex -= 1;
                            }
                            this.updateInfo();
                            this.viewer.prev(true);
                        }
                    },
                    reset: barOptions,
                    next: {
                        show: true,
                        size: 'small',
                        click: () => {
                            if (this.carouselIndex === this.imgArrType.length - 1) {
                                this.carouselIndex = 0;
                            } else {
                                this.carouselIndex += 1;
                            }
                            this.updateInfo();
                            this.viewer.next(true);
                        }
                    },
                    rotateLeft: barOptions,
                    rotateRight: barOptions
                }
            });
        },
        async getImgList () {
            this.imgArr = [];
            const params = {
                orderNo: this.rowData.orderNo,
                pageNo: 1,
                pageSize: 1000000000
            };
            await orderImages(params).then(res => {
                const attachmentFileLists = res.data.list || [];
                attachmentFileLists.forEach(item => {
                    this.imgArr.unshift(item);
                });
                if (this.rowData.orderType === 'RI') {
                    this.inboundType();
                } else {
                    this.branchSignType();
                }
            });
        },
        initShow () {
            this.carouselIndex = 0;
            this.updateUserName = this.imgArrType.length > 0 ? this.imgArrType[0].updateUserName : '';
            this.updateTime = this.imgArrType.length > 0 ? this.imgArrType[0].updateTime : '';
            this.$nextTick(() => {
                this.initViewer();
            });
        },
        branchSignType () {
            this.imageType = '1';
            this.$emit('typeChange', '1');
            if (this.viewer.images) this.viewer.destroy();
            this.imgArrType = this.imgArr.filter(item => (+item.type === 1));
            this.initShow();
        },
        terminalSignType () {
            this.imageType = '2';
            this.$emit('typeChange', '2');
            if (this.viewer.images) this.viewer.destroy();
            this.imgArrType = this.imgArr.filter(item => (+item.type === 2));
            this.initShow();
        },
        inboundType () {
            this.imageType = '3';
            this.$emit('typeChange', '3');
            if (this.viewer.images) this.viewer.destroy();
            this.imgArrType = this.imgArr.filter(item => (+item.type === 3));
            this.initShow();
        },
        serviceType () {
            this.imageType = '4';
            this.$emit('typeChange', '4');
            if (this.viewer.images) this.viewer.destroy();
            this.imgArrType = this.imgArr.filter(item => (+item.type === 4));
            this.initShow();
        }
    },
    created () {
        this.getImgList();
    },
    computed: {
        ...mapState({ user: state => state.user })
    },
    beforeDestroy () {
        if (this.viewer.images) this.viewer.destroy();
    }
};
</script>

<style lang="less">
.net-task-attachment-view {
  .el-dialog__body {
    display: flex;
    flex-flow: row;
  }
  .attachmentTitle {
    margin: 10px 0;
  }
  .attachmentLeft {
    position: relative;
    .loadingBox {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: #fff;
      z-index: 1000;
      .progress {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .carousel {
      text-align: center;
      .receiveImgs {
        height: 100%;
      }
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
  .uploader {
    padding-top: 15px;
    text-align: center;

    > div {
      display: inline-block;
    }
    .pictures {
      border-radius: 4px;
      border: 1px dashed #00bcbf;
      color: #00bcbf;
      width: 20px;
      line-height: 20px;
    }
    > i {
      cursor: pointer;
      color: #00bcbf;
      font-size: 22px;
      vertical-align: middle;
      margin-left: 30px;
    }
  }
  .attachment-view-left {
    flex: 1;
  }
  .attachment-view-right {
    width: 120px;
    border-left: 1px solid #ccc;
    .right-btn {
      display: block;
      margin: 25px;
    }
  }
}
</style>
