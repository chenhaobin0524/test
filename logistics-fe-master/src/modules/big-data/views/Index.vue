<template>
  <div class="board-qcj">
    <div class="crenel-ban">
        <div class="crenel-kanban">
            <span>垛</span>
            <span>口</span>
            <span>看</span>
            <span>板</span>
        </div>
        <img src="../images/broadside-left.png" alt="" class="crenel-img">
    </div>
    <div class="content">
      <!-- 垛口实时情况 -->
      <div class="real-time">
          <div class="real-title">
            <div class="title-box">
              <div>
                <img src="../images/cart.png" alt="" class="title-cart">
                <span>垛口实时情况</span>
                <!-- <button @click="stopLoop()">暂停</button> <button @click="startLoop()">开启</button> -->
              </div>
              <!--<div class="title-center">-->
                  <!--<div class="status-unload">-->
                      <!--<div class="unload-color"></div>-->
                      <!--<div class="status-name">备货</div>-->
                  <!--</div>-->
                  <!--<div class="status-stock">-->
                    <!--<div class="stock-color"></div>-->
                    <!--<div class="status-name">卸货</div>-->
                  <!--</div>-->
                  <!--<div class="status-free">-->
                      <!--<div class="free-color"></div>-->
                      <!--<div class="status-name">空闲</div>-->
                  <!--</div>-->
              <!--</div>-->
              <div class="switch-box">
                <el-switch v-model="switchBtn" active-text="手动" inactive-text="自动" @change="switchOff" ref="switch">
                </el-switch>
              </div>
            </div>
          </div>

          <data-slider  @onEmitIndex="onEmitIndex" ref="sliderLoop"/>
      </div>

      <!-- 垛口当天计划 -->
      <div class="plan-box">
        <div class="day-plan">
            <div class="real-title">
                <div class="title-box">
                <div class="title-name">
                    <img src="../images/plan.png" alt="" class="title-plan" >
                    <span>垛口当天计划</span>
                </div>
                <div class="title-center">
                    <div class="status-unload">
                        <div class="unload-color"></div>
                        <div class="status-name">备货任务</div>
                    </div>
                    <div class="status-stock">
                        <div class="stock-color"></div>
                        <div class="status-name">卸货任务</div>
                    </div>
                    <div class="status-stock" style="margin-right: 1rem;">
                        <div class="leisure-color"></div>
                        <div class="status-name">空闲</div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <div class="plan-content" v-if="indexNum == 0">
              <data-plan :library="library001" :crenelNum="crenelNum1" class="content-box"/>
              <data-plan :library="library002" :crenelNum="crenelNum2" class="content-box"/>
          </div>

          <div class="plan-content" v-if="indexNum == 1">
              <data-plan :library="library003" :crenelNum="crenelNum3" class="content-box"/>
              <data-plan :library="library004" :crenelNum="crenelNum4" class="content-box"/>
          </div>

          <div class="plan-content" v-if="indexNum == 2">
              <data-plan :library="library005" :crenelNum="crenelNum5" class="content-box"/>
              <data-plan :library="library006" :crenelNum="crenelNum6" class="content-box"/>
          </div>
          <div class="plan-content" v-if="indexNum == 3">
              <data-plan :library="library007" :crenelNum="crenelNum7" class="content-box"/>
              <data-plan :library="library008" :crenelNum="crenelNum8" class="content-box"/>
          </div>
      </div>
    </div>
  </div>
</template>

<script>

