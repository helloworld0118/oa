// model
Ext.define('workExtra', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id'
					}, {
						name : 'beginTime'
					}, {
						name : 'endTime'
					}, {
						name : 'isAllDay'
					}, {
						name : 'reallyEndDate'
					}, {
						name : 'reason'
					}, {
						name : 'applyDate'
					}, {
						name : 'state'
					}, {
						name : 'comments'
					}]
		});
// 加班 store
var workExtraStore = Ext.create('Ext.data.Store', {
			model : 'workExtra',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../attendance/workExtra!getAll'
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
var workExtra_menu = Ext.create('Ext.menu.Menu', {
			margin : '0 0 10 0',
			items : [{
						iconCls : 'add',
						text : '增加',
						handler : function() {
							Ext.create('workExtra_EditWindow', {
										title : '增加'
									}).show();
						}
					}, {
						iconCls : 'refresh',
						text : '刷新',
						handler : function() {
							workExtra_refresh()
						}
					}]
		});
// 刷新
var workExtra_refresh = function() {
	workExtraStore.load();
}
// 增加/修改
Ext.define('workExtra_EditWindow', {
	extend : 'Ext.window.Window',
	width : 520,
	id : 'workExtra_window',
	frame : true,
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
				id : 'workExtra_form',
				margin : '0 2 2 2',
				defaultType : 'textfield',
				frame : true,
				layout : 'column',
				items : [{
							xtype : 'hiddenfield',
							id : 'workExtraID',
							name : 'id'
						}, {
							xtype : 'daterangefield',
							id : 'workExtraDate',
							margin : '5 0 0 5',
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
							margin : '5 0 0 5',
							allowBlank : false,
							height : 300,
							columnWidth : 1
						}]
			}],
	buttons : [{
		text : '确定',
		handler : function() {
			var form = Ext.getCmp('workExtra_form').getForm();
			if (form.isValid()) {
				var workExtraDates = Ext.getCmp('workExtraDate').getValue();
				var reason = Ext.getCmp('reason').value;
				var myFormat = 'Y-m-d H:i:s';
				if (workExtraDates[2]) {
					myFormat = 'Y-m-d';
				}
				var op = 'add'
				if (Ext.getCmp('workExtra_window').title == '修改') {
					op = 'updateAll';
				}
				Ext.Ajax.request({
					url : '../../../attendance/workExtra!' + op,
					params : {
						'workExtraModel.id' : Ext.getCmp('workExtraID').value,
						'workExtraModel.startDate' : Ext.Date.format(
								workExtraDates[0], myFormat),
						'workExtraModel.estimateEndDate' : Ext.Date.format(
								workExtraDates[1], myFormat),
						'workExtraModel.isAllDay' : workExtraDates[2],
						'workExtraModel.reason' : reason
					},
					success : function(res) {
						if (res.responseText == 'true') {
							workExtraStore.load();
							Ext.getCmp('workExtra_window').close();
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
			Ext.getCmp('workExtra_window').close();
		}
	}]
})
var workExtraOperate = function(value) {
	var grid = Ext.getCmp('workExtra_grid');
	var selModel = grid.getSelectionModel();
	if (selModel.getSelection().length == 1) {
		var select = selModel.getSelection();
		if (value == '0') {
			Ext.create('workExtra_EditWindow', {
						title : '修改'
					}).show();
			Ext.getCmp('workExtraID').setValue(select[0].data.id)
			Ext.getCmp('workExtraDate').setValue(select[0].data);
			Ext.getCmp('reason').setValue(select[0].data.reason);
		} else if (value == '-1') {
			Ext.Ajax.request({
						url : '../../../attendance/workExtra!delete',
						params : {
							'workExtraModel.id' : select[0].data.id
						},
						success : function(res) {
							if (res.responseText == 'true') {
								workExtraStore.load();
							}
						},
						failure : function(res) {
						}
					});
		} else {
			Ext.Ajax.request({
						url : '../../../attendance/workExtra!update',
						params : {
							'workExtraModel.id' : select[0].data.id,
							'workExtraModel.state' : value
						},
						success : function(res) {
							if (res.responseText == 'true') {
								workExtraStore.load();
							}
						},
						failure : function(res) {
						}
					});
		}
	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请选择一条数据！</span>");
	}
}
// xtype
Ext.define('WorkExtraApply', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.workExtraApply',
	layout : 'fit',
	listeners : {
		afterrender : function() {
			workExtraStore.load();
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
		id : 'workExtra_grid',
		store : workExtraStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : workExtraStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'add',
					text : '增加',
					handler : function() {
						Ext.create('workExtra_EditWindow', {
									title : '增加'
								}).show();
					}
				}, '-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : workExtra_refresh
				}, '-', '->', '-', {
					width : 200,
					xtype : 'combobox',
					fieldLabel : '搜索',
					labelWidth : 35,
					emptyText : '状态',
					triggerCls : Ext.baseCSSPrefix + 'form-search-trigger',
					valueField : 'id',
					displayField : 'state',
					listeners : {
						select : function(combo, records, eOpts) {
							workExtraStore.load({
										params : {
											query : records[0].data.id
										}
									});
						}
					},
					store : Ext.create('Ext.data.Store', {
								fields : [{
											name : 'id'
										}, {
											name : 'state'
										}],
								data : [{
											'id' : '0',
											'state' : '全部'
										}, {
											'id' : '1',
											'state' : '申请'
										}, {
											'id' : '2',
											'state' : '已批准'
										}, {
											'id' : '3',
											'state' : '不批准'
										}, {
											'id' : '4',
											'state' : '申请结束'
										}, {
											'id' : '5',
											'state' : '结束加班'
										}, {
											'id' : '6',
											'state' : '结束失败'
										}]
							})
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
					header : '状态',
					dataIndex : 'state',
					renderer : function(v) {
						if (v == '1') {
							return "<span style='color:green'>申请</span>";
						} else if (v == '2') {
							return "<span style='color:green'>已批准</span>";
						} else if (v == '3') {
							return "<spanstyle='color:red'>不批准</span>";
						} else if (v == '4') {
							return "<span style='color:green'>申请结束</span>";
						} else if (v == '5') {
							return "加班结束";
						} else if (v == '6') {
							return "<spanstyle='color:red'>结束失败</span>";
						}
					}

				}, {
					header : '开始时间',
					dataIndex : 'beginTime'
				}, {
					header : '预计结束时间',
					dataIndex : 'endTime'
				}, {
					header : '申请时间',
					dataIndex : 'applyDate'
				}, {
					header : '操作',
					dataIndex : 'state',
					width : 50,
					sortable : true,
					renderer : function(v) {
						if (v == '1') {
						} else if (v == '2') {
							return "<a href='#' onclick='javascript:workExtraOperate("
									+ 4 + ")'>申请结束</a>"
						} else if (v == '3') {
							return "<a href='#' onclick='javascript:workExtraOperate("
									+ 0
									+ ")'>修改</a>/"
									+ "<a href='#' onclick='javascript:workExtraOperate("
									+ -1 + ")'>删除</a>";
						} else if (v == '4') {
						} else if (v == '5') {
						} else if (v == '6') {
						} else if (v == '7') {
						} else {
						}
					},
					handler : function() {
						alert('a');
					}
				}],
		plugins : [{
			ptype : 'rowexpander',
			rowBodyTpl : [
					"<b style='margin-left:5px;'>原因:</b> {reason}",
					'<tpl if="reallyEndDate">',
					"<p><b style='margin-left:0px;'>实际结束时间:</b> {reallyEndDate}</p>",
					'</tpl>',
					'<tpl for="comments">',
					'<p style="margin-left:5px;"><b style="">{name}</b> <span style="color:green"> 批语：</span>{comment}',
					'</tpl>']
		}],
		listeners : {
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
				workExtra_menu.removeAll();
				workExtra_menu.add({
							iconCls : 'add',
							text : '增加',
							handler : function() {
								Ext.create('workExtra_EditWindow', {
											title : '增加'
										}).show();
							}
						}, {
							iconCls : 'refresh',
							text : '刷新',
							handler : function() {
								workExtra_refresh()
							}
						});
				workExtra_menu.showAt(e.getXY());
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
				workExtra_menu.removeAll();
				if (record.data.state == '2') {
					workExtra_menu.add({
								iconCls : 'my_save',
								text : '申请结束',
								handler : function() {
									workExtraOperate(4)
								}
							});
				} else if (record.data.state == '3') {
					workExtra_menu.add({
								iconCls : 'tabel_edit',
								text : '修改',
								handler : function() {
									workExtraOperate(0)
								}
							}, {
								text : '删除',
								iconCls : 'delte0',
								handler : function() {
									workExtraOperate(-1)
								}
							});
				}
				workExtra_menu.add({
							iconCls : 'add',
							text : '增加',
							handler : function() {
								Ext.create('workExtra_EditWindow', {
											title : '增加'
										}).show();
							}
						}, {
							iconCls : 'refresh',
							text : '刷新',
							handler : function() {
								workExtra_refresh()
							}
						});
				workExtra_menu.showAt(e.getXY());
			}
		}
	}]
});