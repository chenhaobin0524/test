<template>
    <div class="flex-layout data-type-manage">
        <ListLayoutPaper>
            <div slot="header-search">
                <el-input
                    v-model="searchvalue"
                    placeholder='名称/编码查询'
                    @keyup.enter.native='load(searchvalue)'
                ></el-input>
                <el-button type="primary" size="mini" @click='load(searchvalue)'>查 询</el-button>
            </div>
            <div slot="header-button">
                <el-tooltip class="item" effect="dark" content="新建数据类型" placement="bottom">
                    <el-button type="primary" size="mini" @click='add'><i class="el-icon-plus"></i></el-button>
                </el-tooltip>
            </div>
            <el-table slot="list"
                        slot-scope="props"
                        :height="props.tableHeight" stripe :data='data' border>
                <el-table-column prop='dataName' label='名称'></el-table-column>
                <el-table-column prop='tableName' label='表名'></el-table-column>
                <el-table-column prop='columnCode' label='编码字段'></el-table-column>
                <el-table-column prop='dataCode' label='数据编码'></el-table-column>
                <el-table-column prop='columnName' label='名称字段'></el-table-column>
                <el-table-column prop='enableFlag' label='数据状态'>
                    <template slot-scope='scope'>
                        <span v-if="scope.row.enableFlag">已启用</span>
                        <span v-else>已禁用</span>
                    </template>
                </el-table-column>
                <el-table-column fixed='right' label='操作' width="80">
                    <template slot-scope='scope'>
                        <el-button @click="show(scope)" type="text" size="mini">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change='handleCurrentChange'
                    :current-page='currentPage'
                    :page-size='10'
                    :page-sizes="[10, 20, 30, 50, 100]"
                    layout='total, sizes, prev, pager, next, jumper'
                    :total='totalCount'
                ></el-pagination>
            </div>
        </ListLayoutPaper>
        <el-dialog :title='titlename' :visible.sync='visiable' @close="closeDialog" top="5vh">
            <el-form :model='activeCode' :rules='rules' label-width='100px' ref='ruleForm'>
                <el-form-item label='名称' prop='dataName'>
                    <el-input v-model='activeCode.dataName' placeholder='请输入名称…'></el-input>
                </el-form-item>
                <el-form-item label='表名' prop='tableName'>
                    <el-input v-model='activeCode.tableName' placeholder='请输入表名…'></el-input>
                </el-form-item>
                <el-form-item label='编码字段' prop='columnCode'>
                    <el-input v-model='activeCode.columnCode' placeholder='请输入字段名…'></el-input>
                </el-form-item>
                <el-form-item label='数据编码' prop='dataCode'>
                    <el-input v-model='activeCode.dataCode' :disabled="titlename === '编辑'" placeholder='请输入字段名…'></el-input>
                </el-form-item>
                <el-form-item label='名称字段' prop='columnName'>
                    <el-input v-model='activeCode.columnName' placeholder='请输入中文字段名…'></el-input>
                </el-form-item>
                <el-form-item label='接口URL' prop='url' class="url-wrapper">
                    <el-input class="url-input" v-model='activeCode.url' placeholder='请输入接口URL…'></el-input>
                    <el-select v-model="activeCode.requestType" disabled placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='禁用' prop='enableFlag'>
                    <input type="checkbox" v-model="activeCode.enableFlag" :true-value='0' :false-value='1' />
                </el-form-item>
                <div class="kv-table">
                    <el-table :data='reqList'>
                        <el-table-column prop='kv' label='参数键值对'></el-table-column>
                        <el-table-column prop='need' label='是否必须' width="100"></el-table-column>
                        <el-table-column prop='remark' label='备注' width="260"></el-table-column>
                    </el-table>
                </div>
                <el-form-item label='示例' prop='reqParams'>
                    <el-input
                        type="textarea"
                        :rows="4"
                        :readonly='true'
                        v-model="reqParams">
                    </el-input>
                </el-form-item>
                <el-form-item label='返回参数' prop='respParams'>
                    <el-input
                        type="textarea"
                        :rows="4"
                        :readonly='true'
                        v-model="respParams">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class='dialog-buttons'>
                <div>
                    <el-button type="danger" plain @click="remove(activeCode.id)" v-bind:disabled="!activeCode.id && activeCode.id !== 0">删 除</el-button>
                </div>
                <div>
                    <el-button @click='closeDialog'>取 消</el-button>
                    <el-button type='primary' @click="onOk('ruleForm')">确 定</el-button>
                </div>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import ListLayoutPaper from '@/components/lots/listLayout/Paper';
