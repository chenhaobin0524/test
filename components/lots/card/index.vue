<template>
    <div class="card-chenjk">
        <div class="card-title">{{ title }}</div>
        <div class="card-progress">
            <div class="card-progress-item">
                <el-progress type="dashboard" :stroke-width="4" :color="leftColor" :percentage="leftPercentage" :width='progressWidth'></el-progress>
                <div class="card-progress-item-desc">{{ leftProgressDesc }}</div>
                <div class="card-progress-satellite-information">
                    {{ leftSatelliteInformation }}
                    <span class="card-progress-satellite-information-num">{{ leftSatelliteInformationNum }}</span>
                </div>
            </div>
            <div class="card-progress-item">
                <el-progress type="dashboard" :stroke-width="4" :color="rightColor" :percentage="rightPercentage" :width='progressWidth'></el-progress>
                <div class="card-progress-item-desc">{{ rightProgressDesc }}</div>
                <div class="card-progress-satellite-information">
                    {{ rightSatelliteInformation }}
                    <span class="card-progress-satellite-information-num">{{ rightSatelliteInformationNum }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        leftColor: {
            type: [ String, Function, Array ]
        },
        rightColor: {
            type: [ String, Function, Array ]
        },
        progressWidth: {
            type: Number,
            default: 120
        },
        leftPercentage: {
            type: Number,
            default: 0
        },
        rightPercentage: {
            type: Number,
            default: 0
        },
        title: {
            type: String,
            default: ''
        },
        leftProgressDesc: {
            type: String,
            default: ''
        },
        rightProgressDesc: {
            type: String,
            default: ''
        },
        leftSatelliteInformation: {
            type: String,
            default: ''
        },
        rightSatelliteInformation: {
            type: String,
            default: ''
        },
        leftSatelliteInformationNum: {
            type: Number
        },
        rightSatelliteInformationNum: {
            type: Number
        }
    }
};
</script>

<style lang="less">
.card-chenjk {
    background-color: #fff;
    min-height: 200px;

    .el-progress__text {
        font-size: 22px !important;
    }
    .card-title {
        font-size: 14px;
        font-weight: 700;
        padding: 20px;
        color: #5a5959;
    }
    .card-progress {
        display: flex;
        justify-content: space-around;
        padding: 0 8%;
    }
    .card-progress-item {
        text-align: center;
        position: relative;
    }
    .card-progress-item-desc {
        position: absolute;
        bottom: 25%;
        width: 100%;
        font-size: 12px;
        color: #888C8C;
    }
    .card-progress-satellite-information {
        font-size: 14px;
        margin-top: -10px;
        padding: 10px 0;
    }
    .card-progress-satellite-information-num {
        font-weight: 700;
        font-size: 16px;
    }
    .card-progress-item:last-child {
        .card-progress-satellite-information-num {
            color: #f30;
        }
    }
}
</style>