<template>
    <el-dialog
        class="areaRulesUploadDialog"
        id="orderImport"
        title="导入"
        :visible="true"
        width="60%"
        :before-close='closeDialog'
        :closeOnClickModal='closeOnClickModal'>

        <el-upload
            :with-credentials='true'
            ref='upload'
            :action='action'
            :multiple='false'
            :limit='1'
            :on-exceed='onExceed'
            :on-success='onSuccess'
            :on-error='onError'
            :before-upload="beforeUpload"
            :file-list="fileList"
            :show-file-list='true'
            :auto-upload="false">
            <el-button size="small" type="primary">点击上传</el-button>
            <span slot="tip" class="el-upload__tip">上传要求：只能上传Excel文件，且不超过500KB</span>
        </el-upload>

        <el-collapse>
            <el-collapse-item title="模板">
                <div class="template_flex" v-for="(item,index) in ImportContent" :key="index">
                    <div class="template_left">
                        <img src="@/assets/template.png"/>
                        <div class="template">
                            <div>{{item.fileName}}</div>
                            <div>{{item.fileSize}}</div>
                        </div>
                    </div>
                    <div class="template_float">
                        <el-tooltip class="item" effect="dark" content="导出" placement="bottom" v-has='"05140001"' v-if='item.filePath'>
                            <el-button type='text' icon="el-icon-download" @click='handleDownload(item, index)'></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="导入" placement="bottom" v-has='"05140002"'>
                            <el-button type='text' icon="el-icon-upload2" @click='handleUpload(index)'></el-button>
                        </el-tooltip>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>

import request from '@/utils/http';
import { getModifyTime } from '../../../api/areaRules';
import { mapState } from 'vuex';
import config from '@/config/user.env';
import md5 from 'js-md5';
import { getCertBySDK, getUploadId, multiUpload, completeMultiUpload } from '@/components/lots/OSS/api.js';

