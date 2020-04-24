export default {
    'searchList': {
        'searchTxt': [
            {
                name: '收货客户',
                value: 'upperReceverName',
                type: 'input',
                unfold: true,
                span: 4
            },
            {
                name: '收货地址',
                value: 'receiverAddress',
                type: 'input',
                unfold: true,
                span: 5
            },
            {
                'name': '状态',
                'value': 'enabledFalg',
                'type': 'select',
                'unfold': true,
                'options': [
                    { value: '1', label: '启用' },
                    { value: '0', label: '停用' }
                ],
                'span': 2
            }
        ],
        'unfoldState': false,
        'advancedBtn': false
    },
    'table':
  {
      'switchType': true,
      'tableCut': true,
      'clickModify': true,
      'selectBtn': true,
      'leftOperation': true,
      'height': 400,
      'statesY': '启用',
      'statesN': '停用',
      'columns': [
          {
              'label': '收货客户',
              'prop': 'upperReceverName',
              'require': true,
              'mustFill': true,

              'width': 200
          },
          {
              'label': '收货地址',
              'prop': 'receiverAddress',
              'require': true,
              'mustFill': true,
              'width': 200,
              'type': 'input'
          },
          {
              'label': '状态',
              'prop': 'enabledFalg',
              'width': 100,
              'require': true,
              'activeValue': 'Y',
              'inactiveValue': 'N',
              'defaultValue': 'Y',
              'type': 'switch'
          },
          {
              'label': '修改时间',
              'prop': 'updateTime',
              'width': 160
          },
          {
              'label': '修改人',
              'prop': 'updateUserName',
              'width': 120
          },
          {
              'label': '创建时间',
              'prop': 'createTime',
              'width': 160
          },
          {
              'label': '创建人',
              'prop': 'createUserName',
              'width': 120
          }
      ],
      'action': [
          {
              'type': 'text',
              'label': '编辑',
              'size': 'small',
              'event': 'edit'
          }
      ]
  },
    'configuration': true,
    'page': {
        'layout': 'total, sizes, prev, pager, next, jumper',
        'pageSize': 10,
        'pageSizes': [10, 20, 50, 100]
    }
};