import DataSlider from './data-slider/Index';
import DataPlan from './data-plan/Index';
import { getCrenelPlan } from '../api/index';
import formatTime from '@/utils/common.js';
export default {
    data() {
        return {
            switchBtn: false,
            routerArr: [],
            indexNum: 0,
            startTs: '',
            endTs: '',
            crenelNum1: ['103', '101'],
            crenelNum2: ['104', '102'],
            crenelNum3: ['203', '201'],
            crenelNum4: ['202'],
            crenelNum5: ['303', '301'],
            crenelNum6: ['302'],
            crenelNum7: ['403', '401'],
            crenelNum8: ['404', '402'],
            library001: [], // 1库 1-2垛口
            library002: [], // 3-4垛口

            library003: [], // 2库 1-2垛口
            library004: [], // 3-4垛口

            library005: [], // 3库 1-2垛口
            library006: [], // 3-4垛口

            library007: [], // 5库 1-2垛口
            library008: [] // 3-4垛口
        };
    },
    components: {
        DataSlider,
        DataPlan
    },
    created() {
        this.routerArr = this.$router.options.routes[0].children.filter(item =>
            !!item.fdId
        );
    },
    mounted() {
        this.getDataPlan();
        this.targetHouser(5);
    },
    methods: {
        onEmitIndex(index) {
            this.indexNum = index;
        },
        async getDataPlan() {
            await getCrenelPlan().then(res => {
                const stamp = res.timestamp;
                this.startTs = stamp.split(' ')[0] + ' 07:00';
                this.startTs = this.startTs.replace(/-/g, '/');
                this.endTs = stamp.split(' ')[0] + ' 23:00';
                this.endTs = this.endTs.replace(/-/g, '/');
                const startStamp = new Date(stamp.split(' ')[0] + ' 07:00').getTime();
                const endStamp = new Date(stamp.split(' ')[0] + ' 23:00').getTime();
                this.library001.push(
                    {
                        itemStyle: {
                            normal: {
                                color: '#1D4797'
                            }
                        },
                        name: '无',
                        value: [0, this.startTs, this.endTs, '——', '计划件数: 0', '空闲']
                    },
                    {
                        itemStyle: {
                            normal: {
                                color: '#1D4797'
                            }
                        },
                        name: '无',
                        value: [1, this.startTs, this.endTs, '——', '计划件数: 0', '空闲']
                    }
                );
                this.library002 = [...this.library001];
                this.library003 = [...this.library001];
                this.library004 = [...this.library001];
                this.library005 = [...this.library001];
                this.library006 = [...this.library001];
                this.library007 = [...this.library001];
                this.library008 = [...this.library001];
                if (res.code === '0' && res.data) {
                    const data = res.data;
                    data.forEach(value => {
                        const valStartTime = new Date(value.startTime).getTime();
                        const valEndTime = new Date(value.finishTime).getTime();
                        if (valEndTime <= startStamp || valStartTime >= endStamp) {
                            return;
                        }
                        const date = new Date();
                        if (valStartTime <= startStamp) {
                            value.startTime = formatTime.formatDate(date) + ' 07:00';
                        }

                        if (valEndTime >= endStamp) {
                            value.finishTime = formatTime.formatDate(date) + ' 23:00';
                        }
                        value.startTime = value.startTime.replace(/-/g, '/');
                        value.finishTime = value.finishTime.replace(/-/g, '/');
                        const obj = {
                            itemStyle: {
                                normal: {
                                    color: ''
                                }
                            },
                            name: '',
                            value: []
                        };
                        if (value.queueType === '卸货任务') {
                            obj.itemStyle.normal.color = 'rgba(27, 226, 208, .6)'; // '#2AC9BB';
                            obj.name = value.carrierName;
                            obj.value = [0, value.startTime, value.finishTime, value.vehicleNo,
                                `计划件数:${value.qtyPlanEa}`, value.queueType];
                            switch (value.crenelName) {
                            case null:
                                break;
                            default:
                                if (value.crenelName[0] === '1') {
                                    if (value.crenelName === '101' || value.crenelName === '103') {
                                        if (value.crenelName === '101') {
                                            obj.value[0] = 1;
                                        }
                                        this.library001.push(obj);
                                    } else {
                                        if (value.crenelName === '102') {
                                            obj.value[0] = 1;
                                        }
                                        this.library002.push(obj);
                                    }
                                } else if (value.crenelName[0] === '2') {
                                    if (value.crenelName === '201' || value.crenelName === '203') {
                                        if (value.crenelName === '201') {
                                            obj.value[0] = 1;
                                        }
                                        this.library003.push(obj);
                                    } else {
                                        // if (value.crenelName === '202') {
                                        //     obj.value[0] = 1;
                                        // }
                                        this.library004.push(obj);
                                    }
                                } else if (value.crenelName[0] === '3') {
                                    if (value.crenelName === '301' || value.crenelName === '303') {
                                        if (value.crenelName === '301') {
                                            obj.value[0] = 1;
                                        }
                                        this.library005.push(obj);
                                    } else {
                                        if (value.crenelName === '302') {
                                            obj.value[0] = 1;
                                        }
                                        this.library006.push(obj);
                                    }
                                } else if (value.crenelName[0] === '4') {
                                    if (value.crenelName === '401' || value.crenelName === '403') {
                                        if (value.crenelName === '401') {
                                            obj.value[0] = 1;
                                        }
                                        this.library007.push(obj);
                                    } else {
                                        if (value.crenelName === '402') {
                                            obj.value[0] = 1;
                                        }
                                        this.library008.push(obj);
                                    }
                                }
                            }
                        } else {
                            obj.itemStyle.normal.color = 'rgba(30, 87, 255, .75)'; // '#0058F4';
                            obj.name = value.carrierName;
                            obj.value = [0, value.startTime, value.finishTime, value.vehicleNo,
                                `计划件数:${value.qtyPlanEa}`, value.queueType];
                            switch (value.crenelName) {
                            case null:
                                break;
                            default:
                                if (value.crenelName[0] === '1') {
                                    if (value.crenelName === '101' || value.crenelName === '103') {
                                        if (value.crenelName === '101') {
                                            obj.value[0] = 1;
                                        }
                                        this.library001.push(obj);
                                    } else {
                                        if (value.crenelName === '102') {
                                            obj.value[0] = 1;
                                        }
                                        this.library002.push(obj);
                                    }
                                } else if (value.crenelName[0] === '2') {
                                    if (value.crenelName === '201' || value.crenelName === '203') {
                                        if (value.crenelName === '201') {
                                            obj.value[0] = 1;
                                        }
                                        this.library003.push(obj);
                                    } else {
                                        // if (value.crenelName === '202') {
                                        //     obj.value[0] = 1;
                                        // }
                                        this.library004.push(obj);
                                    }
                                } else if (value.crenelName[0] === '3') {
                                    if (value.crenelName === '301' || value.crenelName === '303') {
                                        if (value.crenelName === '301') {
                                            obj.value[0] = 1;
                                        }
                                        this.library005.push(obj);
                                    } else {
                                        if (value.crenelName === '302') {
                                            obj.value[0] = 1;
                                        }
                                        this.library006.push(obj);
                                    }
                                } else if (value.crenelName[0] === '4') {
                                    if (value.crenelName === '401' || value.crenelName === '403') {
                                        if (value.crenelName === '401') {
                                            obj.value[0] = 1;
                                        }
                                        this.library007.push(obj);
                                    } else {
                                        if (value.crenelName === '402') {
                                            obj.value[0] = 1;
                                        }
                                        this.library008.push(obj);
                                    }
                                }
                            }
                        }
                    });
                }
            })
                .catch(() => {
                    const errorTime = formatTime.formatDate(new Date());
                    this.startTs = errorTime + ' 07:00';
                    this.startTs = this.startTs.replace(/-/g, '/');
                    this.endTs = errorTime + ' 23:00';
                    this.endTs = this.endTs.replace(/-/g, '/');
                    this.library001.push(
                        {
                            itemStyle: {
                                normal: {
                                    color: '#1D4797'
                                }
                            },
                            name: '无',
                            value: [0, this.startTs, this.endTs, '——', '计划件数: 0', '空闲']
                        },
                        {
                            itemStyle: {
                                normal: {
                                    color: '#1D4797'
                                }
                            },
                            name: '无',
                            value: [1, this.startTs, this.endTs, '——', '计划件数: 0', '空闲']
                        }
                    );
                    this.library002 = [...this.library001];
                    this.library003 = [...this.library001];
                    this.library004 = [...this.library001];
                    this.library005 = [...this.library001];
                    this.library006 = [...this.library001];
                    this.library007 = [...this.library001];
                    this.library008 = [...this.library001];
                });
        },
        // 暂停轮播
        stopLoop() {
            this.$refs.sliderLoop.stopLoop();
        },
        // 开启轮播
        startLoop() {
            this.$refs.sliderLoop.startLoop();
        },
        // 定时器--凌晨五点，调用getDataPlan方法接口
        targetHouser(time) {
            const nowTime = new Date();
            const nowSeconds = nowTime.getHours() * 3600 + nowTime.getMinutes() * 60 + nowTime.getSeconds();
            const targetSeconds = time * 3600;
            const targetTime = targetSeconds > nowSeconds ? targetSeconds - nowSeconds : targetSeconds + 24 * 3600 - nowSeconds;
            setTimeout(() => { this.getProductFileList(); }, targetTime * 1000);
        },
        getProductFileList() {
            this.getDataPlan();
        },
        // 自动手动开关轮播
        switchOff() {
            const btn = document.getElementsByClassName('el-switch__core')[0];
            if (this.switchBtn) {
                btn.classList.add('el-switch__core_auto');
                this.stopLoop();
            } else {
                btn.classList.remove('el-switch__core_auto');
                this.startLoop();
            }
        }
    }
};
</script>

