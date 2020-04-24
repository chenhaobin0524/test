<template>
   <div class="demo-export" v-has='resourceId||""'>
        <el-button :type="exportType?exportType:'defult'" icon='el-icon-upload2' size="mini" @click="mexport" :loading='loading'><slot name="button-name"></slot></el-button>
    </div>
</template>
<script>
import request from '@/utils/http';
export default {
    name: 'mExport',
    data() {
        return {
            loading: false
        };
    },
    props: {
        params: Object,
        url: String,
        name: String,
        exportType: String,
        resourceId: String
    },
    methods: {
        mexport() {
            const p1 = new Promise((resolve) => {
                this.loading = true;
                this.$emit('exportSearchChange');
                resolve(this.params);
            });
            p1.then(() => {
                request({
                    url: this.url,
                    method: 'post',
                    data: {
                        ...this.params
                    },
                    responseType: 'arraybuffer'
                }).then(res => {
                    if (res) {
                        const blob = new Blob([res], {
                            type: 'application/x-excel;charset=UTF-8'
                        });
                        const objectUrl = URL.createObjectURL(blob);
                        var a = document.createElement('a');
                        a.href = objectUrl;
                        a.download = this.name;
                        a.click();
                        this.$message.success('导出成功');
                        this.loading = false;
                    }
                    this.loading = false;
                })
                    .catch(() => {
                        this.$message.error('导出失败');
                        this.loading = false;
                    });
            });
            this.$emit('onExport');
        }
    }
};
</script>
<style lang='less'>
    .demo-export {
        display: inline-block;
        .upload-demo {
            margin-bottom: 10px;
        }
        .el-progress {
            display: inline-block;
            width: 200px;
        }
        .el-upload__input {
            display: none;
        }
        h1 {
            font-size: 1.5em
        }
        .el-table th, .el-table td {
            text-align: center
        }
    }
    .demo-export + .el-button {
        margin-left: 10px;
    }
    .el-button + .demo-export {
        margin-left: 10px;
    }
</style>