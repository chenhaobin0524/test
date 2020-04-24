<template>
    <div class="information-wraps">
        <div
            class="information w_100 flex_wrap"
            v-for="(list,index) in data"
            :key="index"
            :class="{yin:list.length == 0}"
        >
            <div class="information-content" v-for="(item, index) in list" :key="index">
                <div class="infor-title">{{item.title}} <span v-if="item.event" @click="titleClick(item.event)" v-text="item.subTitle"></span></div>
                <div class="infors">
                    <div class="infirss" v-for="(subItem, subIndex) in item.subItems" :key="subIndex">
                        <div class="infor" v-if="!subItem.noShow">
                            <span class="label">{{subItem.label}}</span>：
                              <span class="value" v-if="subItem.dblclick" :class="subItem.class" :title="subItem.value" @dblclick="dblclick(subItem.value)">
                                {{subItem.value?subItem.value:''}}
                                <span
                                    class="message"
                                    v-for="(item,index) in subItem.message"
                                    :key="index"
                                >
                                    <span v-if="item.value" class="icon" :style="'background-image:url('+item.icon+')'"></span>
                                    {{item.value}}
                                </span>
                                <span class="images" @click='openMapClick' :style="'background-image:url('+subItem.images.url+')'" v-if="subItem.images"></span>
                            </span>
                            <span class="value" v-else :class="subItem.class" :title="subItem.value">
                                {{subItem.value?subItem.value:''}}
                                <span
                                    class="message"
                                    v-for="(item,index) in subItem.message"
                                    :key="index"
                                >
                                    <span v-if="item.value" class="icon" :style="'background-image:url('+item.icon+')'"></span>
                                    {{item.value}}
                                </span>
                                <span class="images" @click='openMapClick' :style="'background-image:url('+subItem.images.url+')'" v-if="subItem.images"></span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        infoData: {
            type: Array
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
        dblclick(clickContent) {
            if (clickContent && clickContent !== 'undefined') {
                var input = document.createElement('input');
                document.body.appendChild(input);
                input.setAttribute('value', clickContent);
                input.setAttribute('readonly', 'readonly');
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
                this.$message.success(`‘${input.value}’复制成功`);
            }
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
        titleClick(event) {
            this.$emit(event);
        }
    },
    mounted() {
        this.showList();
    }
};
</script>

<style lang="less" >
.information-wraps {
    position: relative;
    // top: -8px;
    .w_100 {
        width: 100%;
    }
    .w_100 .w_33:not(:first-child) {
        border-left: 1px solid #ccc;
    }
    .flex_wrap {
        flex-wrap: wrap;
    }
    .yin{
        display: none;
    }
    .flexShrink {
        flex-shrink: 1;
    }
    .textAlign {
        text-align: center;
    }
    .information-content {
        box-sizing: border-box;
        padding-left: 12px;
        .el-collapse-item__content{
        padding-bottom: 0px;
    }
         &:not(:first-child) {
             border-top: 1px solid #ccc;
            }
        .infor-title {
            font-size: 14px;
            color: #7c7c7c;
            margin-bottom: 8px;
            margin-top: 5px;
        }
        .infors{
            display: flex;
            justify-content: flex-start;
            .infirss{
                min-width: 300px;
            }
            .infor {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                margin-bottom: 5px;
                .value {
                    color: #7c7c7c;
                    font-size: 12px;
                }
        }
        }
    }
    .label {
        font-size: 12px;
        color: #999;
    }

    .message {
        margin-right: 32px;
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