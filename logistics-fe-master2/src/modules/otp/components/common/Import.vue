<template>
  <div>
    <el-dialog title="导入" id="orderImport" :visible.sync="orderImport" width="50%"
               style="font-size: 18px; margin-top: 6vh;">
      <el-upload
          class="upload-demo"
          ref="upload"
          :on-error='handleError'
          :before-upload="beforeUpload"
          :action="ImportConfig.action"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :auto-upload="!ImportConfig.manualUpload"
          :multiple="ImportConfig.multiple"
          :show-file-list="ImportConfig.showFileList"
          :accept="ImportConfig.accept"
          :on-exceed="handleExceed"
          :limit="1"
          :with-credentials="true"
          :on-success="onSuccess"
          :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <span slot="tip" class="el-upload__tip">上传要求：{{ImportConfig.fileType}}</span>
      </el-upload>

      <el-collapse @change="handleChange">
        <el-collapse-item title="模板" name="1">
          <div class="template_flex" v-for="(item,index) in ImportContent" :key="index">
            <div class="template_left">
              <img src="@/assets/template.png"/>
              <div class="template">
                <div>{{item.fileName}}</div>
                <div>{{item.fileSize}}</div>
              </div>
            </div>
            <div class="template_float">
              <i v-if="item.upLoadFlag" class="el-icon-upload2 modelBtn" @click='handleUpload(item)'></i>
              <i class="el-icon-download modelBtn" @click='handleDownload(item)'></i>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="savaData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

// import request from '@/utils/http';

export default {
    data() {
        return {
            fileList: [],
            orderImport: false,
            upLoadInfo: {}, // 上传信息
            uploadInput: {},
            flag: false // 一个上不了页面的input标签
        };
    },
    created() {
        // 创建导入功能使用的Input标签并添加监听
        this.createInput();
    },
    methods: {
        // 创建导入功能使用的Input标签并添加监听
        createInput() {
            if (!this.flag) {
                return;
            }
            // 创建input标签并添加监听
            this.uploadInput = document.createElement('input');
            this.uploadInput.type = 'file';
        },
        // 上传模板
        handleUpload(item) {
            if (!this.flag) {
                return;
            }
            this.upLoadInfo = item.upLoadInfo;
            this.uploadInput.click();
        },
        beforeUpload (file) {
            const isText = file.type === 'application/vnd.ms-excel';
            const isTextComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            return (isText | isTextComputer);
        },
        // 下载模板
        handleDownload(item) {
            window.location = item.downLoadInfo.url;
        },
        // 上传失败
        handleError() {
            this.$message.error('上传失败');
        },
        orderImportC() {
        //  触发弹窗
            this.orderImport = true;
            this.fileList = [];
        },
        onSuccess(res) {
            this.$message.success('请几分钟后刷新页面查看结果~');
        },
        handleChange(val) {
        // 导入下拉
        },
        handleRemove(file, fileList) {
        // 行内删除
        },
        handlePreview(file) {
        },
        handleExceed(files, fileList) {
            this.$message.warning(`版本暂时不支持同时上传多个文件`);
        },
        savaData() {
            // 保存
            this.$refs.upload.submit();
            this.orderImport = false;
        }
    },
    props: ['ImportConfig', 'ImportContent']
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

      .modelBtn {
        cursor: pointer;
      }
    }

    .el-collapse-item__wrap {
      border-bottom: none;
    }
  }
</style>