<template>
    <div class="battlements" v-loading='loading'>
        <div class="battlements-list">
            <div class="battlements-one"
                v-for="(item, index) in dataList"
                :class="{ 'active-battlement': index === current }"
                :key="index"
                @click="click(index)">

                <div class="battlements-title" :class="{ 'bat-unavailable': item.crenelStatus === 0 }">
                    <div class="battlements-name">{{item.crenelName}}</div>
                    <div class="battlements-status"
                        :class="{'bat-working': item.crenelStatus === 20 }">
                        {{item.crenelStatusText}}
                    </div>
                </div>

                <div class="storage-area-list">
                    <div class="storage-area-name" v-for="(locItem,index) in item.locList" :key="index"
                        :class="{ 'active-st': locItem.locStatus === 20, 'bat-unavailable': item.crenelStatus === 0 }">
                        {{locItem.locCode}}
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: 'battlements',
    data() {
        return {
            current: 0
        };
    },
    props: {
        dataList: Array,
        loading: Boolean
    },
    methods: {
        click(index) {
            this.$emit('currentIndex', index);
            this.current = index;
        }
    }
};
</script>
<style lang='less'>
.battlements {
    background: #fff;
    padding: 10px;
    .battlements-list {
        overflow-y: hidden;
        overflow-x: auto;
        white-space: nowrap;
        padding: 8px;
        min-height: 100px;
    }
    .battlements-one {
        height: 80px;
        border: 1px solid #E4E4E4;
        position: relative;
        display: inline-block;
        padding: 10px;
        margin-left: -1px;
    }
    .active-battlement {
        border: 1px solid #00BCBF;
        z-index: 1000;
    }
    .storage-area-list {
        overflow-y: hidden;
        overflow-x: auto;
        white-space: nowrap;
        height: 46px;
        min-width: 70px;
    }
    .storage-area-name {
        display: inline-block;
        height: 34px;
        width: 48px;
        border: 1px solid #E4E4E4;
        margin-top: 10px;
        line-height: 34px;
        text-align: center;
        font-size: 14px;
        font-weight: normal;
        color: #333333;
        border-radius: 2px;
    }
    .active-st {
        background-color: #00BCBF;
        color: #ffffff;
        border: 0;
    }
    .storage-area-name + .storage-area-name {
        margin-left: 6px;
    }
    .battlements-name {
        display: inline-block;
        line-height: 34px;
    }
    .battlements-status {
        display: inline-block;
        line-height: 34px;
        color: #999999;
    }
    .bat-working {
        color: #00BCBF;
    }
    .battlements-title {
        display: flex;
        justify-content: space-around;
        border-radius: 2px;
    }
    .bat-unavailable {
        background: #F0F0F0;
        border: 0;
        color: #333333;
    }
}
</style>
