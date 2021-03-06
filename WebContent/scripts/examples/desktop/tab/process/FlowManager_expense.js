// model
Ext.define('expenseFlow', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id'
					}, {
						name : 'userName'
					}, {
						name : 'title'
					}, {
						name : 'reason'
					}, {
						name : 'expenseMoney'
					}, {
						name : 'applyDate'
					}, {
						name : 'state'
					}, {
						name : 'comments'
					}]
		});
// 监控
var expenseflowWatch = function() {
	var grid = Ext.getCmp('expenseFlow_grid');
	var selModel = grid.getSelectionModel();
	if (selModel.getSelection().length == 1) {
		var select = selModel.getSelection();
		if (select[0].data.state == '2') {
			
			Ext.create('Ext.window.Window', {
				title : '当前流程监控',
				frame : true,
				listeners : {
					render : function(p) {
						p.getEl().on("contextmenu", function(e) {
									e.preventDefault();
								})
					}
				},
				minWidth:700,
				minHeight:450,
				border : false,
				modal : true,
				closable : true,
				layout : 'fit',
				tbar : ['流程图描述：', '<span style="color:blue">口</span>表示历史任务',
						'<span style="color:red">口</span>表示正在执行任务'

				],
				html:"<img height='100%' width='100%' src=\"../../../process/instance!picture.action?id="+ select[0].data.id + "&definitionKey=expense\">"

			}).show();
		} else {
			Ext.Msg.alert('提示', "<span style='color:red'>流程结束没有监控！</span>");
		}
	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请选择一条数据！</span>");
	}
};
// 流程定义 store
var expenseFlowStore = Ext.create('Ext.data.Store', {
			model : 'expenseFlow',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../work/expense!getAll'
				},
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'items',
					totalProperty : 'total'
				},
				writer : {
					root : 'data',
					encode : true
				}
			}
		});
var expenseFlow_menu = Ext.create('Ext.menu.Menu', {
			margin : '0 0 10 0',
			items : [{
						iconCls : 'add',
						text : '增加',
						handler : function() {
							Ext.create('expenseFlow_EditWindow', {
										title : '增加'
									}).show();
						}
					}, {
						iconCls : 'delte0',
						text : '监控',
						handler : function() {
							expenseflowWatch();
						}
					}, {
						iconCls : 'refresh',
						text : '刷新',
						handler : function() {
							expenseFlow_refresh()
						}
					}]
		});
