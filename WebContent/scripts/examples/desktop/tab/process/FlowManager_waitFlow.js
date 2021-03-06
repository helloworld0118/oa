// model---waitFlow
Ext.define('waitFlow', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id'
					}, {
						name : 'applyDate'
					}, {
						name : 'title'
					}, {
						name : 'applyUser'
					}, {
						name : 'flowName'
					}]
		})
// 流程定义 store
var waitFlowStore = Ext.create('Ext.data.Store', {
			model : 'waitFlow',
			pageSize : 20,
			groupField: 'flowName',	
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../process/task!getAll'
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
var waitFlow_menu = Ext.create('Ext.menu.Menu', {
			margin : '0 0 10 0',
			items : [{
						iconCls : 'my_save',
						text : '执行',
						handler : function() {
							performFlow('waitFlow_grid')
						}
					}, {
						iconCls : 'refresh',
						text : '刷新',
						handler : function() {
							waitFlow_refresh()
						}
					}]
		});
// 执行流程
var performFlow = function(gridID) {
	var grid = Ext.getCmp(gridID);
	var selModel = grid.getSelectionModel();
	if (selModel.getSelection().length == 1) {
		var select = selModel.getSelection();
		Ext.create('Ext.window.Window', {
			border : false,
			modal : true,
			closable : true,
			title : '执行' + select[0].data.flowName,
			frame : true,
			width : 500,
			id : 'waitFlow_window',
			layout : 'fit',
			items : [{
				xtype : 'form',
				frame : true,
				autoScroll : true,
				id : 'wait_form',
				layout : 'anchor',
				padding : '0 10 0 10',
				listeners : {
					render : function(p) {
						p.getEl().on("contextmenu", function(e) {
									e.preventDefault();
								});
						var work = null;
						var commType=null;
						if (select[0].data.flowName.indexOf('请假') >= 0) {
							work = 'leave';
							commType=1;
						} else {
							work = 'expense';
							commType=2;
						}
						Ext.Ajax.request({
									url : '../../../process/task!toTask?taskId='
											+ select[0].data.id + '&commType='+commType,
									success : function(res) {
										var record = Ext
												.decode(res.responseText);
										Ext.getCmp('wait_form').getForm()
												.loadRecord(record);
										var commentSet = Ext
												.getCmp('his_comments');
										Ext.Array.each(record.data.comments,
												function(item) {
													commentSet.add({
																xtype : 'htmleditor',
																grow : true,
																margin : '5 0 0 10',
																labelWidth : 40,
																readOnly : true,
																value : item.comment,
																fieldLabel : item.name,
																anchor : '100%'
															})
												});

									},
									failure : function(res) {
									}
								});
						Ext.Ajax.request({
							url : '../../../process/task!getButtonsForTransition?taskId='
									+ select[0].data.id,
							success : function(res) {
								var record = Ext.decode(res.responseText);
								if (record.length > 1) {
									Ext.Array.each(record,
											function(name, index) {
												if (index == 0) {
													p.add({
														xtype : 'button',
														margin : '10 5 -25 170',
														text : name,
														handler : function(btn,
																e) {
															if (btn.text != '提交申请') {
																perFormFunction(
																		select,
																		btn,
																		work);
															} else if (work == 'leave') {
																leaveFormFunction(
																		select,
																		btn,
																		work)
															} else {
																expenseFormFunction(
																		select,
																		btn,
																		work)
															}
														}
													})
												} else {
													p.add({
																xtype : 'button',
																margin : '10 5 -25 10',
																text : name,
																handler : function(
																		btn, e) {
																	perFormFunction(
																			select,
																			btn,
																			work);
																}
															})
												}
											})

								} else {
									Ext.Array.each(record,
											function(name, index) {
												if (index == 0) {
													p.add({
														xtype : 'button',
														margin : '10 5 10 170',
														text : name,
														handler : function(btn,
																e) {
															if (btn.text != '提交申请') {
																perFormFunction(
																		select,
																		btn,
																		work);
															} else if (work == 'leave') {
																leaveFormFunction(
																		select,
																		btn,
																		work)
															} else {
																expenseFormFunction(
																		select,
																		btn,
																		work)
															}
														}
													})
												} else {
													p.add({
																xtype : 'button',
																margin : '10 5 10 10',
																text : name,
																handler : function(
																		btn, e) {
																	perFormFunction(
																			select,
																			btn,
																			work);
																}
															})
												}
											})

								}
							},
							failure : function(res) {
							}
						});
					}
				},
				items : [{
							xtype : 'hiddenfield',
							name : 'id'
						}, {
							xtype : 'textfield',
							name : 'applyName',
							id : 'applyName',
							fieldLabel : '申请人',
							labelWidth : 45,
							margin : '5 0 0 15',
							readOnly : true,
							anchor : '50%'
						}, {
							xtype : 'textfield',
							name : 'title',
							id : 'title',
							fieldLabel : '标题',
							labelWidth : 35,
							margin : '5 0 0 25',
							allowBlank : false,
							readOnly : true,
							anchor : '50%'
						}, {
							xtype : 'textfield',
							name : 'applyContent',
							id : 'applyContent',
							fieldLabel : '申请内容',
							labelWidth : 60,
							allowBlank : false,
							readOnly : true,
							anchor : '100%'
						}, {
							xtype : 'numberfield',
							margin : '5 0 0 5',
							name : 'expenseMoney',
							id : 'expenseMoney',
							fieldLabel : '金额(<span style="color:red">元</span>)',
							labelWidth : 55,
							minValue : 0,
							value : 0,
							hidden : true,
							allowBlank : false,
							anchor : '50%'
						}, {
							xtype : 'daterangefield',
							id : 'applyDate',
							margin : '5 0 0 25',
							labelWidth : 35,
							singleLine : false,
							hidden : true,
							fieldLabel : '时间'
						}, {
							xtype : 'htmleditor',
							grow : true,
							name : 'applyReason',
							labelWidth : 60,
							readOnly : true,
							enableAlignments : !this.readOnly,
							enableColors : !this.readOnly,
							enableFont : !this.readOnly,
							enableFormat : !this.readOnly,
							enableFontSize : !this.readOnly,
							enableLinks : !this.readOnly,
							enableLists : !this.readOnly,
							enableSourceEdit : !this.readOnly,
							id : 'applyReason',
							anchor : '100%',
							fieldLabel : '申请原因'
						}, {
							xtype : 'fieldset',
							columnWidth : 0.5,
							title : '历史批语',
							id : 'his_comments',
							maxHeight : 150,
							autoScroll : true,
							collapsible : true,
							collapsed : true,
							defaultType : 'htmleditor',
							defaults : {
								readOnly : true,
								enableAlignments : false,
								enableColors : false,
								enableFont : false,
								enableFormat : false,
								enableFontSize : false,
								enableLinks : false,
								enableLists : false,
								enableSourceEdit : false
							},
							anchor : '100%',
							layout : 'anchor',
							items : []
						}, {
							xtype : 'htmleditor',
							grow : true,
							name : 'comment',
							margin : '5 0 0 20',
							labelWidth : 40,
							fieldLabel : '批语',
							id : 'user_comment',
							anchor : '100%'
						}]
			}]
		}).show();
		if (select[0].data.applyUser == Ext.getCmp('current_user').text
				&& select[0].data.flowName == '请假流程') {
			Ext.getCmp('user_comment').setVisible(false);
			Ext.getCmp('applyReason').setVisible(true);
			Ext.getCmp('applyReason').setReadOnly(false);
			Ext.getCmp('title').setReadOnly(false);
			Ext.getCmp('applyContent').setVisible(false);
			var applyDate = Ext.getCmp('applyDate');
			applyDate.setVisible(true);
			Ext.Ajax.request({
						url : '../../../work/leave!getCurrentModelInfo',
						params : {
							taskId : select[0].data.id
						},
						success : function(res) {
							var record = Ext.decode(res.responseText);
							applyDate.setValue(record);
						}
					});

		} else if (select[0].data.applyUser == Ext.getCmp('current_user').text
				&& select[0].data.flowName == '报销流程') {
			Ext.getCmp('user_comment').setVisible(false);
			Ext.getCmp('applyReason').setVisible(true);
			Ext.getCmp('applyReason').setReadOnly(false);
			Ext.getCmp('title').setReadOnly(false);
			Ext.getCmp('applyContent').setVisible(false);
			Ext.getCmp('expenseMoney').setVisible(true);
			Ext.Ajax.request({
						url : '../../../work/expense!getCurrentModelInfo',
						params : {
							taskId : select[0].data.id
						},
						success : function(res) {
							Ext.getCmp('expenseMoney')
									.setValue(res.responseText);
						}
					});
		}
	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请选择一条数据！</span>");
	}
}
var leaveFormFunction = function(select, btn, work) {
	var form = Ext.getCmp('wait_form').getForm();
	if (form.isValid()) {
		var dates = Ext.getCmp('applyDate').getValue();
		var myFormat = 'Y-m-d H:i:s';
		if (dates[2]) {
			myFormat = 'Y-m-d';
		}
		Ext.Ajax.request({
					url : '../../../work/' + work
							+ '!updateModel2Perform.action',
					params : {
						taskId : select[0].data.id,
						'leaveModel.id' : '',
						'leaveModel.title' : Ext.getCmp('title').value,
						'leaveModel.beginTime' : Ext.Date.format(dates[0],
								myFormat),
						'leaveModel.endTime' : Ext.Date.format(dates[1],
								myFormat),
						'leaveModel.isAllDay' : dates[2],
						'leaveModel.reason' : Ext.getCmp('applyReason').value
					},
					success : function(res) {
						perFormFunction(select, btn, work);
					}
				});
	}
}
var expenseFormFunction = function(select, btn, work) {
	var form = Ext.getCmp('wait_form').getForm();
	if (form.isValid()) {
		Ext.Ajax.request({
					url : '../../../work/' + work
							+ '!updateModel2Perform.action',
					params : {
						taskId : select[0].data.id,
						'expenseModel.id' : '',
						'expenseModel.title' : Ext.getCmp('title').value,
						'expenseModel.expenseMoney' : Ext
								.getCmp('expenseMoney').value,
						'expenseModel.reason' : Ext.getCmp('applyReason').value
					},
					success : function(res) {
						perFormFunction(select, btn, work);
					}
				});
	}
}
var perFormFunction = function(select, btn, work) {
	var form = Ext.getCmp('wait_form').getForm();
	if (form.isValid()) {
		Ext.Ajax.request({
					url : '../../../work/' + work + '!performTask.action',
					params : {
						taskId : select[0].data.id,
						transition : btn.text,
						comment : Ext.getCmp('user_comment').value
					},
					success : function(res) {
						waitFlowStore.load();
						Ext.getCmp('waitFlow_window').close();

					}
				});
	}
}
// 刷新
var waitFlow_refresh = function() {
	waitFlowStore.load();
}
var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: '{name} ({rows.length}个)',
            hideGroupedHeader: true,
            startCollapsed: true,
            id: 'restaurantGrouping'
        });
// xtype
Ext.define('FlowManager_wait', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.flowManager_waitFlow',
	layout : 'fit',
	listeners : {
		afterrender : function() {
			waitFlowStore.load();
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
		id : 'waitFlow_grid',
		store : waitFlowStore,
		multiSelect : false,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : waitFlowStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'my_save',
					text : '执行',
					handler : function() {
						performFlow('waitFlow_grid')
					}

				}, '-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : waitFlow_refresh
				}, '-', '->', '-', {
					width : 200,
					fieldLabel : '搜索',
					labelWidth : 35,
					emptyText : '标题',
					xtype : 'searchfield',
					store : waitFlowStore
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
					header : '申请时间',
					dataIndex : 'applyDate'
				}, {
					header : '申请人',
					dataIndex : 'applyUser'
				}, {
					header : '流程名称',
					dataIndex : 'flowName'
				}],
		listeners : {
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
				waitFlow_menu.showAt(e.getXY());
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
				waitFlow_menu.showAt(e.getXY());
			},
			itemdblclick : function(view, record, item, index, e, eOpts) {
				performFlow('waitFlow_grid')
			}
		}
	}]
});
