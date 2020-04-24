<template>
    <div class="task-detail_top-progress">
        <div class="top-progress_left">
            <div class="text-grey">任务单号：</div>
            <div class="taskNo"> {{taskNo}}</div>
        </div>
        <div class="top-progress_right">
            <div class="progress-list">
                <div class="progress-item" :class="{'success': item.actualTime, 'warning': item.timeoutFlag === 'Y'}" v-for="(item, index) in progress" :key="item.id + '' + index">
                    <el-tooltip placement="top">
                        <div slot="content">
                            计划：{{item.planTime || '--'}}
                            <br/>
                            实际：{{item.actualTime || '--'}}
                        </div>
                        <div>
                            <div class="aging-time">{{item.agingTime || '--'}}h</div>
                            <div class="aging-text">{{item.orderStatusName || '--'}}</div>
                        </div>
                    </el-tooltip>
                    <!-- <div class="aging-plantime text-grey">计划：{{item.planTime || '--'}}</div>
                    <div class="aging-acttime text-grey">实际：{{item.actualTime || '--'}}</div> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        taskNo: String,
        progress: Array
    },
    data() {
        return {
        };
    }
};
</script>
<style lang="less">
.task-detail_top-progress{
    padding: 5px 0;
    display: flex;
    font-size: 14px;
    .text-grey{
        color: #999;
    }
    .top-progress_left{
        flex: 0;
        flex-basis: 200px;
        line-height: 1.5;
        padding: 0 10px;
        align-self: center;
    }
    .top-progress_right{
        flex: 0;
        border-left: 1px solid #d6d6d6;
        overflow: hidden;
        flex-basis: calc( 100% - 200px);
    }
    .progress-list{
        white-space: nowrap;
        overflow-x: scroll;
    }
    .progress-item{
        text-align: center;
        display: inline-block;
        width: 220px;
        position: relative;
        .aging-time {
            width: 36px;
            line-height: 36px;
            background: #ccc;
            color: #fff;
            font-size: larger;
            border-radius: 50%;
            margin: 0 auto;
            box-shadow: grey 1px 2px 5px;
        }
        .aging-text, .aging-plantime {
            margin-top: 5px;
        }
        &.success{
            .aging-time{
                background: #00bcbf;
            }
        }
        &.warning{
            .aging-time{
                background: #F56C6C;
            }
        }
    }
    .progress-item + .progress-item:before{
        font-family: 'element-icons';
        content: '\E6EA';
        transform: rotate(180deg);
        font-size: 24px;
        position: absolute;
        margin-left: -119px;
        margin-top: 27px;
        color: #999;
    }
}
</style>