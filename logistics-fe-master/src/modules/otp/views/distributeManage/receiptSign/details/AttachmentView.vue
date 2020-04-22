<template>
    <!-- 附件 弹框 -->
    <el-dialog
        :closeOnClickModal='false'
        class="attachment receiptSignattachment"
        title="附件查看"
        :visible="true"
        :before-close="beforeClose"
        width="50%"
        append-to-body>

        <div class="attachmentTitle">
            <span>上传人：{{updateUserName}}</span>
            <div style="padding-left: 70px;" v-show="imgArr.length">{{ carouselIndex + 1 + ' / ' + imgArr.length}}</div>
            <span>上传时间：{{updateTime}}</span>
        </div>

        <div class="attachmentLeft">
            <div style="height: 400px;">
                <ul id='deliveryViewers' style="display: none;">
                    <li v-for='(item, index) in imgArr' :key='index'>
                        <img :src="item.filePath + '?certification=' + certification">
                    </li>
                </ul>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
import { deliveryFiles } from '../../../../api/receiptSign';
export default {
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
            viewer: {},
            carouselIndex: 0, // 轮播图当前的索引
            imgArr: [],
            updateUserName: '',
            updateTime: ''
        };
    },
    methods: {
        beforeClose() {
            this.$emit('update:attachmentShow', false);
        },
        updateViewer() {
            this.carouselIndex = 0;
            this.updateInfo();
            if (this.viewer.images) this.viewer.destroy();
            setTimeout(() => {
                this.initViewer();
            });
        },
        updateInfo() {
            this.updateUserName = this.imgArr[this.carouselIndex].updateUserName;
            this.updateTime = this.imgArr[this.carouselIndex].updateTime;
        },
        initViewer() {
            const barOptions = { show: true, size: 'small' };
            this.viewer = new Viewer(document.getElementById('deliveryViewers'), {
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
            this.imgArr = [];
            const params = {
                orderNo: this.rowData.orderNo,
                pageNo: 1,
                pageSize: 100000
            };
            deliveryFiles(params).then(res => {
                if (res && +res.code === 0) {
                    const files = res.data.list || [];
                    if (files.length > 0) {
                        files.forEach(item => {
                            this.imgArr.unshift(item);
                        });
                        this.updateUserName = this.imgArr[0].updateUserName;
                        this.updateTime = this.imgArr[0].updateTime;
                        this.$nextTick(() => {
                            this.initViewer();
                        });
                    }
                }
            });
        }
    },
    created() {
        this.getImgList();
    },
    beforeDestroy() {
        if (this.viewer.images) this.viewer.destroy();
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
    }
}
</style>
