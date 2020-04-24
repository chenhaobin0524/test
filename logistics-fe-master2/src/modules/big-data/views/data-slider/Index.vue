<template>
    <div class="data-slider">
        <div style="width:100%;margin:10px auto;height:100%">
            <!-- Using the slider component -->
            <slider ref="slider" :options="options" @slide='slide' @tap='onTap' @init='onInit' style="position:relative;">
                <!-- slideritem wrapped package with the components you need -->
                <slideritem v-for="(item,index) in sliderList" :key="index" :style="item.style">
                    <div class="real-content" :class="item.library === '001'? 'real-content-library':''">
                        <div class="real-box" :class="item.crenel.length < 4 && item.st.length < 10 ? 'real-box-3':''">
                          <div>
                            <div class="real-box-title">
                                <div>
                                    {{index+1 === 5?1:index+1}}号库
                                    <img src="../../images/arrow.png" class="arrow-png">
                                </div>
                            </div>
                            <div class="box-content" ref="listSlider">
                                <div class="crenel" v-for="(list,key) in item.crenel" :key="key"
                                    :class="item.crenel.length < 4 ? 'crenel-num3':''">
                                    <div class="crenelate" :class="[list.queueType === '卸车'  ? 'unload':'time-out',list.vehicleNo ? '': 'unused']">
                                        <div class="crenelate-content" :class="list.queueType ==='卸车' ? 'crenelate-content-unload':''">
                                            <div class="crenelate-box">
                                                <div class="crenelate-num">
                                                    <div>垛口 {{list.crenelName}}</div>
                                                    <div v-if="list.crenelStatus === '作业中' && list.StopTime * 1 >= 5 && list.StopTime * 1 < 10 && list.queueType === '装车' && list.vehicle === '当前车牌'"
                                                        class="crenelate-status crenelate-time-5" >
                                                        提货超时5H
                                                    </div>
                                                    <div v-if="list.crenelStatus === '作业中' && list.StopTime * 1 >= 10 && list.queueType === '装车' && list.vehicle === '当前车牌'"
                                                        class="crenelate-status crenelate-time-10">
                                                        提货超时10H
                                                    </div>
                                                    <div v-if="list.crenelStatus === '作业中' && list.StopTime * 1 < 5 && list.queueType === '装车' && list.vehicle === '当前车牌'"
                                                         class="crenelate-status crenelate-time-unload">
                                                        提货
                                                    </div>
                                                    <div v-if="list.crenelStatus === '作业中' && list.queueType === '卸车'&& list.vehicleNo"
                                                        class="crenelate-status crenelate-time-unload">
                                                        卸货
                                                    </div>
                                                    <div v-if="list.crenelStatus === '作业中' && !list.vehicleNo"
                                                         class="crenelate-status crenelate-time-unused">
                                                        作业中
                                                    </div>
                                                    <div v-if="list.crenelStatus === '空闲'"
                                                        class="crenelate-status crenelate-time-unused">
                                                        空闲
                                                    </div>
                                                    <div v-if="list.crenelStatus === '停用'"
                                                         class="crenelate-status crenelate-time-unused">
                                                        停用
                                                    </div>
                                                </div>
                                                <div class="supplier">
                                                    <div class="supplier-news">
                                                        <div class="plate-num" v-if="list.vehicleNo">{{list.vehicleNo}}</div>
                                                        <div class="plate-num plate-no-num" v-if="list.vehicle === '无车辆作业' || !list.vehicle || list.vehicle === '下一车牌'">无车辆作业</div>
                                                        <div class="supplier-name" v-if="list.vehicleNo" :title="list.queueType ==='卸车' ? list.sendSite : list.customerSite">
                                                            {{list.queueType ==='卸车' ? list.sendSite : list.customerSite}}
                                                        </div>
                                                        <div class="supplier-name plate-no-num" v-if="!list.vehicleNo">—— —— ——</div>
                                                    </div>
                                                    <div class="supllier-progress"
                                                    :class="[item.crenel.length < 4 && item.st.length>9 ?'supllier-progress-9':'']">
                                                        <data-progress :rate= "list.stock"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="crenel-news">
                                            <div class="news-name" v-if="list.nextCart_bookTime" :class="item.crenel.length < 4 && item.st.length>9 ?'news-name-1':''">
                                                车辆等待:
                                            </div>
                                            <div class="news-name" v-if="!list.nextCart_bookTime">
                                                无车辆等待：
                                            </div>
                                            <div class="news-content" :class="item.crenel.length < 4 && item.st.length>9 ?'news-content-1':''">
                                                <advertisement :content="list.nextCart_bookTime"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="crenelate-data">
                                <echarts-bar v-for="(val, eindex) in item.st"
                                             :key="eindex"
                                             :st-news="val.rateNum|| 0"
                                             :locCode="val.locCode"
                                             :color="eindex % 2 === 0 ? stColor2 : stColor1" />
                                <!--<echarts-bar v-for="(val, eindex) in item.st"-->
                                             <!--:key="eindex"-->
                                             <!--:st-news="val.rateNum|| 0"-->
                                             <!--:locCode="val.locCode"-->
                                             <!--:color="val.queueType === '备货' ? stColor1 : val.queueType === '卸货' ? stColor2 : stColor3"/>-->
                            </div>
