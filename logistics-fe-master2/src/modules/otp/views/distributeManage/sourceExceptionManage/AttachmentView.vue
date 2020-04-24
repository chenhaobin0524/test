<template>
    <!-- 附件 弹框 -->
    <el-dialog
        :closeOnClickModal='false'
        class="otp-common-attachment-view"
        :title="titleName"
        :visible="true"
        :before-close="beforeClose"
        width="40%">

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
                    <li v-for='(item, index) in imgArr' :key='index'>
                        <img :src="item.filePath + '?certification=' + certification">
                    </li>
                </ul>
            </div>
        </div>

        <div class="uploader">
            <upload
                ref="attachmentUpload"
                :dialogLoading='loading'
                @callback='uploadResponse'
                :onBeforeUpload="onBeforeUpload" :limit="limit"
                v-if="!(+rowData.indicationOfSource === 10 && +rowData.processingStatus !== 10)">
                <i class="el-icon-plus pictures"></i>
            </upload>
            <i class="el-icon-delete" @click="deleteBtn" v-if="!(+rowData.indicationOfSource === 10 && +rowData.processingStatus !== 10)"></i>
            <i class="el-icon-download" @click="downloadBtn" v-if="!(+rowData.indicationOfSource === 10 && +rowData.processingStatus !== 10)"></i>
        </div>

    </el-dialog>
</template>

<script>
import { deletePicture } from '../../../api/sourceExceptionManage';
import Upload from '../../../components/upload/Upload';
import { mapState } from 'vuex';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';

export default {
    components: {
        Upload
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
        },
        certification: {
            type: String,
            default() {
                return '';
            }
        },
        titleName: {
            type: String,
            default: '附件查看'
        },
        updateUserProp: {
            type: String,
            default: 'uploadUserName'
        },
        updateTimeProp: {
            type: String,
            default: 'uploadTime'
        },
        limit: {
            type: Number,
            default: 10
        },
        onBeforeUpload: {
            type: Function
        }
    },
    data() {
        return {
            dialogLoading: {}, // 弹框loading实例
            viewer: {},
            carouselIndex: 0, // 轮播图当前的索引
            imgArr: [],
            updateUserName: '',
            updateTime: ''
        };
    },
    methods: {
        loading(status = true) {
            if (status) {
                this.dialogLoading = this.$loading({
                    target: '.receiptSignattachment > div',
                    background: 'rgba(255, 255, 255, .7)'
                });
            } else {
                this.dialogLoading.close();
            }
        },
        uploadResponse(response) {
            this.$emit('AttachUploadResponse', response);
        },
        beforeClose() {
            this.$emit('update:attachmentShow', false);
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
        // 删除图片
        deleteBtn() {
            const params = {
                abnormalSingleNumber: this.rowData.abnormalSingleNumber,
                filePath: this.imgArr[this.carouselIndex].filePath
            };
            deletePicture(params).then(res => {
                if (res) {
                    this.imgArr.splice(this.carouselIndex, 1);
                    this.rowData.files.splice(-(this.carouselIndex + 1), 1);
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
            window.location = this.imgArr[this.carouselIndex].filePath + '?certification=' + this.certification;
        },
        updateInfo() {
            this.updateUserName = this.imgArr[this.carouselIndex][this.updateUserProp];
            this.updateTime = this.imgArr[this.carouselIndex][this.updateTimeProp];
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
        updateImgList(files) {
            if (this.viewer.images) this.viewer.destroy();
            this.imgArr = [];
            files.forEach(item => {
                this.imgArr.unshift(item);
            });
            this.updateUserName = this.imgArr.length > 0 ? this.imgArr[0][this.updateUserProp] : '';
            this.updateTime = this.imgArr.length > 0 ? this.imgArr[0][this.updateTimeProp] : '';

            this.$nextTick(() => {
                this.initViewer();
            });
        },
        getImgList() {
            this.rowData.files.forEach(item => {
                this.imgArr.unshift(item);
            });
            this.updateUserName = this.imgArr.length > 0 ? this.imgArr[0][this.updateUserProp] : '';
            this.updateTime = this.imgArr.length > 0 ? this.imgArr[0][this.updateTimeProp] : '';

            this.$nextTick(() => {
                this.initViewer();
            });
        }
    },
    created() {
        this.getImgList();
    },
    computed: {
        ...mapState({ user: state => state.user })
    },
    beforeDestroy() {
        if (this.viewer.images) this.viewer.destroy();
    }
};
</script>

<style lang="less">
.otp-common-attachment-view {
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
        .viewer-backdrop,.viewer-navbar {
            background-color: #fff;
        }
        .viewer-backdrop.viewer-fixed {
            background-color: rgba(0,0,0,.5)
        }
        .viewer-backdrop,.viewer-navbar {
            background-color: #fff;
        }
        .viewer-backdrop.viewer-fixed {
            background-color: rgba(0,0,0,.5)
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
}
</style>
