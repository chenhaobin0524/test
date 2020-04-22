<template>
    <!-- 附件 弹框 -->
    <el-dialog
        :closeOnClickModal='closeOnClickModal'
        class="attachment transferConfirmPhotoDialog"
        title="附件查看"
        :visible="true"
        :before-close="beforeClose"
        width="35%">

        <div class="attachmentTitle">
            <el-row :gutter="20">
                <el-col :span="10">
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
                    <li v-for='(item, index) in imgArr' :key='index'>
                        <img :src="item.filePath + '?certification=' + certification">
                    </li>
                </ul>
            </div>
        </div>

        <div class="uploader">
            <upload
                v-has='"04070001"'
                @callback='uploadResponse'
                :dialogLoading='loading'
                >
                <i class="el-icon-plus pictures"></i>
            </upload>
            <i class="el-icon-delete" @click="deleteBtn" v-has='"04070002"'></i>
            <i class="el-icon-download" @click="downloadBtn" v-has='"04070003"'></i>
        </div>

    </el-dialog>
</template>

<script>
import { deleteTransferpicture, uploadTransfer } from '../../../api/transferConfirm.js';
import common from '@/utils/common';
import upload from '../../../views/distributeManage/receiptSign/upload.vue';
import { getCertBySDK } from '@/components/lots/OSS/api.js';
import { mapState } from 'vuex';
import Viewer from 'viewerjs';
import configs from '@/config/user.env';
import 'viewerjs/dist/viewer.css';

export default {
    components: {
        upload
    },
    props: {
        attachmentShow: {
            type: Boolean,
            default() {
                return false;
            }
        },
        rowData: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            viewer: {},
            cancelRequest: () => {}, // 调用 取消未响应的鉴权请求
            closeOnClickModal: false,
            certification: '', // 鉴权信息
            carouselIndex: 0, // 轮播图当前的索引
            imgArr: [],
            updateUserName: '',
            updateTime: '',
            dialogLoading: {}, // 弹框loading实例
            timeNum: 0
        };
    },
    methods: {
        loading(status = true) {
            if (status) {
                this.dialogLoading = this.$loading({
                    target: '.transferConfirmPhotoDialog > div',
                    background: 'rgba(255, 255, 255, .7)'
                });
            } else {
                this.dialogLoading.close();
            }
        },
        // 获取鉴权信息
        getCertification() {
            this.loading();
            this.closeOnClickModal = true;

            clearTimeout(this.timeNum);
            return getCertBySDK({ appid: configs.uploadAppId }, (c) => { this.cancelRequest = c; }).then(res => {
                if (res) {
                    this.certification = res.data.certification;

                    this.timeNum = setTimeout(() => {
                        this.getCertification();
                    }, 1000 * 60 * 25);

                    this.loading(false);
                    this.closeOnClickModal = false;
                } else {
                    this.beforeClose();
                }
            }).catch(() => {
                this.beforeClose();
            });
        },
        uploadResponse(response) {
            const params = {
                createUserName: this.user.userName,
                createUserCode: this.user.userCode,
                transferNo: this.rowData.transferNo
            };
            params.fileUrls = response.map(item => item.data.downUrl);
            uploadTransfer(params).then(res => {
                if (res) {
                    this.updateUserName = this.user.userName;
                    this.updateTime = common.formatDateTime(res.timestamp);
                    params.fileUrls.forEach(item => {
                        this.imgArr.unshift({ filePath: item, updateUserName: this.updateUserName, updateTime: this.updateTime });
                        this.rowData.fileList.push({ filePath: item, updateUserName: this.updateUserName, updateTime: this.updateTime });
                    });
                    this.$message.success('上传成功');

                    this.updateViewer();
                }
            }).catch(() => {
                this.$message.error('上传失败');
            });
        },
        updateViewer() {
            this.carouselIndex = 0;
            this.updateInfo();
            // this.$nextTick(() => {
            //     this.viewer.update(); // update有bug，删除最后一张图片会报错，另辟蹊径
            // });
            this.viewer.destroy();
            setTimeout(() => {
                this.initViewer();
            });
        },
        beforeClose() {
            this.$emit('update:attachmentShow', false);
        },
        // 删除图片
        deleteBtn() {
            const params = {
                transferNo: this.rowData.transferNo,
                filePath: this.imgArr[this.carouselIndex].filePath
            };
            deleteTransferpicture(params).then(res => {
                if (res) {
                    this.imgArr.splice(this.carouselIndex, 1);
                    this.rowData.fileList.splice(-(this.carouselIndex + 1), 1);
                    this.$message.success('删除成功');
                    if (this.imgArr.length === 0) {
                        this.rowData.showPhotos = false;
                        this.beforeClose();
                        return false;
                    }
                    this.updateViewer();
                }
            }).catch(() => {
                this.$message.error('删除失败');
            });
        },
        downloadBtn() {
            window.location = this.imgArr[this.carouselIndex].filePath;
        },
        updateInfo() {
            this.updateUserName = this.imgArr[this.carouselIndex].updateUserName;
            this.updateTime = this.imgArr[this.carouselIndex].updateTime;
        },
        initViewer() {
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
                                this.carouselIndex = this.imgArr.length - 1;
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
                            if (this.carouselIndex === this.imgArr.length - 1) {
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
        getImgList() {
            this.rowData.fileList.forEach(item => {
                this.imgArr.unshift(item);
            });
            this.updateUserName = this.imgArr[0].updateUserName;
            this.updateTime = this.imgArr[0].updateTime;

            this.$nextTick(() => {
                this.initViewer();
            });
        }
    },
    async mounted () {
        // 获取鉴权信息
        await this.getCertification();
        this.getImgList();
    },
    computed: {
        ...mapState({ user: state => state.user })
    },
    beforeDestroy() {
        this.cancelRequest(); // 取消未响应的鉴权请求
        clearTimeout(this.timeNum);
        this.viewer.destroy();
    }
};
</script>

<style lang="less">
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
.attachment {
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
}
</style>
