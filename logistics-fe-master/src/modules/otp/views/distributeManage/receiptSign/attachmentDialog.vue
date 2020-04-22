<template>
    <!-- 附件 弹框 -->
    <el-dialog
        :closeOnClickModal='false'
        class="attachment receiptSignattachment"
        title="附件查看"
        :visible="true"
        :before-close="beforeClose"
        width="40%">

        <div class="attachmentTitle">
            <span>上传人：{{updateUserName}}</span>
            <div style="padding-left: 70px;" v-show="imgArr.length">{{ carouselIndex + 1 + ' / ' + imgArr.length}}</div>
            <span>上传时间：{{updateTime}}</span>
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
                v-has='"04050004"'
                :dialogLoading='loading'
                @callback='uploadResponse'>
                <i class="el-icon-plus pictures"></i>
            </upload>
            <i class="el-icon-delete" @click="deleteBtn" v-has='"04050005"'></i>
            <i class="el-icon-download" @click="downloadBtn" v-has='"04050006"'></i>
        </div>

    </el-dialog>
</template>

<script>
import { receiptDeleteReceiptpicture, receiptUpload } from '../../../api/receiptSign';
import common from '@/utils/common';
import upload from './upload.vue';
import { mapState } from 'vuex';
import Viewer from 'viewerjs';
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
        },
        certification: {
            type: String,
            default() {
                return '';
            }
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
            const params = {
                createUserName: this.user.userName,
                createUserCode: this.user.userCode,
                signFileUpload: 'N',
                taskNoList: [this.rowData.taskNo],
                receiptSource: '10'
            };
            params.fileUrls = response.map(item => item.data.downUrl);
            receiptUpload(params).then(res => {
                if (res) {
                    if (res.data.length > 0) {
                        let message = '';
                        res.data.forEach(item => {
                            message += `<div style='line-height: 30px;'>
                                        <span style='color: #909399;'>图片</span>
                                        <span style='color: #F56C6C;'>${item.pictureName}</span>
                                        <span style='color: #409EFF;'>${item.message}</span>
                                    <div>`;
                        });
                        const duration = 5000 + res.data.length * 1500;
                        this.$message({
                            type: 'warning',
                            duration,
                            dangerouslyUseHTMLString: true,
                            message,
                            showClose: true
                        });
                    } else {
                        this.updateUserName = this.user.userName;
                        this.updateTime = common.formatDateTime(res.timestamp);
                        params.fileUrls.forEach(item => {
                            this.imgArr.unshift({ filePath: item, updateUserName: this.updateUserName, updateTime: this.updateTime });
                            this.rowData.files.push({ filePath: item, updateUserName: this.updateUserName, updateTime: this.updateTime });
                        });
                        this.$message.success('上传成功');

                        this.updateViewer();
                    }
                }
            });
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
                taskNo: this.rowData.taskNo,
                filePath: this.imgArr[this.carouselIndex].filePath
            };
            receiptDeleteReceiptpicture(params).then(res => {
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
            this.rowData.files.forEach(item => {
                this.imgArr.unshift(item);
            });
            this.updateUserName = this.imgArr[0].updateUserName;
            this.updateTime = this.imgArr[0].updateTime;

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
        this.viewer.destroy();
    }
};
</script>

<style lang="less">
.receiptTile {
    .attachment {
        .attachmentTitle {
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
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
}
</style>
