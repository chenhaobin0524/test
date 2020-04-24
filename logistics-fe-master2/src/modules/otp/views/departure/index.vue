<template>
    <div class="departure">
        <div class="content">
            <speed></speed>
        </div>
        <Vehicle :infoData="infoData"></Vehicle>
    </div>
</template>

<script>
import speed from '../../components/speed';
import Vehicle from '../../components/Vehicle';

export default {
    components: {
        speed,
        Vehicle
    },
    data() {
        return {
            infoData: [
                {
                    title: '车辆信息',
                    subItems: [
                        {
                            label: '司机',
                            value: '黎明'
                        },
                        {
                            label: '车牌号',
                            value: '粤A9090'
                        },
                        {
                            label: '承认商',
                            value: '北京物流公司'
                        }
                    ]
                },
                {
                    title: '费用信息',
                    subItems: [
                        {
                            lfName: '运输成本',
                            lfTitle: '1344元'
                        },
                        {
                            lfName: '油卡结付',
                            lfTitle: '45663元'
                        },
                        {
                            lfName: '预付金额',
                            lfTitle: '13333元'
                        },
                        {
                            lfName: '预付金额a',
                            lfTitle: '13333a元'
                        },
                        {
                            lfName: '预付金额d',
                            lfTitle: '13333d元'
                        }
                    ]
                },
                {
                    title: '其他信息',
                    subItems: [
                        {
                            lfName: '直通宝标识',
                            lfTitle: '其他'
                        },
                        {
                            lfName: '信用费用',
                            lfTitle: '0'
                        },
                        {
                            lfName: '备注',
                            lfTitle: ''
                        }
                    ]
                }
            ]
        };
    },
    mounted() {}
};
</script>

<style lang="less">
@import "../departure/styles/common.less";
</style>