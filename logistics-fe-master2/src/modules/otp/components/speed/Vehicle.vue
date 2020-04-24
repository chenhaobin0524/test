<template>
    <div class="information-wrap">
        <div
            class="information displayFlex w_100 flex_wrap"
            v-for="(list,index) in data"
            :key="index"
            :class="{yin:list.length == 0}"
        >
            <div class="information-content w_33" v-for="(item, index) in list" :key="index" :style="'width:'+list.width">
                <div class="infor-title">{{item.title}} <span v-if="item.event" @click="titleClick(item.event)" v-text="item.subTitle"></span></div>
                <div v-for="(subItem, subIndex) in item.subItems" :key="subIndex">
                    <div class="infor" v-if="!subItem.noShow">
                        <span class="label">{{subItem.label}}</span>：
                        <span class="value" :class="subItem.class" :title="subItem.value">
                            <template>
                                <span v-if="subItem.event" style="color:#00bcbf" @click="handleInfoClick(subItem.label)">{{subItem.label}}</span>
                                <span v-else>{{subItem.value?subItem.value:''}}<br v-if="subItem.detailAddress">
                                <span v-if="subItem.detailAddress" style="padding-left: 65px">{{subItem.detailAddress?subItem.detailAddress:''}}</span>
                               </span>
                            </template>
                            <span
                                class="message"
                                v-for="(item,index) in subItem.message"
                                :key="index"
                            >
                                <span v-if="item.value" class="icon" :style="'background-image:url('+item.icon+')'"></span>
                                {{item.value}}
                            </span>
                            <span class="images" @click='openMapClick' :style="'background-image:url('+subItem.images.url+')'" v-if="subItem.images"></span>
                            <span
                                class="messages"
                                v-for="(item,index) in subItem.messages"
                                :key="index"
                            >
                             {{item.value}}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="signBox pos_a">
            <div class="circular" v-if="showLog" @click="operation">log</div>
            <div class="photos" v-if="showPhotos"><img @click="showAccessory" src="@/assets/photos.png" title="附件查看"></div>
            <el-tooltip class="item" effect="dark" :content="isTip" placement="left" v-if="showTip && isTip">
                <div class="circularOther"><p>{{isTip | newTip}}</p></div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="小件" placement="left" v-if="showSmallPiece">
                <div class="circularOther"><p>小</p></div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="商超" placement="left" v-if="scPosFlag+''==='1'">
                <div class="circularOther" :style="'background:'+color[3]"><p>商</p></div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="紧急程度:紧急" placement="left" v-if="emergenceFlag+''==='1'">
                <div class="circularOther" :style="'background:'+color[0]"><p>急</p></div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="上样" placement="left" v-if="specimenType==='Y'">
                <div class="circularOther" :style="'background:'+color[2]"><p>上</p></div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="撤样" placement="left" v-if="specimenType==='N'">
                <div class="circularOther" :style="'background:'+color[2]"><p>撤</p></div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="上楼" placement="left" v-if="ifUpStairs === '1'">
                <div class="circularOther" :style="'background:'+color[4]"><p>楼</p></div>
            </el-tooltip>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        infoData: {
            type: Array
        },
        scPosFlag: {
            type: [Number, String],
            default: 0
        },
        emergenceFlag: {
            type: [Number, String],
            default: 0
        },
        showPhotos: {
            type: Boolean,
            default: false
        },
        showTip: {
            type: Boolean,
            default: false
        },
        showSmallPiece: {
            type: Boolean,
            default: false
        },
        isTip: {
            type: [String]
        },
        showLog: {
            type: Boolean,
            default: true
        },
        specimenType: {
            type: [String, Number]
        },
        ifUpStairs: {
            type: [Number, String],
            default: 0
        }
    },
    data() {
        return {
            data: [],
            color: ['#F56C6C', '#00bcbf', '#409EFF', '#E6A23C', '#67C23A']
        };
    },
    watch: {
        infoData() {
            this.showList();
        }
    },
    methods: {
        operation() {
            this.$emit('operation', '');
        },
        showAccessory() {
            this.$emit('showAccessory', '');
        },
        openMapClick() {
            this.$emit('openMapClick', '');
        },
        showList() {
            let arr = [];
            const data = [];
            this.infoData.map((item, index) => {
                if (!item.showItem) {
                    arr.push(item);
                }
                if ((arr.length) % 3 === 0 || index === this.infoData.length - 1) {
                    data.push(arr);
                    if (index === this.infoData.length - 1) {
                        if (arr.length % 3 === 0) {
                            return;
                        } else {
                            arr.width = '48%';
                        }
                    }
                    arr = [];
                }
            });
            this.data = data;
        },
        handleInfoClick(label) {
            this.$emit('handleInfoClick', label);
        },
        titleClick(event) {
            this.$emit(event);
        }
    },
    mounted() {
        this.showList();
    },
    filters: {
        newTip(value) {
            if (!value) return '';
            return value.charAt(0);
        }
    }
};
</script>

<style lang="less" >
.information-wrap {
    position: relative;
    .displayFlex {
        display: flex;
    }
    .w_100 {
        width: 100%;
        border-top: 1px solid #ccc;
    }
    .w_33 {
        width: 32%;
    }
    .w_100 .w_33:not(:first-child) {
        border-left: 1px solid #ccc;
    }
    .pos_a {
        position: absolute;
    }
    .flex_wrap {
        flex-wrap: wrap;
    }
    .flex1 {
        flex: 1;
    }
    .yin{
        display: none;
    }
    .flexDirection {
        flex-direction: row;
    }

    .justifyContent {
        justify-content: center;
        align-items: center;
    }

    .flexShrink {
        flex-shrink: 1;
    }

    .flexDirection {
        flex-direction: column;
    }

    .textAlign {
        text-align: center;
    }
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
    .information {
        align-items: stretch;
        padding: 10px 0;
        .information-content {
            &:not(:first-child) {
                padding: 0 16px;
            }
        }
    }

    .information-content {
        box-sizing: border-box;
        margin-left: 12px;
        .infor-title {
            font-size: 14px;
            color: #7c7c7c;
            margin-bottom: 10px;
        }
        .infor {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-bottom: 8px;
            .value {
                color: #7c7c7c;
                font-size: 12px;
            }
        }
    }
    .label {
        font-size: 12px;
        color: #999;
    }
    .signBox{
        width:28px;
        // height:244px;
        box-sizing: border-box;
        top:26px;
        right: 24px;
    }
    .circular {
            cursor: pointer;
            text-align: center;
            width: 28px;
            height: 28px;
            line-height: 28px;
            background: #00bcbf;
            color: #fff;
            border-radius: 50%;
            font-size: 12px;
        }
    .photos{
        cursor: pointer;
        margin-top: 30px;
        width: 25px;
        height: 25px;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .circularOther {
            cursor: pointer;
            text-align: center;
            margin-top:20px;
            width: 28px;
            height: 28px;
            color: #fff;
            background: #00bcbf;
            border-radius: 50%;
            font-size: 12px;
            line-height: 28px;
            p{
                margin:0;
                line-height: 28px;
            }
        }
    .message {
        margin-right: 32px;
        height: 12px;
    }
    .messages {
        height: 12px;
    }
    .icon {
        display: inline-block;
        width: 12px;
        height: 12px;
        background-size:contain;
        background-position: center;
        background-repeat: no-repeat;
    }
    .images {
        display: inline-block;
        width: 14px;
        height: 14px;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        margin-left: 32px;
        cursor: pointer;
    }
}
</style>