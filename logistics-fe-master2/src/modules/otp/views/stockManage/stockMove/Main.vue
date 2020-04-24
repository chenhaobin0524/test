<template>
    <paper class="stockMove">
        <m-pane
            ref="tablePage"
            :config="config"
            :totalData="totalData"
            :pageTotal="pageTotal"
            :loading="loading"
            searchId="stockMoveQuery"
            pageID="stockMove"
            :currentPage='currentPage'
            @downloadData-btn="downloadData"
            @reposition-btn="reposition"
            @selectChange="selectChange"
            @searchChange="searchChange"
            @pageChange="pageChange"
            @sizeChange="sizeChange"
        >
            <div slot="table-module-btn">
                <el-tooltip effect="dark" content="导入" placement="bottom">
                    <span v-has="'04010001'">
                        <el-button icon="el-icon-upload2" size="mini" @click="upload"></el-button>
                    </span>
                </el-tooltip>
            </div>
        </m-pane>
        <!-- 文件上传 -->
        <upload :uploadShow.sync='uploadShow' v-if='uploadShow' @load='load'></upload>
    </paper>
</template>

<script>
import mPane from '@/components/otpPanel';
import paper from '@/components/core/paper/Paper';
import config from './config.json';
import upload from './upload';
import { dateTimes } from '../../../judge/configCenter';
import { getDataList, getCertBySDK, repost } from '../../../api/stockMove';
import configs from '@/config/user.env';

export default {
    name: 'stockMove',
    components: { mPane, paper, upload },
    data() {
        return {
            config: config,
            totalData: [],
            pageTotal: 0,
            optionNum: '',
            loading: false,
            currentPage: 1,
            uploadShow: false,
            checkedData: [], // 已选中数据
            searchObj: {
                pageNo: 1,
                pageSize: 10,
                orderBy: 'importTime',
                orderByType: 'desc'
            },
            certification: '',
            bucket: 'lcloud',
            appid: configs.uploadAppId,
            appkey: '0uvCj75cHhLqLf3v4oJf0mjpdVH4extvQDVRm7QF'
        };
    },
    methods: {
        load(val) {
            getDataList(this.searchObj).then(res => {
                this.$refs.tablePage.changeLoading(false);
                var dataList = res.data.list;
                var i = 1;
                dataList.forEach(ref => {
                    ref.hiddenEvent = [];
                    ref.number = '';
                    switch (ref.orderStatus) {
                    case '0':
                        ref.orderStatus = '已上传';
                        break;
                    case '1':
                        ref.orderStatus = '保存中';
                        break;
                    case '2':
                        ref.orderStatus = '已保存';
                        break;
                    case '3':
                        ref.orderStatus = '保存异常';
                        break;
                    case '4':
                        ref.orderStatus = '上架中';
                        break;
                    case '5':
                        ref.orderStatus = '已下发';
                        break;
                    case '6':
                        ref.orderStatus = '上架异常';
                        break;
                    }
                    if (ref.orderStatus !== '保存异常') {
                        ref.hiddenEvent.push('downloadData');
                    }
                    if (ref.orderStatus !== '上架异常') {
                        ref.hiddenEvent.push('reposition');
                    }
                    ref.number = i;
                    i++;
                });
                this.pageTotal = res.data.totalCount;
                this.totalData = dataList || [];
            });
        },
        upload() {
            this.uploadShow = true;
        },
        async downloadData(data) {
            if (!this.certification) {
                this.certification = await this.getCertification();
            }
            window.location.href = `/oss-download/userDownload/${this.appid}/${this.bucket}/${data.errorFileUrl}?certification=${this.certification}`;
        },
        reposition(data) {
            repost({ id: data.id }).then(res => {
                if (res.code === '0') {
                    this.$message.success('上架成功');
                } else {
                    this.$message.error(res.msg);
                }
                this.load();
            });
        },
        selectChange(data) {
        },
        searchChange(data) {
            this.$refs.tablePage.changeLoading(true);
            let createTime, updateTime;
            if (data.createTime && data.createTime.length) {
                createTime = dateTimes(data.createTime[0]);
                updateTime = dateTimes(data.createTime[1]);
                delete data.createTime;
            }
            this.searchObj = {
                pageNo: 1,
                pageSize: this.searchObj.pageSize,
                orderBy: 'importTime',
                orderByType: 'desc',
                ...data,
                createTime,
                updateTime
            };
            this.load();
        },
        pageChange(data) {
            this.searchObj.pageNo = data;
            this.load();
        },
        sizeChange(data) {
            this.searchObj.pageSize = data;
            this.load();
        },
        async getCertification() {
            const res = await getCertBySDK({ appid: this.appid });
            if (res.data && res.data.certification) {
                return res.data.certification;
            }
        }
    },
    mounted() {
        this.load();
    }
};
</script>
<style lang="less">
    .stockMove {

    }
</style>