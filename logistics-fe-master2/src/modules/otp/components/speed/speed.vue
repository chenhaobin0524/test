<template>
    <div class="departure">
        <div class="departureHead displayFlex">
            <div class="departureHead-left displayFlex flexDirection">
                <div class="departureHead-stop">{{process.title}}</div>
                <div class="departureHead-start">
                    <div class="orders">{{process.speedName}}</div>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="process.orderNo"
                        placement="bottom-start"
                    >
                        <span class="numbers">{{process.orderNo}}</span>
                    </el-tooltip>
                    <span v-if="process.image" class="speedIcon" :style="'background-image:url('+process.image+')'"></span>
                </div>
            </div>
            <div class="speedContet">
                <div
                    class="departureHead-right displayFlex justifyContent"
                    v-for="(item, index) in items"
                    :key="index"
                    v-show="hide"
                    :style="index===items.length-1?'width:'+(100/(items.length*2-1))+'%':'width:'+(200/(items.length*2-1))+'%'"
                >
                    <div class="circular flex1" :style="index===items.length-1?'100%':'50%'">
                        <div class="circular-img">
                            <div
                                class="circular-left textAlign"
                                :style="'background-image:url('+(item.id==='1'?item.images.active:item.images.notActive)+')'"
                            ></div>
                            <div class="circular-right">
                                <div class="astern">{{item.carName.trim ? item.carName : item.carName[item.id]}}</div>
                                <div class="carTimes">{{item.carTimes}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="point" style="width:50%">
                        <span class="arrow"
                              :class="items[index]&&items[index].id === '1'? 'arrow' : 'arrowColor'"
                        ></span>
                        <span class="bigPoint"
                              :class="items[index]&&items[index].id === '1'? 'bigPoint' : 'bigPointColor'"
                        ></span>
                        <span
                             class="arrow"
                             :class="items[index+1]&&items[index+1].id === '1'? 'arrow' : 'arrowColor'"
                        ></span>
                        <i
                            class="el-icon-arrow-right rotate"
                            :class="items[index+1]&&items[index+1].id === '1'? 'rotate' : 'rotate1'"
                        ></i>
                        <span class="showTip">{{item.processType}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            items: [],
            visible: false,
            title: '操作日志',
            tableData: [
                {
                    mold: '订单操作',
                    date: '2016-05-02 18:18:18',
                    name: '新建订单',
                    address: '李娟'
                },
                {
                    mold: '订单操作',
                    date: '2016-05-04 18:18:18',
                    name: '新建订单',
                    address: '李娟'
                },
                {
                    mold: '订单操作',
                    date: '2016-05-01 18:18:18',
                    name: '新建订单',
                    address: '李娟'
                },
                {
                    mold: '订单操作',
                    date: '2016-05-03 18:18:18',
                    name: '新建订单',
                    address: '李娟'
                }
            ],
            tabItems: [
                {
                    prop: 'mold',
                    label: '操作类型',
                    type: 'normal'
                },
                {
                    prop: 'name',
                    label: '操作内容',
                    type: 'normal'
                },
                {
                    prop: 'address',
                    label: '创建人',
                    type: 'normal'
                },
                {
                    prop: 'date',
                    label: '创建时间',
                    type: 'normal'
                }
            ]
        };
    },
    props: {
        process: {
            type: Object
        },
        hide: {
            type: Boolean,
            default: true
        }
    },
    mounted() {
        this.renderD();
    },
    methods: {
        renderD() {
            const dataItems = this.process.step;
            this.items = dataItems.map((item, index) => {
                switch (Number(item.id)) {
                case 1:
                    item.act = {
                        green: true
                    };
                    break;
                case 2:
                    item.act = {
                        blue: true
                    };
                    break;
                default:
                    item.act = {
                        gray: true
                    };
                    break;
                }
                return item;
            });
        }
    },
    watch: {
        process() {
            this.renderD();
        }
    }
};
</script>

<style lang="less">
.green {
    background: #5eb400;
}
.gray {
    background: #999;
}
.blue {
    background: blue;
}
.departure {
    .displayFlex {
        display: flex;
    }
    .justifyContent {
        justify-content: center;
        align-items: center;
    }

    .flexDirection {
        flex-direction: column;
    }

    .textAlign {
        text-align: center;
    }
    .speedIcon {
        display: inline-block;
        width: 14px;
        height: 14px;
        margin-left: 16px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
    }
    font-size: 14px;
    background: #fff;
    border-radius: 4px;
    .departureHead {
        align-items: stretch;
        margin-bottom: 10px;
        .justifyContent {
            display: flex;
            justify-content: center;
        }
        .speedContet {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
        .departureHead-left {
            width: 250px;
            border-right: 1px solid #d6d6d6;
            margin: 0 12px 0 12px;
            .departureHead-start {
                width: 200px;
                .orders {
                    margin-bottom: 5px;
                    text-align: center;
                    color: #999;
                }
                .numbers {
                    display: block;
                    color: #333;
                    width: 200px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    text-align: center;
                }
            }
            .departureHead-stop {
                height: 36px;
                line-height: 36px;
                font-size: 16px;
                text-align: center;
                margin: 8px 0 0 0;
                color: #00bcbf;
            }
        }
        .departureHead-right {
            .circular-img {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin: 0;
            }
            .point {
                margin: auto;
                text-align: center;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                .arrow {
                    width: 25px;
                    border: 1px dashed #00bcbf;
                    display: inline-block;
                    margin-bottom: 8px;
                }
                .arrowColor {
                    border: 1px dashed #999;
                }
                .bigPoint{
                    display: inline-block;
                    background: #00bcbf;
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    margin-left: 3px;
                    margin-right: 5px;
                    position: relative;
                    top: -3px;
                }
                .bigPointColor{
                    background: #999;
                    opacity: 0.5;
                }
                .rotate {
                    color: #00bcbf;
                    font-size: 18px;
                    position: relative;
                    left: -3px;
                    top: -4px;

                }
                .rotate1 {
                    opacity: 0.5;
                    color: #999;
                    font-size: 18px;
                }
                .showTip{
                    position: absolute;
                    left: 50%;
                    top: -20px;
                    transform: translate(-60%);
                    text-align: center;
                    width: 50%;
                    font-size: 12px;
                }
            }
            &:last-child .point {
                display: none;
            }
            .circular {
                .circular-left {
                    margin: 5px auto;
                    width: 36px;
                    height: 36px;
                    line-height: 36px;
                    background-position: center;
                    background-size: contain;
                    background-repeat: no-repeat;
                    display: flex;
                }
                .colorBlue {
                    opacity: 0.5;
                }
                .colorGray {
                    opacity: 0.5;
                }
                .circular-right {
                    margin: 0 8px 0 16px;
                    .astern {
                        margin-bottom: 4px;
                        text-align: center;
                    }
                    .carTimes {
                        color: #999;
                        text-align: center;
                        height: 16px;
                    }
                }
            }
        }

        .circularLeft {
            margin-left: 28px;
        }
        .arrowColor {
            opacity: 0.5;
            color: #999;
        }

        .journal {
            cursor: pointer;
            color: #00bcbf;
            width: 140px;
            border-left: 1px solid #d6d6d6;
            .journal-i {
                font-size: 16px;
                margin: 18px 0;
            }
        }
    }
}
</style>