<!--                            <div class="efficiency-news">-->
<!--                                    <div class="crenelate-efficiency"  v-for="(num, nindex) in item.rate" :key="nindex" :class="item.rate.length < 4 ? 'crenelate-efficiency-num3':''">-->
<!--                                        <div class="efficiency-box">-->
<!--                                            <div class="efficiency-title">-->
<!--                                                24H完成率-->
<!--                                            </div>-->
<!--                                            <div class="efficiency-data"-->
<!--                                                :class="[num.rateNum === 0 ? 'efficiency-data-0':'',-->
<!--                                                item.crenel.length < 4 && item.st.length>9? 'efficiency-data-80': '',-->
<!--                                                item.crenel.length < 4 && item.st.length<10? 'efficiency-data-74': '']">-->
<!--                                                <el-progress :percentage="num.rateNum" :stroke-width="13" :show-text="num.rateNum === 0?false : true"></el-progress>-->
<!--                                            </div>-->
<!--                                        </div>-->
<!--                                    </div>-->
<!--                                </div>-->
                            </div>
                        </div>
                    </div>
                </slideritem>
                <div slot="loading">loading...</div>
            </slider>
          </div>

    </div>
</template>

<script>
import { slider, slideritem } from 'vue-concise-slider';
import dataProgress from '../../components/data-progress/Index.vue';
import echartsBar from '../../components/echarts-bar/Index.vue';
import advertisement from '../../components/data-advertisement/Index.vue';
import { getCrenelNew, getStock, getStOccupancy, getCrenelRate, getStNews, getCrenelStatus } from '../../api/index';
import { setTimeout } from 'timers';
export default {
    mounted() {
        this.getStConten();
    },
    data() {
        return {
            slideNum: 12,
            slideIndex: 0,
            stColor3: '#1D4797',
            stColor2: '#249FAE',
            stColor1: '#0654DF',
            sliderList: [], // 数据数组
            allStList: [], // 获取所有库，垛口名
            crenelStatus: [], // 所有垛口状态
            options: {
                currentPage: 0, // 当前页
                preventRebound: true, // 阻止回弹
                timingFunction: 'ease', // 滑动方式
                // thresholdDistance: 500, //滑动判定距离
                // thresholdTime: 3000, //滑动判定时间
                autoplay: 30000, // 自动滚动[ms]
                loop: true // 循环滚动
            }
        };
    },
    components: {
        slider,
        slideritem,
        dataProgress,
        echartsBar,
        advertisement
    },
    methods: {
        // 轮播时触发
        slide (data) {
            this.slideIndex = data.currentPage;
            if (data.currentPage === 4) {
                this.$refs.slider.$emit('slideNext');
            }
            this.$emit('onEmitIndex', this.slideIndex);
        },
        // 点击轮播图触发
        onTap (data) {
        },
        // 轮播图初始化
        onInit (data) {
        },
        // 开启定时轮播,设置轮播时长
        startLoop() {
            this.$refs.slider.$emit('autoplayStart', 30000);
        },
        // 暂停轮播
        stopLoop() {
            this.$refs.slider.$emit('autoplayStop');
        },
        // 将不同库的数组按照库编号分类，并将每个库的数据按照垛口编号分类，最后组合成sliderList
        async getStConten() {
            await getStNews().then(res => {
                if (res.code === '0' && res.data) {
                    const data = res.data;
                    this.allStList = res.data;
                    let arry = [];
                    data.forEach(item => {
                        arry.push(item.zoneCode);
                    });
                    arry = [...new Set(arry)];
                    arry = arry.sort((a, b) => {
                        return a * 1 - b * 1;
                    });
                    for (let i = 0; i < arry.length; i++) {
                        const obj = {
                            library: arry[i],
                            crenel: [], // 垛口数组
                            st: [], // ST区数组
                            rate: [], // 完成率数组
                            style: {
                                'width': '77%'
                            }
                        };
                        this.sliderList.push(obj);
                    }
                    for (let j = 0; j < this.sliderList.length; j++) {
                        const list = [];
                        data.forEach(item => {
                            if (item.zoneCode === this.sliderList[j].library) {
                                list.push(item);
                            }
                        });
                    }
                    const allCrenList = [];
                    let creneNum = []; // 获取所有垛口名
                    const stList = []; // 获取所有ST
                    this.allStList.forEach(item => {
                        creneNum.push(item.crenelName);
                        const stObj = {
                            'crenelCode': item.crenelCode,
                            'crenelName': item.crenelName,
                            'locCode': item.locCode,
                            'rateNum': 0,
                            'zoneCode': item.zoneCode
                        };
                        stList.push(stObj);
                    });
                    creneNum = [...new Set(creneNum)];
                    creneNum = creneNum.sort((a, b) => {
                        return a * 1 - b * 1;
                    });
                    const rateList = [];
                    creneNum.forEach(item => {
                        const obj = {
                            StopTime: '0',
                            bookingTime: '',
                            carrierCode: '',
                            carrierName: '',
                            crenelCode: '',
                            crenelName: item,
                            customerSite: '',
                            nextCart_bookTime: '',
                            queueType: '',
                            sendSite: '',
                            stock: 0,
                            vehicle: '',
                            vehicleNo: ''
                        };
                        const rateObj = {
                            'crenelName': item,
                            'rateNum': 0
                        };
                        rateList.push(rateObj);
                        allCrenList.push(obj);
                    });
                    for (let k = 0; k < this.sliderList.length; k++) {
                        allCrenList.forEach(item => {
                            if (item.crenelName) {
                                if (item.crenelName[0] === this.sliderList[k]['library'][this.sliderList[k]['library'].length - 1]) {
                                    this.sliderList[k]['crenel'].push(item);
                                }
                            }
                        });

                        rateList.forEach(item => {
                            if (item.crenelName) {
                                if (item.crenelName[0] === this.sliderList[k]['library'][this.sliderList[k]['library'].length - 1]) {
                                    this.sliderList[k]['rate'].push(item);
                                }
                            }
                        });

                        stList.forEach(item => {
                            if (item.zoneCode === this.sliderList[k]['library']) {
                                this.sliderList[k]['st'].push(item);
                            }
                        });
                    }
                    let indexNum;
                    for (let j = 0; j < this.sliderList.length; j++) {
                        if (this.sliderList[j]['crenel'].length < 4 && this.sliderList[j]['st'].length < 10) {
                            indexNum = j;
                        }
                    }
                    if (indexNum !== '') {
                        this.sliderList[indexNum].style['width'] = '60%';
                    }
                    this.getStatus();
                    // 接口重新调用时，轮播组件出现Cannot read property 'offsetLeft' of undefined，并且影响显示
                    // 需要将页面设为第一页
                    // if (this.$refs.slider['data']) {
                    //     this.$refs.slider['data'].currentPage = 0;
                    //     this.slide(this.$refs.slider['data']);
                    // }
                    this.$refs.slider.$emit('slideTo', 0);
                    setTimeout(() => {
                        this.sliderList = [];
                        this.allStList = [];
                        this.getStConten();
                    }, 30 * 60000);
                }
            });
        },
        // 垛口停靠
        async getNews() {
            await getCrenelNew().then(res => {
                const data = res.data || [];
                let crenList = [];
                if (data.length > 0) {
                    data.forEach(item => {
                        crenList.push(item.crenelName);
                    });
                    crenList = [...new Set(crenList)].sort((a, b) => {
                        return a * 1 - b * 1;
                    });
                    for (let i = 0; i < this.sliderList.length; i++) {
                        let arr = [];
                        data.forEach(item => {
                            if (item.crenelName) {
                                if (item.crenelName[0] ===
                                    this.sliderList[i]['library'][this.sliderList[i]['library'].length - 1]) {
                                    arr.push(item);
                                }
                            }
                            arr = [...new Set(arr)];
                        });
                        this.sortCrenel(arr, i);
                    }
                }
                this.getStockNews();
            });
        },
        // 排序   库数组， 库编号 ， sliderList
        sortCrenel(list, index) {
            if (list.length < 1) {
            }
            let arr = [];
            list.forEach(item => {
                arr.push(item.crenelName);
            });
            arr = [...new Set(arr)];
            arr = arr.sort(function(a, b) {
                return a * 1 - b * 1;
            });
            const arrObj = [];
            arr.forEach(item => {
                const crenelArry = [];
                for (let i = 0; i < list.length; i++) {
                    if (item === list[i]['crenelName']) {
                        crenelArry.push(list[i]);
                    }
                }
                arrObj.push(this.objAssign(crenelArry));
            });
            if (arrObj.length > 0) {
                for (let i = 0; i < this.sliderList[index]['crenel'].length; i++) {
                    arrObj.forEach(item => {
                        if (this.sliderList[index]['crenel'][i]['crenelName'] === item['crenelName']) {
                            this.$set(this.sliderList[index]['crenel'], i, item);
                        }
                    });
                }
            }
        },
        // 合并对象
        objAssign(data) {
            const nextNews = [];
            if (data.length < 1) {
                return;
            }
            const arr = []; // 下一车牌
            const arrcle = []; // 当前车牌
            let vehiarr = []; // 结果
            if (data.length > 0) {
                data.forEach(item => {
                    if (item['vehicle'] === '下一车牌') {
                        arr.push(item);
                    } else {
                        arrcle.push(item);
                    }
                });
                for (let i = 0; i < arr.length; i++) {
                    nextNews.push(this.nextBookTime(arr[i]));
                }
                if (arrcle.length > 0) {
                    arrcle[0]['nextCart_bookTime'] = nextNews.join(';');
                    vehiarr = arrcle;
                } else {
                    if (nextNews) {
                        arr[0]['nextCart_bookTime'] = nextNews.join('  ');
                        arr[0]['vehicleNo'] = '';
                        vehiarr = arr;
                    }
                }
            }
            return vehiarr[0];
        },
        // 处理下一辆车的booktime
        nextBookTime(targetDate) {
            if (targetDate) {
                let result;
                if (targetDate['bookingTime']) {
                    result = (new Date(targetDate['bookingTime']).getTime() - new Date().getTime()) / 1000;
                }
                // if (result < 0) return; // 不能大于当前时间
                return `${targetDate['queueType'] === '卸车' ? '卸货' : '提货'}离预约时间剩余${parseInt(result / 60 / 60)}时${parseInt((result / 60) % 60)}分
                ${targetDate['vehicleNo']} ${targetDate['queueType'] === '卸车' ? targetDate['sendSite'] : targetDate['customerSite']}`;
            }
        },
        // 备货进度
        async getStockNews() {
            await getStock().then(res => {
                const data = res.data || [];
                for (let i = 0; i < this.sliderList.length; i++) {
                    const arr = [];
                    data.forEach(item => {
                        if (item.crenelName) {
                            if (item.crenelName[0] ===
                                this.sliderList[i]['library'][this.sliderList[i]['library'].length - 1]) {
                                arr.push(item);
                            }
                        }
                    });
                    this.sortVehicle(arr, this.sliderList[i], i);
                }
                this.getSt();
            });
        },
        // 排序 备货进度
        sortVehicle(list) {
            if (list.length < 1) {
                return;
            }
            const data = list.sort((a, b) => {
                return a.crenelName * 1 - b.crenelName * 1;
            });
            for (const items of this.sliderList) {
                for (const crenels of items['crenel']) {
                    var i = 0;
                    while (i < data.length) {
                        if (crenels['crenelName'] === data[i]['crenelName']) {
                            if (data[i]['qtyRealEa'] === 0 || data[i]['qtyPlanEa'] === 0) {
                                crenels['stock'] = 0;
                            } else {
                                crenels['stock'] = Math.floor((data[i]['qtyRealEa'] / data[i]['qtyPlanEa']) * 100);
                            }
                        }
                        i++;
                    }
                }
            }
        },
        // ST区
        async getSt() {
            await getStOccupancy().then(res => {
                if (res.code === '0' && res.data) {
                    const data = res.data;
                    for (let i = 0; i < this.sliderList.length; i++) {
                        const arr = [];
                        data.forEach(item => {
                            let result = Number(item['qtyRealEa']) / Number(item['maxCount']);
                            if (isNaN(result) || isNaN(item.qtyRealEa) || isNaN(item.maxCount)) {
                                result = 0;
                            }
                            item['rateNum'] = result === 0 ? 0 : result > 1 ? 1 : Number(result.toFixed(2));
                            if (item.crenelName[0] ===
                            this.sliderList[i]['library'][this.sliderList[i]['library'].length - 1]) {
                                arr.push(item);
                            }
                        });
                        this.sortSt(arr, this.sliderList[i], i);
                    }
                    this.getRate();
                }
            });
        },
        // 排序 ST区
        sortSt(list, libraryNum, index) {
            // const data = list.sort(function(a, b) {
            //     return a.locCode.split('ST')[1] * 1 - b.locCode.split('ST')[1] * 1;
            //     // return a.crenelName * 1 - b.crenelName * 1;
            // });
            for (let k = 0; k < this.sliderList[index]['st'].length; k++) {
                list.forEach(item => {
                    const stCode = this.sliderList[index]['st'][k]['locCode'];
                    if (item.locCode === stCode) {
                        item.rateNum = item.rateNum * 1;
                        this.$set(this.sliderList[index]['st'], k, item);
                    }
                });
            }
        },
        // 24小时完成率
        // async
        getRate() {
            // await
            getCrenelRate().then(res => {
                let data;
                if (res.code === '0' && res.data.length > 0 && res.data) {
                    data = res.data;
                    for (let i = 0; i < this.sliderList.length; i++) {
                        const arr = [];
                        data.forEach(item => {
                            if (!item['qtyRealEa'] || !item['qtyPlanEa']) {
                                item['rateNum'] = 0;
                            } else {
                                item['rateNum'] = Number(((item['qtyRealEa'] / item['qtyPlanEa']) * 100).toFixed(0));
                            }
                            if (item['crenelName'][0] === this.sliderList[i]['library'][this.sliderList[i]['library'].length - 1]) {
                                arr.push(item);
                            }
                        });
                        this.sortRate(arr, this.sliderList[i], i);
                    }
                }
                this.sliderList.push(JSON.parse(JSON.stringify(this.sliderList[0])));
                this.sliderList[this.sliderList.length - 2].style['width'] = '71%';
                this.insertCrenelStatus();
            });
        },
        // 排序完成率
        sortRate(list, libraryNum, index) {
            if (list.length < 1) {
                return;
            }
            for (let i = 0; i < this.sliderList[index]['rate'].length; i++) {
                const rateName = this.sliderList[index]['rate'][i]['crenelName'];
                list.forEach(item => {
                    if (item.crenelName === rateName) {
                        this.$set(this.sliderList[index]['rate'], i, item);
                    }
                });
            }
            // if (index === 0) {
            //     this.sliderList[0]['st'] = this.sliderList[0]['st'].sort((a, b) => {
            //         return a.crenelName * 1 - b.crenelName * 1;
            //     });
            // }
        },
        // 插入垛口状态
        insertCrenelStatus() {
            this.sliderList.forEach(item => {
                item.crenel.forEach(e => {
                    this.crenelStatus.forEach(el => {
                        if (el.crenelName === e.crenelName) {
                            e['crenelStatus'] = el.crenelStatus;
                        }
                    });
                });
            });
        },
        // 垛口状态
        async getStatus() {
            await getCrenelStatus().then(res => {
                if (res && +res.code === 0) {
                    this.crenelStatus = res.data;
                    this.getNews();
                    // this.getStockNews();
                    // this.getSt();
                    // this.getRate();
                    // this.insertCrenelStatus();
                }
            });
        }
    }
};
</script>

<style lang="less">
@import "./style/style.less";
</style>
