// model
Ext.define('outApply', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id'
					}, {
						name : 'beginTime'
					}, {
						name : 'endTime'
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
// 外出 store
var outApplyStore = Ext.create('Ext.data.Store', {
			model : 'outApply',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../attendance/outApply!getAll'
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
var outApply_menu = Ext.create('Ext.menu.Menu', {
			margin : '0 0 10 0',
			items : [{
						iconCls : 'add',
						text : '增加',
						handler : function() {
							Ext.create('outApply_EditWindow', {
										title : '增加'
									}).show();
						}
					}, {
						iconCls : 'refresh',
						text : '刷新',
						handler : function() {
							outApply_refresh()
						}
					}]
		});
// 刷新
var outApply_refresh = function() {
	outApplyStore.load();
}
// 增加/修改
Ext.define('outApply_EditWindow', {
	extend : 'Ext.window.Window',
	width : 520,
	id : 'outApply_window',
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
		id : 'outApply_form',
		margin : '0 2 2 2',
		defaultType : 'textfield',
		frame : true,
		layout : 'column',
		items : [{
					xtype : 'hiddenfield',
					id : 'outApplyID',
					name : 'outApplyModel.id'
				}, {
					xtype : 'timefield',
					name : 'outApplyModel.startDate',
					fieldLabel : '开始',
					id : 'outApplyStart',
					afterLabelTextTpl : required,
					minValue : '8:00 上午',
					margin : '10 0 0 5',
					labelWidth : 45,
					value : new Date(),
					maxValue : '6:00 下午',
					columnWidth : .5,
					allowBlank : false,
					increment : 10,
					listeners : {
						'select' : {
							fn : function() {
								var startField = Ext.getCmp('outApplyStart');
								var start = Ext.Date.format(startField.value,
										'H:i');
								var endField = Ext.getCmp('outApplyEnd');
								var end = Ext.Date
										.format(endField.value, 'H:i');
								if (start > end) {
									endField.setValue(startField.value);
								}
							},
							scope : this
						}
					}
				}, {
					xtype : 'timefield',
					id : 'outApplyEnd',
					name : 'outApplyModel.endDate',
					fieldLabel : '结束',
					margin : '10 0 0 15',
					afterLabelTextTpl : required,
					minValue : '8:00 上午',
					value : new Date(),
					labelWidth : 45,
					format : 'g:i A',
					allowBlank : false,
					maxValue : '6:00 下午',
					listeners : {
						'select' : {
							fn : function() {
								var startField = Ext.getCmp('outApplyStart');
								var start = Ext.Date.format(startField.value,
										'H:i');
								var endField = Ext.getCmp('outApplyEnd');
								var end = Ext.Date
										.format(endField.value, 'H:i');
								if (start > end) {
									startField.setValue(endField.value);
								}
							},
							scope : this
						}
					},
					columnWidth : .5,
					increment : 10
				}, {
					xtype : 'htmleditor',
					fieldLabel : '原因',
					afterLabelTextTpl : required,
					labelWidth : 45,
					name : 'outApplyModel.reason',
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
			var form = Ext.getCmp('outApply_form').getForm();
			var title = Ext.getCmp('outApply_window').title;
			var url;
			if (title == '增加') {
				url = '../../../attendance/outApply!add';
			} else {
				url = '../../../attendance/outApply!updateAll'
			}
			if (form.isValid()) {
				form.submit({
							clientValidation : true,
							url : url,
							success : function(form, action) {
								outApplyStore.load();
								Ext.getCmp('outApply_window').close();
							},
							failure : function(form, action) {
								Ext.getCmp('outApply_window').close();
								Ext.Msg
										.alert('提示',
												"<span style='color:red'>操作失败请联系管理员！</span>");

							}
						});
			}
		}
	}, {
		text : '取消',
		handler : function() {
			Ext.getCmp('outApply_window').close();
		}
	}]
})
var outAppplyOperate = function(value) {
	var grid = Ext.getCmp('outApply_grid');
	var selModel = grid.getSelectionModel();
	if (selModel.getSelection().length == 1) {
		var select = selModel.getSelection();
		if (value == '0') {
			Ext.create('outApply_EditWindow', {
						title : '修改'
					}).show();
			Ext.getCmp('outApplyID').setValue(select[0].data.id);
			Ext.getCmp('outApplyStart').setValue(select[0].data.beginTime);
			Ext.getCmp('outApplyEnd').setValue(select[0].data.endTime);
			Ext.getCmp('reason').setValue(select[0].data.reason);
		} else if (value == '-1') {
			Ext.Ajax.request({
						url : '../../../attendance/outApply!delete',
						params : {
							'outApplyModel.id' : select[0].data.id
						},
						success : function(res) {
							if (res.responseText == 'true') {
								outApplyStore.load();
							}
						},
						failure : function(res) {
						}
					});
		} else {
			Ext.Ajax.request({
						url : '../../../attendance/outApply!update',
						params : {
							'outApplyModel.id' : select[0].data.id,
							'outApplyModel.state' : value
						},
						success : function(res) {
							if (res.responseText == 'true') {
								outApplyStore.load();
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
Ext.define('OutApply', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.outApply',
	layout : 'fit',
	listeners : {
		afterrender : function() {
			outApplyStore.load();
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
		id : 'outApply_grid',
		store : outApplyStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : outApplyStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'add',
					text : '增加',
					handler : function() {
						Ext.create('outApply_EditWindow', {
									title : '增加'
								}).show();
					}
				}, '-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : outApply_refresh
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
							outApplyStore.load({
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
											'state' : '申请归来'
										}, {
											'id' : '5',
											'state' : '已归来'
										}, {
											'id' : '6',
											'state' : '归来失败'
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
							return "<span style='color:green'>申请归来</span>";
						} else if (v == '5') {
							return "已归来";
						} else if (v == '6') {
							return "<spanstyle='color:red'>归来失败</span>";
						}
					}

				}, {
					header : '开始时间',
					dataIndex : 'beginTime'
				}, {
					header : '预计归来时间',
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
							return "<a href='#' onclick='javascript:outAppplyOperate("
									+ 4 + ")'>归来申请</a>"
						} else if (v == '3') {
							return "<a href='#' onclick='javascript:outAppplyOperate("
									+ 0
									+ ")'>修改</a>/"
									+ "<a href='#' onclick='javascript:outAppplyOperate("
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
					"<p><b style='margin-left:0px;'>实际归来时间:</b> {reallyEndDate}</p>",
					'</tpl>',
					'<tpl for="comments">',
					'<p style="margin-left:5px;"><b style="">{name}</b> <span style="color:green"> 批语：</span>{comment}',
					'</tpl>']
		}],
		listeners : {
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
				outApply_menu.removeAll();
				outApply_menu.add({
							iconCls : 'add',
							text : '增加',
							handler : function() {
								Ext.create('outApply_EditWindow', {
											title : '增加'
										}).show();
							}
						}, {
							iconCls : 'refresh',
							text : '刷新',
							handler : function() {
								outApply_refresh()
							}
						});
				outApply_menu.showAt(e.getXY());
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
				outApply_menu.removeAll();
				if (record.data.state == '2') {
					outApply_menu.add({
								iconCls : 'my_save',
								text : '归来申请',
								handler : function() {
									outAppplyOperate(4)
								}
							});
				} else if (record.data.state == '3') {
					outApply_menu.add({
								iconCls : 'tabel_edit',
								text : '修改',
								handler : function() {
									outAppplyOperate(0)
								}
							}, {
								text : '删除',
								iconCls : 'delte0',
								handler : function() {
									outAppplyOperate(-1)
								}
							});
				}
				outApply_menu.add({
							iconCls : 'add',
							text : '增加',
							handler : function() {
								Ext.create('outApply_EditWindow', {
											title : '增加'
										}).show();
							}
						}, {
							iconCls : 'refresh',
							text : '刷新',
							handler : function() {
								outApply_refresh()
							}
						});
				outApply_menu.showAt(e.getXY());
			}
		}
	}]
});