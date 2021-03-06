// model
Ext.define('workCensus', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id'
					}, {
						name : 'userName'
					}, {
						name : 'departName'
					}, {
						name : 'workoutCount'
					}, {
						name : 'outCount'
					}, {
						name : 'workExtraCount'
					}, {
						name : 'leaveCount'
					}]
		});
var workCensusParams;
var paramsOther;
var workCensusStore = Ext.create('Ext.data.Store', {
			model : 'workCensus',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../attendance/workCensus!getAll'
				},
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'items',
					totalProperty : 'total'
				}
			}
		});
var workCensus_menu = Ext.create('Ext.menu.Menu', {
			margin : '0 0 10 0',
			items : [{
						iconCls : 'wb_excel',
						text : '导出Excel',
						handler : function() {
							export_excel();
						}
					}, {
						iconCls : 'refresh',
						text : '刷新',
						handler : function() {
							workCensus_refresh()
						}
					}]
		});
var export_excel = function() {
	Ext.Ajax.request({
				url : '../../../attendance/workCensus!exportExcel',
				params : workCensusParams,
				success : function(res) {
					location.href = '../../../attendance/workCensus?fileName='
							+ res.responseText;
				},
				failure : function(res) {
				}
			})
}
// 刷新
var workCensus_refresh = function() {
	if (workCensus) {
		workCensusStore.load({
					params : workCensusParams
				});
	}
}
// 请假store
var cuensusLeaveStore = Ext.create('Ext.data.Store', {
			model : 'leaveFlow',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				url : '../../../attendance/workCensus!getUserLeave',
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'items',
					totalProperty : 'total'
				}
			}
		});
// 出差store
var cuensusWorkoutStore = Ext.create('Ext.data.Store', {
			model : 'workout',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				url : '../../../attendance/workCensus!getUserworkout',
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'items',
					totalProperty : 'total'
				}
			}
		});
// 外出 store
var cuensusOutApplyStore = Ext.create('Ext.data.Store', {
			model : 'outApply',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				url : '../../../attendance/workCensus!getUseroutApply',
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'items',
					totalProperty : 'total'
				}
			}
		});
// 加班 store
var cuensusWorkExtraStore = Ext.create('Ext.data.Store', {
			model : 'workExtra',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				url : '../../../attendance/workCensus!getUserworkExtra',
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'items',
					totalProperty : 'total'
				}
			}
		});
