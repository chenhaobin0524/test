<template>
    <div class="storage-area-monitoring">
        <div class="menu">
            <div class="menu_desc">
              <span>备</span>
              <span>货</span>
              <span>区</span>
              <span>作</span>
              <span>业</span>
              <span>情</span>
              <span>况</span>
            </div>
            <img src="../warehouseNetwork/images/menu.png" width="100%" height="100%">
        </div>
        <div class="container">
            <div class="container_nav">
                <span class="container_nav_storage active current">一号库</span>
                <span class="container_nav_storage">二号库</span>
                <span class="container_nav_storage">三号库</span>
                <span class="container_nav_storage">四号库</span>
                ST总量<div class="container_nav_st-total-num">{{ totalST }}</div>
                <div class="container_nav_date">
                    <span class="container_nav_date_prev">&lt;</span>{{ date }}<span class="container_nav_date_next">&gt;</span>
                    <span class="font-size-sub" @click='fontSubClick'>A-</span>
                    <el-slider
                        @input='sliderInput'
                        v-model="sliderValue"
                        :show-tooltip='false'
                        :step="5">
                    </el-slider>
                    <span class="font-size-add" @click='fontAddClick'>A+</span>
                </div>
            </div>
            <div class="container_split"></div>
            <div class="container_content">
                <!-- <div class="container_content_title">
                    <div class="st">ST</div>
                    <div class="appointment">
                        <div>
                            <p>今</p>
                            <p>日</p>
                            <p>预</p>
                            <p>约</p>
                        </div>
                    </div>
                </div> -->
                <div class="container_content_detail">
                    <ul class="content">
                        <li class="content_item" v-for='(item, index) in dataList' :key='index'>
                            <div class="content_item_title" :class='{ disabled: item.locStatus === 0 }'>
                                {{ item.locCode }}
                            </div>
                            <div class="content_item_detail">
                                <div class='content_item_detail_box'>
                                    <div v-for='(item, index) in item.timeData' :key='index'>
                                        <div style="padding: 0 5px;">
                                            <div class="content_item_detail_box_car-no">{{ item.vehicleNo }}</div>
                                            <div class="content_item_detail_box_time">{{ item.startTime | dateFormat }}-{{ item.finishTime | dateFormat }}</div>
                                        </div>
                                        <div class="content_item_detail_box_split"></div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li v-if='dataList.length === 0' class="content_no-data">
                            <div class="content_no-data_title"></div>
                            <div class="content_no-data_detail">{{ nodata }}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/modules/big-data/api/storageAreaMonitoring.js';