import dataTypeAPI from '../api/DataTypeAPI';

export default {
    components: { ListLayoutPaper },
    name: 'data_type',
    data() {
        const validateNull = (rule, value, callback) => {
            if (/\s+/.test(value)) {
                return callback(new Error('请勿输入空格'));
            }
            callback();
        };
        const validateLength12 = (rule, value, callback) => {
            if (value && value.length > 12) {
                return callback(new Error('长度不能超过12'));
            }
            callback();
        };
        const validateLength36 = (rule, value, callback) => {
            if (value && value.length > 36) {
                return callback(new Error('长度不能超过36'));
            }
            callback();
        };
        const validateLength255 = (rule, value, callback) => {
            if (value && value.length > 255) {
                return callback(new Error('长度不能超过255'));
            }
            callback();
        };
        return {
            searchvalue: '',
            titlename: '',
            visiable: false,
            activeCode: {},
            data: [],
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
            tenants: [],
            rules: {
                tableName: [
                    {
                        required: true,
                        message: '请输入名称',
                        trigger: 'blur'
                    },
                    { validator: validateNull, trigger: 'blur' },
                    { validator: validateLength36, trigger: 'blur' }
                ],
                dataName: [
                    {
                        required: true,
                        message: '请输入值名',
                        trigger: 'blur'
                    },
                    { validator: validateNull, trigger: 'blur' },
                    { validator: validateLength36, trigger: 'blur' }
                ],
                columnCode: [
                    {
                        required: true,
                        message: '请输入名称字段',
                        trigger: 'blur'
                    },
                    { validator: validateNull, trigger: 'blur' },
                    { validator: validateLength36, trigger: 'blur' }
                ],
                dataCode: [
                    { validator: validateNull, trigger: 'blur' },
                    { validator: validateLength12, trigger: 'blur' }
                ],
                columnName: [
                    {
                        required: true,
                        message: '请输入编码字段',
                        trigger: 'blur'
                    },
                    { validator: validateNull, trigger: 'blur' },
                    { validator: validateLength36, trigger: 'blur' }
                ],
                url: [
                    {
                        required: true,
                        message: '请输入接口URL',
                        trigger: 'blur'
                    },
                    { validator: validateNull, trigger: 'blur' },
                    { validator: validateLength255, trigger: 'blur' }
                ]
            },
            options: [{
                value: 'POST',
                label: 'POST'
            }, {
                value: 'GET',
                label: 'GET'
            }, {
                value: 'PUT',
                label: 'PUT'
            }, {
                value: 'DELETE',
                label: 'DELETE'
            }],
            selecVal: 'POST'
        };
    },
    computed: {
        reqParams: function() {
            return this.activeCode.url + '?tableName=' + this.activeCode.tableName + '&columnCode=' +
            this.activeCode.columnCode + '&columnName=' + this.activeCode.columnName + '&pageNo=1&pageSize=10&search=XXX';
        },
        respParams: function() {
            const param = {
                'code': '0',
                'msg': 'Success',
                'timestamp': null,
                'data': {
                    'list': [
                        {
                            'authCode': 'A0010209',
                            'authName': '陕西旺旺商贸有限公司'
                        },
                        {
                            'authCode': 'A0010287',
                            'authName': '杭州旺旺食品有限公司'
                        },
                        {
                            'authCode': 'A0014270',
                            'authName': '山东旺旺食品有限公司济南分公司'
                        },
                        {
                            'authCode': 'A0014280',
                            'authName': '广西旺旺食品有限公司'
                        }
                    ],
                    'offset': 0,
                    'pageNo': 7,
                    'pageSize': 4,
                    'totalCount': 30,
                    'totalPage': 8
                }
            };
            return JSON.stringify(param, null, 4);
        },
        reqList: function() {
            return [{
                kv: 'tableName=' + this.activeCode.tableName,
                need: '必须',
                remark: '业务系统目标表名'
            }, {
                kv: 'columnCode=' + this.activeCode.columnCode,
                need: '必须',
                remark: '业务系统目标字段名'
            }, {
                kv: 'columnName=' + this.activeCode.columnName,
                need: '必须',
                remark: '业务系统目标字段中文名'
            }, {
                kv: 'pageNo=1',
                need: '必须',
                remark: '页码'
            }, {
                kv: 'pageSize=10',
                need: '必须',
                remark: '页行数'
            }, {
                kv: 'search=XXX',
                need: '可选',
                remark: '关键字段查询(请实现前匹配模糊查询)'
            }];
        }
    },
    methods: {
        show(item) {
            this.visiable = true;
            // var scope = item;
            dataTypeAPI.getById(item.row.id).then(res => {
                this.activeCode = JSON.parse(JSON.stringify(res.data)) || {};
                this.activeCode.requestType = 'POST';// 暂时固定
                this.titlename = '编辑';
            }).catch(err => {
                this.$message.error(err);
                this.activeCode = JSON.parse(JSON.stringify(item.row));
                this.titlename = '编辑';
            });
        },
        add() {
            this.visiable = true;
            this.activeCode = {};
            this.activeCode.requestType = 'POST';// 暂时固定
            this.activeCode.enableFlag = 1;// 暂时固定
            this.titlename = '新增';
        },
        closeDialog() {
            this.resetForm();
        },
        resetForm() {
            this.visiable = false;
            this.$refs.ruleForm.resetFields();
        },
        onOk(formName) {
            var self = this;
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.titlename === '编辑') {
                        var id = this.activeCode.id;
                        const params = this.activeCode;
                        dataTypeAPI.update(id, params).then(res => {
                            if (res && +res.code === 0) {
                                this.resetForm();
                                self.load();
                                this.$message.success('保存成功!');
                            }
                        }).catch(err => {
                            this.$message.error(err);
                        });
                    } else {
                        const params = this.activeCode;
                        dataTypeAPI.save(params, params.enableFlag).then(res => {
                            if (res && +res.code === 0) {
                                this.resetForm();
                                self.load();
                                this.$message.success('新建成功!');
                            }
                        }).catch(err => {
                            this.$message.error(err);
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        load(value) {
            var self = this;
            const params = {
                pageSize: self.pageSize,
                pageNo: self.currentPage
            };
            if (this.searchvalue) {
                params['queryParam'] = this.searchvalue;
            }
            dataTypeAPI.get(params).then(res => {
                this.data = JSON.parse(JSON.stringify(res.data.list));
                this.totalCount = res.data.totalCount;
                this.currentPage = res.data.pageNo;
            }).catch(err => {
                this.$message.error(err);
            });
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.load();
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.load();
        },
        remove(id, index) {
            var self = this;
            this.visiable = false;
            dataTypeAPI.remove(id).then(res => {
                self.load();
                this.$message.success('已删除');
            }).catch(err => {
                this.$message.error(err);
            });
        },
        changeSwhich(item) {
            var self = this;
            var id = item.row.id;
            var params = {
                enableFlag: Number(item.row.enableFlag),
                version: item.row.version
            };
            dataTypeAPI.update(id, params).then(res => {
                self.load();
            });
        },
        showVisi(scope) {
            this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.remove(scope.row.id);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        }
    },
    mounted() {
        this.load();
        dataTypeAPI.getTenants().then(res => {
            if (res.data && res.data.list) {
                this.tenants = res.data.list;
            }
        });
    }
};
</script>
<style lang='less'>
.data-type-manage {
    .url-wrapper{
        .el-input.url-input{
            width: calc(100% - 185px);
        }
        .el-select{
            margin-left: 10px;
        }
    }

    .kv-table {
        margin: 0 0 10px 100px;
    }
}
</style>