<style lang="less">
.board-qcj {
    width: 100%;
    height: 100%;
    background: #284680;
    .crenel-ban {
        position: fixed;
        height: 100%;
        display: flex;
        align-items: center;
        width: 3%;
        z-index: 3;
        left: 0;
        .crenel-kanban {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            color: #fff;
            position:absolute;
            width:100%;
            height:100%;
            font-size: 2rem;
            line-height:3.5rem;
        }
        .crenel-img {
            width: 100%;
            height: 100%;
        }
    }
    .content {
        width: 94%;
        height: 95%;
        margin-left: 4%;
        margin-top: 1.5rem;
        padding-bottom: 0;
    }
    .real-time,
    .plan-box {
        width: 100%;
        background: rgba(35, 57, 107, .75);
        border-radius: 10px;
        min-width: 1162px;
    }
    .plan-box {
        padding-right: 1.5rem;
        margin-top: 1.5rem;
    }
    .real-time {
        padding: 1rem 1.5rem;
        padding-right: 0;
    }
    .day-plan {
        padding: 1rem 1.5rem 0 1.5rem;
        padding-right: 0;
    }
    .real-title,
    .day-plan-title {
        font-family: 'founder-lanting';
        font-size: 1.3rem;
        color: #FFFFFF;
        letter-spacing: 0;
    }
    .title-box {
        display: flex;
        justify-content: space-between;
    }
    .title-name {
        width: 20%;
    }
    .title-cart,
    .title-plan {
        position: relative;
        top: 3px;
        margin-right: 5px;
        width: 2.5rem;
    }
    .title-plan {
        width: 2rem;
    }
    .title-center {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .status-unload,
    .status-stock,
    .status-free{
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-right: 2rem;
    }
    .unload-color,
    .stock-color,
    .free-color,
    .leisure-color {
        width: .9rem;
        height: .9rem;
        margin-right: .5rem;
        background-color: #0058F4;
        border-radius: .2rem;
    }
    .stock-color {
        background-color: #2AC9BB;
    }
    .leisure-color {
        background-color: #1D4797;
    }
    .free-color {
        background-color: #1D4797;
    }
    .status-name {
        font-size: .9rem;
    }
    .real-content {
        margin-top: 2vh;
    }
    .plan-content {
        margin-top: .5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .content-box {
        width: 50%;
        height: 12rem;
    }
    .switch-box {
        margin-right: 2.5rem;
        height: 2rem;
        line-height: 2rem;
    }
    .is-active {
        background-color: transparent !important;
        border-left: 0px solid #236CFF;
    }
    .el-switch__label.is-active {
        color: #fff;
    }
    .el-switch__label {
        color: rgba(255,255,255,.7);
    }
    .el-switch__label > span {
        height: 1.5rem;
        line-height: 1.5rem;
    }
    .el-switch__core {
        width: 3rem!important;
        height: 1.5rem;
        background: #01173F;
        border: 1px solid transparent;
        border-radius: 3rem;
    }
    .el-switch{
        height: 100%;
        line-height: 100%;
        display: flex;
    }
    .el-switch__core:after {
        top: .2rem;
        width: 1rem;
        height: 1rem;
        background-color: #679EFF;
    }
    .el-switch.is-checked .el-switch__core {
        background: #01173F;
        border: 1px solid transparent;
    }
    .el-switch__core_auto:after{
        top: .2rem;
        width: 1rem;
        height: 1rem;
        background-color: #FFF;
    }
    .el-switch__label *{
        font-size: 1rem;
    }
    .el-switch__label--left {
        margin-right: .8rem;
    }
    .el-switch__label--right {
        margin-left: .8rem;
    }
    .el-switch.is-checked .el-switch__core::after {
        margin-left: -1rem;
    }
    .el-switch__label {
        line-height: 1.5rem;
        height: 1.5rem;
    }
}
</style>