export default {
    props: {
        uploadShow: {
            type: Boolean,
            default() {
                return false;
            }
        }
    },
    data() {
        return {
            closeOnClickModal: false,
            dialogLoading: {}, // 弹框loading实例
            cancelRequest: () => {}, // 调用 取消未响应的鉴权请求
            fileSize: '',
            uploadName: '',
            timeNum: 0,
            bucket: 'lcloud',
            certification: '',
            action: `${config.apiUrl}/api-otp/area/excelImport`,
            modelType: 0,
            fileList: [],
            appid: config.uploadAppId,
            ImportContent: [], // 模板相关信息
            uploadInput: {} // 一个上不了页面的input标签
        };
    },
    methods: {
        loading(status = true) {
            if (status) {
                this.dialogLoading = this.$loading({
                    target: '.areaRulesUploadDialog > div',
                    background: 'rgba(255, 255, 255, .7)'
                });
            } else {
                this.dialogLoading.close();
            }
        },
        onSuccess(res) {
            if (res.code === '0') {
                this.$message.success('上传成功');
                this.closeDialog();
                this.$emit('getTableDataList');
            } else {
                this.$refs.upload.clearFiles();
                this.$message.error(res.msg);
            }
            this.loading(false);
        },
        onError() {
            this.loading(false);
            this.$message.error('上传失败');
        },
        beforeUpload(file) {
            var fileNameArr = file.name.split('.');
            var fileType = fileNameArr[fileNameArr.length - 1];

            const Excel = fileType === 'xls' || fileType === 'xlsx';
            const isLt500KB = file.size / 1024 <= 500;

            if (!Excel) {
                this.$message.error('上传失败，文件格式只能为 xlsx 或 xls');
            } else if (!isLt500KB) {
                this.$message.error('上传文件大小不能超过 500KB');
            }
            return Excel && isLt500KB;
        },
        onExceed() {
            this.$message.error('一次只能上传一个文件');
        },
        closeDialog() {
            this.$emit('update:uploadShow', false);
        },
        confirm() {
            if (this.$refs.upload.uploadFiles.length === 0) {
                this.$message.error('请先上传文件');
                return false;
            }
            this.loading();
            this.$refs.upload.submit();
        },
        // 创建导入功能使用的Input标签并添加监听
        createInput() {
            // 创建input标签并添加监听
            this.uploadInput = document.createElement('input');
            this.uploadInput.type = 'file';
            this.uploadInput.addEventListener('change', async (event) => {
                const file = event.path[0].files[0];
                this.fileSize = file.size + '';
                const fileExt = file.name.replace(/^.*\./, '').toLowerCase();
                const extArr = ['xls', 'xlsx'];
                if (!extArr.includes(fileExt)) {
                    this.$message({
                        type: 'error',
                        message: '上传失败，文件格式只能为 xlsx 或 xls'
                    });
                    event.path[0].value = null;
                    return false;
                }
                // const index = file.name.lastIndexOf('.');
                // const originName = file.name.substring(0, index);
                this.uploadName = '片区导入模板' + '_' + new Date().getTime() + '.' + fileExt;

                const files = new File([file], this.uploadName, {
                    type: file.type
                });

                this.loading();
                this.multipleUpload(files);
                event.path[0].value = null;
            });
        },
        async multipleUpload(uploadData) {
            if (!this.certification) {
                await this.getCertification();
            }
            getUploadId({
                appid: this.appid,
                bucket: this.bucket,
                object: this.uploadName,
                certification: this.certification
            }).then(uploadRes => {
                this.createSlices(uploadData, uploadRes.data.uploadid);
            }).catch(() => {
                this.loading(false);
            });
        },
        async createSlices(uploadData, id) {
            const blob = uploadData;
            let start = 0;
            let end;
            let index = 0;
            const prm = [];
            const parts = [];
            while (start < blob.size) {
                end = start + 10 * 512 * 1024;
                if (end > blob.size) {
                    end = blob.size;
                }
                const chunk = blob.slice(start, end);
                const etag = await this.getEtag(chunk);
                parts.push({
                    partid: (index + 1) + '',
                    size: end - start,
                    etag: '"' + etag + '"'
                });
                prm.push(multiUpload(chunk, {
                    appid: this.appid,
                    bucket: this.bucket,
                    object: this.uploadName,
                    certification: this.certification,
                    index: index + 1,
                    uploadid: id,
                    size: end - start
                }));
                start = end;
                index++;
            }
            Promise.all(prm).then(() => {
                completeMultiUpload({
                    appid: this.appid,
                    bucket: this.bucket,
                    object: this.uploadName,
                    certification: this.certification,
                    uploadid: id,
                    parts: parts
                }).then(() => {
                    const params = {
                        filePath: `${window.location.origin}/oss-download/userDownload/${this.appid}/${this.bucket}/${this.uploadName}`,
                        createUserCode: this.user.userCode,
                        createUserName: this.user.userName,
                        fileSize: this.fileSize,
                        modelType: this.modelType
                    };
                    request({
                        url: '/api-otp/area/saveFileInformation',
                        method: 'post',
                        data: params
                    }).then(res => {
                        if (res) {
                            this.$message.success('上传成功');
                            this.getModel();
                        }
                    }).catch(() => {
                        this.loading(false);
                    });
                }).catch(() => {
                    this.loading(false);
                });
            }).catch(() => {
                this.loading(false);
            });
        },
        async getEtag(chunk) {
            const a = await this.getFileMd5(chunk);
            return a;
        },
        getFileMd5(chunk) {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(chunk);
            return new Promise(function(resolve) {
                fileReader.onload = function (e) {
                    resolve(md5(e.target.result));
                };
            });
        },
        // 上传模板
        handleUpload(index) {
            this.modelType = index ? 0 : 1;
            this.uploadInput.click();
        },
        // 下载模板
        handleDownload(item, index) {
            window.open(item.filePath + '?certification=' + this.certification);
            // 文件下载更名, 上传的接口变更，下边的代码预留
            // const fileName = this.ImportContent[index].fileName;
            // const fileExt = item.filePath.replace(/^.*\./, '').toLowerCase();
            // const fullFileName = fileName + '.' + fileExt;
            // this.loading();
            // request({
            //     url: item.filePath + '?certification=' + this.certification,
            //     responseType: 'blob'
            // }).then(res => {
            //     if (res) {
            //         const MIME = {
            //             xls: 'application/vnd.ms-excel',
            //             xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            //         };
            //         const blob = new Blob([res], { type: MIME[fileExt] });
            //         if (window.navigator.msSaveOrOpenBlob) {
            //             navigator.msSaveBlob(blob, fullFileName);
            //         } else {
            //             const link = document.createElement('a');
            //             link.href = window.URL.createObjectURL(blob);
            //             link.download = fullFileName;
            //             link.click();
            //             window.URL.revokeObjectURL(link.href);
            //         }
            //     }
            //     this.loading(false);
            // }).catch(() => {
            //     this.loading(false);
            // });
        },
        // 获取模板信息
        getModel() {
            getModifyTime().then(res => {
                if (res) {
                    this.ImportContent = res.data;
                    this.loading(false);
                    this.closeOnClickModal = false;
                } else {
                    this.closeDialog();
                }
            }).catch(() => {
                this.closeDialog();
            });
        },
        getCertification() {
            clearTimeout(this.timeNum);
            return getCertBySDK({ appid: this.appid }, (c) => { this.cancelRequest = c; }).then(res => {
                if (res) {
                    this.certification = res.data.certification;
                    this.timeNum = setTimeout(() => {
                        this.getCertification();
                    }, 1000 * 60 * 25);
                } else {
                    this.closeDialog();
                }
            }).catch(() => {
                this.closeDialog();
            });
        }
    },
    async mounted() {
        this.loading();
        this.closeOnClickModal = true;
        // 获取鉴权信息
        await this.getCertification();
        // 获取模板信息
        this.getModel();
        // 创建导入功能使用的Input标签并添加监听
        this.createInput();
    },
    computed: {
        ...mapState({ user: state => state.user })
    },
    beforeDestroy() {
        this.cancelRequest(); // 取消未响应的鉴权请求
        clearTimeout(this.timeNum);
    }
};
</script>

<style lang="less">
  #orderImport {
    .upload-demo {
      margin-top: 20px;
    }
    .el-upload__tip {
      margin-left: 20px;
      color: #999999;
    }

    .el-upload-list {
      padding: 0 10px;
      max-height: 60px;
      overflow-y: auto;
      margin-top: 15px;
    }

    .el-collapse-item__header {
      font-size: 14px;
      background-color: #F2F2F2;
      padding-left: 10px;
      color: #A3A3A3;
      margin-top: 10px;
      height: 40px;
      line-height: 40px;

      .el-icon-document:before {
        content: "\E614";
      }
    }

    .el-collapse {
      border: none;
    }

    .el-collapse-item__content {
      padding-bottom: 10px;
      max-height: 140px;
      overflow-y: auto;
    }

    .el-dialog__body {
      padding: 10px 10px;
    }

    .template_flex {
      display: flex;
      position: relative;
      margin-top: 10px;
      padding: 10px;
      border-bottom: 1px solid #F2F2F2;
    }

    .template_left {
      display: flex;
    }

    .template_left img {
      width: 30px;
      height: 40px;
    }

    .template {
      margin-left: 15px;
      font-size: 12px;
    }

    .template_float {
      font-size: 14px;
      letter-spacing: 10px;
      color: #00BCBF;
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
    }

    .el-collapse-item__wrap {
      border-bottom: none;
    }
  }
</style>