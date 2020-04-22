<template>
    <span id="order-searchset">
    <el-popover
      placement="bottom"
      width="1300"
      @show="initData"
      trigger="manual"
      v-model="dialogVisible">
      <div id="search-set">
        <ul class="search-list-box">
          <li v-for="(item,index) in searchSetList" :key="index">
            <span>{{item.name}}</span>
            <div>
              <div class="inlineBlock">
                  <otpAdvance
                      @getAdvanceValue="getAdvanceValue"
                      :mValue="searchData[item.value]"
                      :params="item.option || item"
                      v-if="item.type === 'advance'"
                  ></otpAdvance>
              </div>
              <el-input class="inlineBlock"
                v-if="item.type === 'input'"
                v-model="searchData[item.value]" clearable>
              </el-input>
              <el-select v-model="searchData[item.value]" v-if="item.type === 'select'" :multiple="item.multiple?item.multiple:false"
              class="inlineBlock">
                <el-option
                  v-for="(val, index) in item.options"
                  :key=index
                  :label="val.label"
                  :value="val.value">
                </el-option>
              </el-select>
              <el-date-picker
                class="inlineBlock"
                v-if="item.type === 'time'"
                v-model="searchData[item.value]"
                size="mini"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </div>
          </li>
          <div v-if="!showState" class="btn-box">
            <el-button type="text" @click="showState=true">自定义搜索条件</el-button>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button type="text" @click="clear">清空</el-button>
          </div>
        </ul>
        <div v-if="showState">
          <p class="line"></p>
          <p>选择添加搜索条件</p>
          <ul class="search-total-box">
            <li v-for="(item,index) in searchTotalTitle" :key="index">
              <el-button class="btn-width" plain :style="searchSelect[index]"
              @click="btnChange(index)">{{item.name}}</el-button>
            </li>
            <li class="btn-box">
              <el-button type="text" @click="cancelSearch">取消</el-button>
              <el-button type="primary" @click="saveSearch">保存</el-button>
            </li>
          </ul>
        </div>
      </div>
      <el-button slot="reference" type="text" @click="dialogVisible = !dialogVisible;">高级搜索</el-button>
    </el-popover>
    <div class="search-set_back" v-show="dialogVisible" @click.self="dialogVisible = !dialogVisible;"></div>
  </span>
</template>

<script>
import otpAdvance from '@/components/lots/otpAdvance';
export default {
    components: { otpAdvance },
    props: {
        searchTotalTitle: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    data() {
        return {
            datas: [],
            datasSet: [],
            searchData: {},
            searchSelect: [],
            searchSetList: [],
            showState: false,
            dialogVisible: false,
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            }
        };
    },
    methods: {
        btnChange(index) {
            if (index === 0) return;
            this.datas[index].select = !this.datas[index].select;
            this.selectedShow();
        },
        cancelSearch() {
            this.showState = false;
        },
        saveSearch() {
            this.showState = false;
            this.searchSetList = [];
            this.datas.map((data, index) => {
                if (data.select) {
                    this.searchSetList.push(data);
                }
            });
        },
        clear() {
            this.searchData = {};
        },
        search() {
            this.dialogVisible = false;
            this.$emit('search', this.searchData);
        },
        initData() {
            this.selectedShow();
        },
        selectedShow() {
            this.datas.map((data, index) => {
                const style = {};
                if (data.select) {
                    style.color = '#00BCBF';
                    style.borderColor = '#00BCBF';
                } else {
                    style.color = '#252626';
                    style.borderColor = '#CECECE';
                }
                this.$set(this.searchSelect, index, style);
            });
        },
        getAdvanceValue(data) {
            this.searchData = { ...this.searchData, ...data };
        }
    },
    mounted() {
        this.datas = this.searchTotalTitle;
        this.datas.map((data, index) => {
            this.$set(this.searchSelect, index, {});
            if (data.select) {
                this.searchSetList.push(data);
            }
        });
    }
};
</script>

<style lang="less">
#search-set{
  ul{
    display: flex;
    flex-wrap: wrap;
  }
  .search-list-box{
    margin-top: 10px;
    >li{
      width: 344px;
      margin-bottom: 10px;
      display: flex;
      >span{
        display: inline-block;
        height: 28px;
        line-height: 28px;
        width: 104px;
        padding: 0 10px;
        text-align: right;
      }
      >div{
        width: 240px;
      }
      .select-btn{
        color: #eee!important;
      }
    }
    .btn-box{
      width: 100%;
      clear: both;
      margin-bottom: 10px;
      button{
        float: right;
      }
      :first-child{
        float: left;
      }
    }
  }
  .line{
    height: 1px;
    width: 100%;
    background-color: #F2F2F2;
  }
  .search-total-box{
    max-height: 150px;
    li{
      width: 162px;
      padding: 10px 10px 0 0;
    }
    .btn-box{
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }
  .btn-width{
    width: 162px;
  }
  .inlineBlock {
      position: relative;
      font-size: 12px;
      width: 100%;
      z-index: 0;
  }
}
.search-set_back {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
}

</style>