import moment from 'moment';
export default {
    data() {
        return {
            secondDayRefresh: 0,
            totalST: 0,
            resetScroll: () => {},
            html: {},
            htmlFontSize: 0,
            sliderValue: 50,
            detailBoxArr: [],
            scrollStartDelayArr: [], // 自动滚动初始化延时
            autoScrollDelayArr: [], // 自动滚动延时
            nodata: '',
            timingGet: false, // 用于判断是否启用loading动画
            date: '',
            timingGetData: 0, // 定时获取数据
            cancelRequest: () => {},
            tableLoading: {}, // loading 动画
            params: {
                zoneCode: '01', // 车库号
                startTime: ''
            },
            currentIndex: 1, // 当前光标
            dataList: [],
            isLoading: false
        };
    },
    filters: {
        dateFormat(date) {
            if (date !== undefined && date !== '') {
                return moment(date).format('HH:mm');
            } else {
                return '';
            }
        }
    },
    methods: {
        fontSubClick() {
            this.fontSubClick();
        },
        fontAddClick() {
            this.fontAddClick();
        },
        sliderInput(val) {
            const rate = 0.45 + (val / 100);
            this.html.style.fontSize = this.htmlFontSize * rate + 'px';
            localStorage.setItem('storage-area-monitoring-slider-values', val);
            this.resetScroll();
        },
        // 清除自动滚动
        clearScroll() {
            this.detailBoxArr.forEach(item => {
                item.style.top = 'auto';
            });
            this.scrollStartDelayArr.forEach(item => clearTimeout(item)); // 清除自动滚动初始延时
            this.autoScrollDelayArr.forEach(item => clearTimeout(item)); // 清除自动滚动延时
            this.scrollStartDelayArr = [];
            this.autoScrollDelayArr = [];
        },
        loading(status = true) {
            if (status) {
                if (this.isLoading) return false;
                this.isLoading = true;
                this.tableLoading = this.$loading({
                    target: '.container_content_detail > .content',
                    background: 'rgba(36, 60, 112, 1)'
                });
            } else {
                this.tableLoading.close();
                this.isLoading = false;
            }
        },
        // 初始化按键监听
        initKeyListener() {
            const storageEleArr = [
                ...document.querySelectorAll('.container_nav_storage'),
                document.querySelector('.container_nav .container_nav_date_prev'),
                document.querySelector('.container_nav .container_nav_date_next')
            ];
            // const keyup = () => {
            //     storageEleArr.forEach(item => item.classList.remove('current'));
            //     storageEleArr[this.currentIndex - 1].classList.add('current');
            // };
            const click = () => {
                if ([1, 2, 3, 4].includes(this.currentIndex)) {
                    storageEleArr.forEach(item => item.classList.remove('active'));
                    storageEleArr[this.currentIndex - 1].classList.add('active');
                    this.params.zoneCode = '0' + (this.currentIndex);
                    localStorage.setItem('storage-area-monitoring-current-index', this.currentIndex);
                    this.timingGet = false;
                    this.getDataList();
                } else {
                    if (this.date === '') return false;

                    let currentDate = moment(this.date).valueOf();

                    if (this.currentIndex === 5) { // 前一天
                        currentDate -= 86400000;
                    } else if (this.currentIndex === 6) { // 后一天
                        currentDate += 86400000;
                    }
                    this.date = moment(currentDate).format('YYYY-MM-DD');
                    this.params.startTime = this.date + ' 00:00:00';
                    this.timingGet = false;
                    this.getDataList();
                }
            };
            this.fontAddClick = () => {
                const current = this.sliderValue + 5;
                this.sliderValue = current > 100 ? 100 : current;
                this.$nextTick(() => {
                    this.resetScroll();
                });
            };
            this.fontSubClick = () => {
                const current = this.sliderValue - 5;
                this.sliderValue = current < 0 ? 0 : current;
                this.$nextTick(() => {
                    this.resetScroll();
                });
            };
            // this.keyup = event => {
            //     if (event.keyCode === 37) { // 左键
            //         if (this.currentIndex === 1) {
            //             return false;
            //         }
            //         this.currentIndex -= 1;
            //         keyup();
            //     } else if (event.keyCode === 39) { // 右键
            //         if (this.currentIndex === 6) {
            //             return false;
            //         }
            //         this.currentIndex += 1;
            //         keyup();
            //     } else if (event.keyCode === 38) { // 上键
            //         this.fontAddClick();
            //     } else if (event.keyCode === 40) { // 下键
            //         this.fontSubClick();
            //     } else if (event.keyCode === 13) { // 回车
            //         click();
            //     }
            // };
            this.click = event => {
                storageEleArr.find((item, index) => {
                    if (item === event.target) {
                        this.currentIndex = index + 1;
                        // keyup();
                        click();
                        return true;
                    }
                });
            };
            // document.addEventListener('keyup', this.keyup);
            const navBox = document.querySelector('.storage-area-monitoring .container_nav');
            navBox.addEventListener('click', this.click);
        },
        // 自动滚动动画
        autoScroll(dom, step = -1) { // step 每次移动的间距 px
            dom.style.top = '10px'; // 定为10px，防止数据贴边不美观
            const getTop = () => parseFloat(dom.style.top);

            const changeTop = () => {
                const diffHeight = -dom.diffHeight;
                let target = getTop() + step;
                if (target < diffHeight) target = diffHeight;
                if (target > 10) target = 10;
                dom.style.top = target + 'px';

                let delay = 27;
                if (getTop() === 10 || getTop() === diffHeight) {
                    step = -step;
                    delay = 3000;
                }
                this.autoScrollDelayArr.push(setTimeout(() => {
                    changeTop();
                }, delay));
            };
            this.scrollStartDelayArr.push(setTimeout(() => {
                changeTop();
            }, 4000));
        },
        getDataList() {
            clearTimeout(this.timingGetData); // 清除上一次定时获取数据
            this.cancelRequest(); // 取消还未响应的异步请求
            if (!this.timingGet) {
                this.loading();
                this.dataList = [];
                this.nodata = '';
            }
            const resDispose = () => {
                this.timingGetData = setTimeout(() => {
                    this.timingGet = true;
                    this.getDataList();
                }, 60000);
                this.loading(false);
                this.nodata = this.dataList.length === 0 ? '暂无数据' : '';
            };
            api.parkLoc(this.params, (c) => { this.cancelRequest = c; }).then(res => {
                if (res) {
                    if (this.date === '') {
                        this.date = moment(res.timestamp).format('YYYY-MM-DD');
                        this.params.startTime = moment(res.timestamp, 'YYYY-MM-DD').format('YYYY-MM-DD HH:mm:ss');
                        // 保存服务端时间，过了24点自动更新时间
                        const serveDate = moment(res.timestamp).valueOf();
                        const serveTime = (serveDate + 28800000) % 86400000;
                        this.secondDayRefresh = setTimeout(() => {
                            this.date = '';
                            this.params.startTime = moment(serveDate + 86400000).format('YYYY-MM-DD') + ' 00:00:00';
                            this.timingGet = false;
                            this.getDataList();
                        }, 86400000 - serveTime);
                    }
                    this.dataList = res.data;
                    this.totalST = res.data.length;
                    while (this.dataList.length < 12) {
                        this.dataList.push({
                            timeData: []
                        });
                    }
                    this.resetScroll = () => {
                        this.clearScroll(); // 清除自动滚动
                        this.detailBoxArr = [...document.querySelectorAll('.storage-area-monitoring .content_item_detail_box')];
                        const contentHeight = document.querySelector('.storage-area-monitoring .content_item_detail').scrollHeight;
                        this.detailBoxArr.forEach(item => {
                            // 判断加20，上下各10, 防止数据贴边
                            if (item.scrollHeight + 20 > contentHeight) {
                                item.diffHeight = item.scrollHeight + 10 - contentHeight; // 增加10px 防止数据贴边不美观
                                this.autoScroll(item);
                            }
                        });
                    };
                    this.$nextTick(() => {
                        this.resetScroll();
                    });
                }
                resDispose();
            }).catch((e) => {
                if (e.constructor.name === 'Cancel') return false;
                resDispose();
            });
        }
    },
    mounted() {
        this.html = document.getElementsByTagName('html')[0];
        this.htmlFontSize = parseFloat(this.html.style.fontSize);
        const localVal = localStorage.getItem('storage-area-monitoring-slider-values');
        if (localVal) {
            this.sliderValue = parseInt(localVal);
        }
        const currentIndex = localStorage.getItem('storage-area-monitoring-current-index');
        if (currentIndex) {
            const storageArr = [...document.querySelectorAll('.container_nav_storage')];
            storageArr.forEach(item => item.classList.remove('active'));
            storageArr[currentIndex - 1].classList.add('active');
            this.params.zoneCode = '0' + currentIndex;
        }
        this.getDataList();
        // 初始化按键监听
        this.initKeyListener();
    },
    beforeRouteEnter(to, from, next) {
        document.body.style['min-width'] = 'auto';
        next();
    },
    beforeRouteLeave(to, from, next) {
        document.body.style['min-width'] = '1500px'; // 恢复其他页面所适配的默认值
        // document.removeEventListener('keyup', this.keyup);
        const navBox = document.querySelector('.storage-area-monitoring .container_nav');
        navBox.removeEventListener('click', this.click);
        clearTimeout(this.timingGetData); // 清除上一次定时获取数据
        clearTimeout(this.secondDayRefresh); // 清除自动获取第二天数据
        this.cancelRequest(); // 取消还未响应的异步请求
        this.clearScroll(); // 清除自动滚动
        next();
    }
};
</script>

<style lang="less">
@import url('./style.less');
</style>
