// model
Ext.define('leaveFlow', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id'
					}, {
						name : 'userName'
					}, {
						name : 'beginTime'
					}, {
						name : 'endTime'
					}, {
						name : 'title'
					}, {
						name : 'reason'
					}, {
						name : 'isAllDay'
					}, {
						name : 'applyDate'
					}, {
						name : 'state'
					}, {
						name : 'comments'
					}]
		});
// 监控
var leaveflowWatch = function() {
	var grid = Ext.getCmp('leaveFlow_grid');
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
					},
					beforeclose : function(panel, eOpts) {
						panel.html="";
					}
				},
				minWidth:700,
				minHeight:400,
				border : false,
				modal : true,
				closable : true,
				layout : 'fit',
				tbar : ['流程图描述：', '<span style="color:blue">口</span>表示历史任务',
						'<span style="color:red">口</span>表示正在执行任务'

				],
				html : "<img height='100%' width='100%' src=\"../../../process/instance!picture.action?id="
						+ select[0].data.id + "&definitionKey=leave\">"
			}).show();
		} else {
			Ext.Msg.alert('提示', "<span style='color:red'>流程结束没有监控！</span>");
		}
	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请选择一条数据！</span>");
	}
};
// 流程定义 store
var leaveFlowStore = Ext.create('Ext.data.Store', {
			model : 'leaveFlow',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../work/leave!getAll'
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
var leaveFlow_menu = Ext.create('Ext.menu.Menu', {
			margin : '0 0 10 0',
			items : [{
						iconCls : 'add',
						text : '增加',
						handler : function() {
							Ext.create('leaveFlow_EditWindow', {
										title : '增加'
									}).show();
						}
					}, {
						iconCls : 'delte0',
						text : '监控',
						handler : function() {
							leaveflowWatch();
						}
					}, {
						iconCls : 'refresh',
						text : '刷新',
						handler : function() {
							leaveFlow_refresh()
						}
					}]
		});
// 刷新
var leaveFlow_refresh = function() {
	leaveFlowStore.load();
}
// 增加
Ext.define('leaveFlow_EditWindow', {
	extend : 'Ext.window.Window',
	width : 520,
	id : 'leaveFlow_window',
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
	layout : 'fit',
	items : [{
				xtype : 'form',
				frame : true,
				id : 'leaveFlow_form',
				margin : '0 2 2 2',
				defaultType : 'textfield',
				frame : true,
				layout : 'column',
				items : [{
							xtype : 'textfield',
							fieldLabel : '标题',
							id : 'title',
							labelWidth : 45,
							afterLabelTextTpl : required,
							regex : /^[\u4e00-\u9fa5\w]*$/,
							regexText : '请输入中英文',
							margin : '10 0 0 5',
							columnWidth : 1,
							allowBlank : false
						}, {
							xtype : 'daterangefield',
							id : 'date',
							margin : '10 0 0 5',
							afterLabelTextTpl : required,
							labelWidth : 45,
							singleLine : false,
							columnWidth : 1,
							fieldLabel : '时间'
						}, {
							xtype : 'htmleditor',
							fieldLabel : '原因',
							afterLabelTextTpl : required,
							labelWidth : 45,
							name : 'reason',
							id : 'reason',
							margin : '10 0 0 5',
							allowBlank : false,
							height : 300,
							columnWidth : 1
						}]
			}],
	buttons : [{
		text : '确定',
		handler : function() {
			var form = Ext.getCmp('leaveFlow_form').getForm();
			if (form.isValid()) {
				var title = Ext.getCmp('title').value;
				var dates = Ext.getCmp('date').getValue();
				var reason = Ext.getCmp('reason').value;
				var myFormat = 'Y-m-d H:i:s';
				if (dates[2]) {
					myFormat = 'Y-m-d';
				}
				Ext.Ajax.request({
					url : '../../../work/leave!add',
					params : {
						'leaveModel.id' : '',
						'leaveModel.title' : title,
						'leaveModel.beginTime' : Ext.Date.format(dates[0],
								myFormat),
						'leaveModel.endTime' : Ext.Date.format(dates[1],
								myFormat),
						'leaveModel.isAllDay' : dates[2],
						'leaveModel.reason' : reason
					},
					success : function(res) {
						if (res.responseText == 'true') {
							leaveFlowStore.load();
							Ext.getCmp('leaveFlow_window').close();
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
			Ext.getCmp('leaveFlow_window').close();
		}
	}]
})
// xtype
Ext.define('FlowManager_leave', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.flowManager_leave',
	layout : 'fit',
	listeners : {
		afterrender : function() {
			leaveFlowStore.load();
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
		id : 'leaveFlow_grid',
		store : leaveFlowStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : leaveFlowStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'add',
					text : '增加',
					handler : function() {
						Ext.create('leaveFlow_EditWindow', {
									title : '增加'
								}).show();
					}
				}, '-', {
					iconCls : 'delte0',
					text : '监控',
					handler : leaveflowWatch
				}, '-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : leaveFlow_refresh
				}, '-', '->', '-', {
					width : 200,
					fieldLabel : '搜索',
					labelWidth : 35,
					emptyText : '标题',
					xtype : 'searchfield',
					store : leaveFlowStore
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
					header : '开始时间',
					dataIndex : 'beginTime'
				}, {
					header : '结束时间',
					dataIndex : 'endTime'
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
					"<p><b style='margin-left:0px;'>申请时间:</b> {applyDate}</p>",
					"<b style='margin-left:5px;'>原因:</b> {reason}",
					'<tpl for="comments">',
					'<p style="margin-left:5px;"><b style="">{name}</b> <span style="color:green"> 批语：</span>{comment}',
					'</tpl>']
		}],
		listeners : {
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
				leaveFlow_menu.showAt(e.getXY());
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
				leaveFlow_menu.showAt(e.getXY());
			}
		}
	}]
});