// 刷新
var expenseFlow_refresh = function() {
	expenseFlowStore.load();
}
// 增加
Ext.define('expenseFlow_EditWindow', {
	extend : 'Ext.window.Window',
	width : 520,
	id : 'expenseFlow_window',
	frame : true,
	height : 450,
	border : false,
	draggable : false,
	closable : true,
	resizable : false,
	modal : true,
	listeners : {
		render : function(p) {
			p.getEl().on("contextmenu", function(e) {
						e.preventDefault();
					})
		}
	},
	items : [{
				xtype : 'form',
				frame : true,
				id : 'expenseFlow_form',
				margin : '0 2 2 2',
				defaultType : 'textfield',
				frame : true,
				layout : 'anchor',
				items : [{
							xtype : 'textfield',
							fieldLabel : '标题',
							id : 'title',
							labelWidth : 45,
							afterLabelTextTpl : required,
							regex : /^[\u4e00-\u9fa5\w]*$/,
							regexText : '请输入中英文',
							margin : '10 0 0 10',
							allowBlank : false,
							anchor : '100%'
						}, {
							xtype : 'numberfield',
							margin : '10 0 0 10',
							name : 'expenseMoney',
							id : 'expenseMoney',
							afterLabelTextTpl : required,
							fieldLabel : '报销金额(<span style="color:red">元</span>)',
							labelWidth : 90,
							minValue : 0,
							value : 0,
							allowBlank : false,
							anchor : '100%'
						}, {
							xtype : 'htmleditor',
							fieldLabel : '原因',
							afterLabelTextTpl : required,
							labelWidth : 40,
							name : 'reason',
							id : 'reason',
							margin : '10 0 0 10',
							allowBlank : false,
							height : 300,
							anchor : '100%'
						}]
			}],
	buttons : [{
		text : '确定',
		handler : function() {
			var form = Ext.getCmp('expenseFlow_form').getForm();
			if (form.isValid()) {
				var title = Ext.getCmp('title').value;
				var reason = Ext.getCmp('reason').value;
				var expenseMoney = Ext.getCmp('expenseMoney').value;
				Ext.Ajax.request({
					url : '../../../work/expense!add',
					params : {
						'expenseModel.id' : '',
						'expenseModel.expenseMoney' : expenseMoney,
						'expenseModel.title' : title,
						'expenseModel.reason' : reason
					},
					success : function(res) {
						if (res.responseText == 'true') {
							expenseFlowStore.load();
							Ext.getCmp('expenseFlow_window').close();
						} else {
							Ext.Msg
									.alert('提示',
											"<span style='color:red'>操作失败请联系管理员！</span>");
						}
					},
					failure : function(res) {
					}
				})
			}
		}
	}, {
		text : '取消',
		handler : function() {
			Ext.getCmp('expenseFlow_window').close();
		}
	}]
})
// xtype
Ext.define('FlowManager_expense', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.flowManager_expense',
	layout : 'fit',
	listeners : {
		afterrender : function() {
			expenseFlowStore.load();
		},
		render : function(p) {
			p.getEl().on("contextmenu", function(e) {
						e.preventDefault();
					})
		}
	},
	items : [{
		xtype : 'grid',
		forceFit : true,
		frame : true,
		id : 'expenseFlow_grid',
		store : expenseFlowStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : expenseFlowStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'add',
					text : '增加',
					handler : function() {
						Ext.create('expenseFlow_EditWindow', {
									title : '增加'
								}).show();
					}
				}, '-', {
					iconCls : 'delte0',
					text : '监控',
					handler : expenseflowWatch
				}, '-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : expenseFlow_refresh
				}, '-', '->', '-', {
					width : 200,
					fieldLabel : '搜索',
					labelWidth : 35,
					emptyText : '标题',
					xtype : 'searchfield',
					store : expenseFlowStore
				}, '-', {
					xtype : 'splitbutton',
					text : '',
					iconCls : 'help',
					menu : [{
								text : '图文帮助',
								iconCls : 'help_img',
								handler : function() {
									findFailShow('MainTab', 'help_img');
								}
							}, {
								text : '视频帮助',
								iconCls : 'help_video',
								handler : function() {
									findFailShow('MainTab', 'help_video');
								}
							}]
				}],
		columns : [{
					header : '编号',
					dataIndex : 'id'
				}, {
					header : '标题',
					dataIndex : 'title'
				}, {
					header : '申请金额',
					dataIndex : 'expenseMoney'
				}, {
					header : '申请时间',
					dataIndex : 'applyDate'
				}, {
					header : '状态',
					dataIndex : 'state',
					renderer : function(v) {
						if (v == '2') {
							return "<span style='color:green'>审批中</span>";
						} else if (v == '3') {
							return '成功'
						} else {
							return "<span style='color:red'>失败</span>";
						}
					}
				}],
		plugins : [{
			ptype : 'rowexpander',
			rowBodyTpl : [
					"<b style='margin-left:0px;'>原因:</b> {reason}",
					'<tpl for="comments">',
					'<p style="margin-left:0px;"><b style="">{name}</b> <span style="color:green"> 批语：</span>{comment}',
					'</tpl>']
		}],
		listeners : {
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
				expenseFlow_menu.showAt(e.getXY());
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
				expenseFlow_menu.showAt(e.getXY());
			}
		}
	}]
});