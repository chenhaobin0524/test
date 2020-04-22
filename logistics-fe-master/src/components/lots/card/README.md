<card
    title="卡片左上角标题"
    leftPercentage="左进度圈进度"
    rightPercentage="右进度圈进度"
    leftColor="左进度圈颜色"
    rightColor="右进度圈颜色"
    leftProgressDesc="左进度圈缺口处文字描述"
    rightProgressDesc="右进度圈缺口处文字描述"
    leftSatelliteInformation="左进度圈下方附属描述信息"
    rightSatelliteInformation="右进度圈下方附属描述信息"
    leftSatelliteInformationNum="左进度圈下方附属描述信息对应的数值"
    rightSatelliteInformationNum="右进度圈下方附属描述信息对应的数值"
    >
</card>
// 示例页面： 供应商平台 -> 订单管理 -> 订单看板
组件内部:
props: {
    leftColor: { // el-progress 组件的 color
        type: [ String, Function, Array ]
    },
    rightColor: {
        type: [ String, Function, Array ]
    },
    progressWidth: { // el-progress 组件的 width
        type: Number,
        default: 120
    },
    leftPercentage: { // el-progress 组件的 percentage
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