// 显示详细信息
var workCensusDetail = function(record) {
	paramsOther = {
		userID : record.data.id,
		departName : workCensusParams.departName,
		endTime : workCensusParams.endTime,
		startTime : workCensusParams.startTime
	};
	Ext.create('Ext.window.Window', {
		title : "[" + record.data.userName + "]考勤详细信息",
		frame : true,
		id : 'censusDetail_window' + record.data.id,
		listeners : {
			render : function(p) {
				p.getEl().on("contextmenu", function(e) {
							e.preventDefault();
						})
			}
		},
		height : 500,
		width : 650,
		border : false,
		modal : true,
		closable : true,
		layout : 'fit',
		items : [{
			xtype : 'tabpanel',
			items : [{
				title : '请假登记',
				layout : 'fit',
				listeners : {
					afterrender : function() {
						cuensusLeaveStore.load({
									params : paramsOther
								});
					}
				},
				items : [{
					xtype : 'grid',
					forceFit : true,
					frame : true,
					id : 'censusLeaveDetail_grid' + record.data.id,
					store : cuensusLeaveStore,
					multiSelect : true,
					dockedItems : [{
						xtype : 'pagingtoolbar',
						store : cuensusLeaveStore,
						dock : 'bottom',
						displayInfo : true,
						displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
					}],
					tbar : ['-', {
								iconCls : 'refresh',
								text : '刷新',
								handler : function() {
									cuensusLeaveStore.load({
												params : paramsOther
											});
								}
							}, '-'],
					columns : [{
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
					}]
				}]
			}, {
				title : '外出登记',
				layout : 'fit',
				items : [{
					xtype : 'grid',
					forceFit : true,
					frame : true,
					listeners : {
						afterrender : function() {
							cuensusOutApplyStore.load({
										params : paramsOther
									});
						}
					},
					id : 'censusOutApplyDetail_grid' + record.data.id,
					store : cuensusOutApplyStore,
					multiSelect : true,
					dockedItems : [{
						xtype : 'pagingtoolbar',
						store : cuensusOutApplyStore,
						dock : 'bottom',
						displayInfo : true,
						displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
					}],
					tbar : ['-', {
								iconCls : 'refresh',
								text : '刷新',
								handler : function() {
									cuensusOutApplyStore.load({
												params : paramsOther
											});
								}
							}, '-'],
					columns : [{
								header : '开始时间',
								dataIndex : 'beginTime'
							}, {
								header : '结束时间',
								dataIndex : 'endTime'
							}, {
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
							}],
					plugins : [{
						ptype : 'rowexpander',
						rowBodyTpl : [
								"<p><b style='margin-left:0px;'>申请时间:</b> {applyDate}</p>",
								'<tpl if="reallyEndDate">',
								"<p><b style='margin-left:0px;'>实际归来时间:</b> {reallyEndDate}</p>",
								'</tpl>',
								"<b style='margin-left:5px;'>原因:</b> {reason}",
								'<tpl for="comments">',
								'<p style="margin-left:5px;"><b style="">{name}</b> <span style="color:green"> 批语：</span>{comment}',
								'</tpl>']
					}]
				}]
			}, {
				title : '出差登记',
				layout : 'fit',
				items : [{
					xtype : 'grid',
					forceFit : true,
					frame : true,
					listeners : {
						afterrender : function() {
							cuensusWorkoutStore.load({
										params : paramsOther
									});
						}
					},
					id : 'censusWorkoutDetail_grid' + record.data.id,
					store : cuensusWorkoutStore,
					multiSelect : true,
					dockedItems : [{
						xtype : 'pagingtoolbar',
						store : cuensusWorkoutStore,
						dock : 'bottom',
						displayInfo : true,
						displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
					}],
					tbar : ['-', {
								iconCls : 'refresh',
								text : '刷新',
								handler : function() {
									cuensusWorkoutStore.load({
												params : paramsOther
											});
								}
							}, '-'],
					columns : [{
								header : '开始时间',
								dataIndex : 'beginTime'
							}, {
								header : '结束时间',
								dataIndex : 'endTime'
							}, {
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
							}],
					plugins : [{
						ptype : 'rowexpander',
						rowBodyTpl : [
								"<p><b style='margin-left:0px;'>申请时间:</b> {applyDate}</p>",
								'<tpl if="reallyEndDate">',
								"<p><b style='margin-left:0px;'>实际归来时间:</b> {reallyEndDate}</p>",
								'</tpl>',
								"<b style='margin-left:5px;'>原因:</b> {reason}",
								'<tpl for="comments">',
								'<p style="margin-left:5px;"><b style="">{name}</b> <span style="color:green"> 批语：</span>{comment}',
								'</tpl>']
					}]
				}]
			}, {
				title : '加班登记',
				layout : 'fit',
				items : [{
					xtype : 'grid',
					forceFit : true,
					frame : true,
					listeners : {
						afterrender : function() {
							cuensusWorkExtraStore.load({
										params : paramsOther
									});
						}
					},
					id : 'censusWorkExtraDetail_grid' + record.data.id,
					store : cuensusWorkExtraStore,
					multiSelect : true,
					dockedItems : [{
						xtype : 'pagingtoolbar',
						store : cuensusWorkExtraStore,
						dock : 'bottom',
						displayInfo : true,
						displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
					}],
					tbar : ['-', {
								iconCls : 'refresh',
								text : '刷新',
								handler : function() {
									cuensusWorkExtraStore.load({
												params : paramsOther
											});
								}
							}, '-'],
					columns : [{
								header : '开始时间',
								dataIndex : 'beginTime'
							}, {
								header : '结束时间',
								dataIndex : 'endTime'
							}, {
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
							}],
					plugins : [{
						ptype : 'rowexpander',
						rowBodyTpl : [
								"<p><b style='margin-left:0px;'>申请时间:</b> {applyDate}</p>",
								'<tpl if="reallyEndDate">',
								"<p><b style='margin-left:0px;'>实际结束时间:</b> {reallyEndDate}</p>",
								'</tpl>',
								"<b style='margin-left:5px;'>原因:</b> {reason}",
								'<tpl for="comments">',
								'<p style="margin-left:5px;"><b style="">{name}</b> <span style="color:green"> 批语：</span>{comment}',
								'</tpl>']
					}]
				}]
			}]
		}]
	}).show();
};
// xtype
Ext.define('WorkCensus', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.workCensus',
	id : 'workCensus',
	layout : 'fit',
	listeners : {
		afterrender : function() {
			Ext.create('Ext.window.Window', {
				width : 320,
				id : 'workCensusInit_window',
				frame : true,
				title : '考勤统计',
				border : false,
				draggable : false,
				resizable : false,
				closable : false,
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
					id : 'workCensus_form',
					margin : '0 2 2 2',
					padding : '10 20 10 20',
					defaultType : 'textfield',
					frame : true,
					layout : 'anchor',
					items : [{
								xtype : 'combobox',
								fieldLabel : '部门',
								store : filter_departStore,
								name : 'departName',
								margin : '5 10 0 0',
								queryMode : 'remote',
								id : 'workCensus_departName',
								labelWidth : 65,
								displayField : 'text',
								valueField : 'id',
								anchor : '90%'
							}, {
								xtype : 'datefield',
								name : 'startTime',
								format : 'Y-m-d',
								id : 'workCensusStart',
								fieldLabel : '起始日期',
								labelWidth : 65,
								value : new Date(new Date().getFullYear(),
										new Date().getMonth(), 1),
								anchor : '90%',
								listeners : {
									'select' : {
										fn : function() {
											var startField = Ext
													.getCmp('workCensusStart');
											var start = Ext.Date.format(
													startField.value, 'Y-m-d');
											var endField = Ext
													.getCmp('workCensusEnd');
											var end = Ext.Date.format(
													endField.value, 'Y-m-d');
											if (start > end) {
												endField
														.setValue(startField.value);
											}
										},
										scope : this
									}
								}
							}, {
								xtype : 'datefield',
								id : 'workCensusEnd',
								name : 'endTime',
								format : 'Y-m-d',
								labelWidth : 65,
								fieldLabel : '截止日期',
								anchor : '90%',
								value : new Date(),
								listeners : {
									'select' : {
										fn : function() {
											var startField = Ext
													.getCmp('workCensusStart');
											var start = Ext.Date.format(
													startField.value, 'Y-m-d');
											var endField = Ext
													.getCmp('workCensusEnd');
											var end = Ext.Date.format(
													endField.value, 'Y-m-d');
											if (start > end) {
												startField
														.setValue(endField.value);
											}
										},
										scope : this
									}
								}
							}]
				}],
				buttons : [{
					text : '确定',
					handler : function() {
						var form = Ext.getCmp('workCensus_form').getForm();
						if (form.isValid()) {
							workCensusParams = {
								startTime : Ext.Date.format(
										Ext.getCmp('workCensusStart').value,
										'Y-m-d'),
								endTime : Ext.Date.format(Ext
												.getCmp('workCensusEnd').value,
										'Y-m-d'),
								departName : Ext
										.getCmp('workCensus_departName').value
							};
							workCensusStore.load({
								params : {
									startTime : Ext.Date
											.format(
													Ext
															.getCmp('workCensusStart').value,
													'Y-m-d'),
									endTime : Ext.Date.format(
											Ext.getCmp('workCensusEnd').value,
											'Y-m-d'),
									departName : Ext
											.getCmp('workCensus_departName').value
								}
							})
							Ext.getCmp('workCensusInit_window').close();
						}
					}
				}, {
					text : '取消',
					handler : function() {
						Ext.getCmp('workCensusInit_window').close();
						Ext.getCmp('MainTab').remove(Ext.getCmp('workCensus'));
					}
				}]
			}).show();
		},
		render : function(p) {
			workCensusStore.removeAll();
			p.getEl().on("contextmenu", function(e) {
						e.preventDefault();
					})
		}
	},
	items : [{
		xtype : 'grid',
		forceFit : true,
		frame : true,
		id : 'workCensus_grid',
		store : workCensusStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : workCensusStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : workCensus_refresh
				}, '-', {
					iconCls : 'wb_excel',
					text : '导出Excel',
					handler : function() {
						export_excel();
					}
				}, '-', '->', '-', {
					width : 200,
					fieldLabel : '搜索',
					labelWidth : 35,
					emptyText : '姓名',
					xtype : 'searchfield',
					store : workCensusStore,
					onTrigger1Click : function() {
						var me = this;

						if (me.hasSearch) {
							me.setValue('');
							workCensusStore.load({
										params : {
											endTime : workCensusParams.endTime,
											startTime : workCensusParams.startTime,
											departName : workCensusParams.departName
										}
									});
							me.hasSearch = false;
							me.triggerCell.item(0).setDisplayed(false);
							me.updateLayout();
						}
					},
					onTrigger2Click : function() {
						var me = this, value = me.getValue();
						if (value.length > 0) {
							workCensusStore.load({
										params : {
											endTime : workCensusParams.endTime,
											startTime : workCensusParams.startTime,
											departName : workCensusParams.departName,
											query : value
										}
									})
							me.hasSearch = true;
							me.triggerCell.item(0).setDisplayed(true);
							me.updateLayout();
						}
					}
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
					header : '部门',
					dataIndex : 'departName'
				}, {
					header : '姓名',
					dataIndex : 'userName'
				}, {
					header : '请假(次)',
					dataIndex : 'leaveCount'
				}, {
					header : '外出(次)',
					dataIndex : 'outCount'
				}, {
					header : '出差(次)',
					dataIndex : 'workoutCount'
				}, {
					header : '加班(次)',
					dataIndex : 'workExtraCount'
				}],
		listeners : {
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
				workCensus_menu.showAt(e.getXY());
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
				workCensus_menu.showAt(e.getXY());
			},
			itemdblclick : function(view, record, item, index, e, eOpts) {
				workCensusDetail(record);
			}
		}
	}]
});