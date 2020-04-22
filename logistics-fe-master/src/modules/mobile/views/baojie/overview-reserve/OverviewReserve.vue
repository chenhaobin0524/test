<template>
    <div>
        <Battlements @currentIndex='currentIndex' :loading='loading' :dataList='crenelList'></Battlements>
        <TimeLine :crenel='crenel' :currentDate='currentDate' ref='TimeLine'></TimeLine>
    </div>
</template>
<script>
import Battlements from './Battlements.vue';
import TimeLine from './TimeLine.vue';
import api from '@/modules/mobile/api/njdc/njdc.js';
import common from '@/utils/common.js';

export default {
    // name: 'overviewReserve',
    components: { Battlements, TimeLine },
    data() {
        return {
            crenel: {},
            currentDate: '',
            timeNum: 0,
            crenelList: [],
            cancelRequest: () => {}, // 调用 取消上一次发送的未响应的异步请求
            loading: false
        };
    },
    methods: {
        // 定时获取新数据
        sendRequest() {
            this.timeNum = setTimeout(() => {
                this.getCrenelList();
            }, 20000);
        },
        currentIndex(index) {
            this.crenel = this.crenelList[index];
        },
        getCrenelList() {
            return api.crenels({ pageSize: 10000, pageNo: 1, method: 'get' }, (c) => { this.cancelRequest = c; }).then(res => {
                if (res) {
                    const crenelStatus = {
                        '0': '不可用',
                        '10': '呼叫中', // 这个应该用不到, 先写着预留不影响
                        '20': '作业中',
                        '30': '空闲'
                    };
                    res.data.list.forEach(item => {
                        item.crenelStatusText = crenelStatus[item.crenelStatus];
                    });
                    this.crenelList = res.data.list;
                    this.currentDate = common.formatDateTime(res.timestamp);
                    this.sendRequest();
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        }
    },
    async created() {
        this.loading = true;
        await this.getCrenelList();
        if (this.crenelList.length > 0) {
            this.currentIndex(0);
        }
    }
};
</script>
