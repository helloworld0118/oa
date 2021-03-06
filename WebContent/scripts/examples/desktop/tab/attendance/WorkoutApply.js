// model
Ext.define('workout', {
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
						name : 'outAddress'
					}, {
						name : 'state'
					}, {
						name : 'comments'
					}]
		});
// 加班 store
var workoutStore = Ext.create('Ext.data.Store', {
			model : 'workout',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../attendance/workout!getAll'
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
var workout_menu = Ext.create('Ext.menu.Menu', {
			margin : '0 0 10 0',
			items : [{
						iconCls : 'add',
						text : '增加',
						handler : function() {
							Ext.create('workout_EditWindow', {
										title : '增加'
									}).show();
						}
					}, {
						iconCls : 'refresh',
						text : '刷新',
						handler : function() {
							workout_refresh()
						}
					}]
		});
// 刷新
var workout_refresh = function() {
	workoutStore.load();
}
// 增加/修改
Ext.define('workout_EditWindow', {
	extend : 'Ext.window.Window',
	width : 520,
	id : 'workout_window',
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
				id : 'workout_form',
				margin : '0 2 2 2',
				defaultType : 'textfield',
				frame : true,
				layout : 'column',
				items : [{
							xtype : 'hiddenfield',
							id : 'workoutID',
							name : 'id'
						}, {
							xtype : 'daterangefield',
							id : 'workoutDate',
							margin : '5 0 0 5',
							afterLabelTextTpl : required,
							labelWidth : 45,
							singleLine : false,
							columnWidth : 1,
							fieldLabel : '时间'
						}, {
							xtype:'textarea',
							margin : '5 0 0 5',
							afterLabelTextTpl : required,
							labelWidth : 45,
							name : 'outAddress',
							id : 'outAddress',
							allowBlank : false,
							columnWidth : 1,
							fieldLabel : '地点'
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
			var form = Ext.getCmp('workout_form').getForm();
			if (form.isValid()) {
				var workoutDates = Ext.getCmp('workoutDate').getValue();
				var reason = Ext.getCmp('reason').value;
				var myFormat = 'Y-m-d H:i:s';
				if (workoutDates[2]) {
					myFormat = 'Y-m-d';
				}
				var op = 'add'
				if (Ext.getCmp('workout_window').title == '修改') {
					op = 'updateAll';
				}
				Ext.Ajax.request({
					url : '../../../attendance/workout!' + op,
					params : {
						'workoutModel.id' : Ext.getCmp('workoutID').value,
						'workoutModel.startDate' : Ext.Date.format(
								workoutDates[0], myFormat),
						'workoutModel.endDate' : Ext.Date.format(
								workoutDates[1], myFormat),
						'workoutModel.isAllDay' : workoutDates[2],
						'workoutModel.outAddress' : Ext.getCmp('outAddress').value,
						'workoutModel.reason' : reason
					},
					success : function(res) {
						if (res.responseText == 'true') {
							workoutStore.load();
							Ext.getCmp('workout_window').close();
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
			Ext.getCmp('workout_window').close();
		}
	}]
})
var workoutOperate = function(value) {
	var grid = Ext.getCmp('workout_grid');
	var selModel = grid.getSelectionModel();
	if (selModel.getSelection().length == 1) {
		var select = selModel.getSelection();
		if (value == '0') {
			Ext.create('workout_EditWindow', {
						title : '修改'
					}).show();
			Ext.getCmp('workoutID').setValue(select[0].data.id)
			Ext.getCmp('workoutDate').setValue(select[0].data);
			Ext.getCmp('reason').setValue(select[0].data.reason);
			Ext.getCmp('outAddress').setValue(select[0].data.outAddress);
		} else if (value == '-1') {
			Ext.Ajax.request({
						url : '../../../attendance/workout!delete',
						params : {
							'workoutModel.id' : select[0].data.id
						},
						success : function(res) {
							if (res.responseText == 'true') {
								workoutStore.load();
							}
						},
						failure : function(res) {
						}
					});
		} else {
			Ext.Ajax.request({
						url : '../../../attendance/workout!update',
						params : {
							'workoutModel.id' : select[0].data.id,
							'workoutModel.state' : value
						},
						success : function(res) {
							if (res.responseText == 'true') {
								workoutStore.load();
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
Ext.define('WorkoutApply', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.workoutApply',
	layout : 'fit',
	listeners : {
		afterrender : function() {
			workoutStore.load();
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
		id : 'workout_grid',
		store : workoutStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : workoutStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'add',
					text : '增加',
					handler : function() {
						Ext.create('workout_EditWindow', {
									title : '增加'
								}).show();
					}
				}, '-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : workout_refresh
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
							workoutStore.load({
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
					header : '出差地点',
					dataIndex : 'outAddress'
				}, {
					header : '操作',
					dataIndex : 'state',
					width : 50,
					sortable : true,
					renderer : function(v) {
						if (v == '1') {
						} else if (v == '2') {
							return "<a href='#' onclick='javascript:workoutOperate("
									+ 4 + ")'>申请归来</a>"
						} else if (v == '3') {
							return "<a href='#' onclick='javascript:workoutOperate("
									+ 0
									+ ")'>修改</a>/"
									+ "<a href='#' onclick='javascript:workoutOperate("
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
				workout_menu.removeAll();
				workout_menu.add({
							iconCls : 'add',
							text : '增加',
							handler : function() {
								Ext.create('workout_EditWindow', {
											title : '增加'
										}).show();
							}
						}, {
							iconCls : 'refresh',
							text : '刷新',
							handler : function() {
								workout_refresh()
							}
						});
				workout_menu.showAt(e.getXY());
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
				workout_menu.removeAll();
				if (record.data.state == '2') {
					workout_menu.add({
								iconCls : 'my_save',
								text : '申请归来',
								handler : function() {
									workoutOperate(4)
								}
							});
				} else if (record.data.state == '3') {
					workout_menu.add({
								iconCls : 'tabel_edit',
								text : '修改',
								handler : function() {
									workoutOperate(0)
								}
							}, {
								text : '删除',
								iconCls : 'delte0',
								handler : function() {
									workoutOperate(-1)
								}
							});
				}
				workout_menu.add({
							iconCls : 'add',
							text : '增加',
							handler : function() {
								Ext.create('workout_EditWindow', {
											title : '增加'
										}).show();
							}
						}, {
							iconCls : 'refresh',
							text : '刷新',
							handler : function() {
								workout_refresh()
							}
						});
				workout_menu.showAt(e.getXY());
			}
		}
	}]
});