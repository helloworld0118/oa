Ext.define('TaskInfo', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id'
					}, {
						name : 'arrangeUser'
					}, {
						name : 'responsibleUser'
					}, {
						name : 'examineUser'
					}, {
						name : 'title'
					}, {
						name : 'predictHours'
					}, {
						name : 'arrangeTime'
					}, {
						name : 'beginTime'
					}, {
						name : 'overTime'
					}, {
						name : 'startTime'
					}, {
						name : 'endTime'
					}, {
						name : 'isExamine'
					}, {
						name : 'content'
					}, {
						name : 'rewardOrpenaltie'
					}, {
						name : 'leadAdvice'
					}, {
						name : 'state'
					}, {
						name : 'score'
					}, {
						name : 'rate'
					}, {
						name : 'isUrge'
					}, {
						name : 'isAllDay'
					}, {
						name : 'urgeContent'
					}, {
						name : 'partakeUsers'
					}, {
						name : 'taskAttchments'
					}]
		});
Ext.define('TaskEvent', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id'
					}, {
						name : 'content'
					}, {
						name : 'operateUser'
					}, {
						name : 'time'
					}, {
						name : 'type'
					}, {
						name : 'taskInfo'
					}]
		});
var taskEventStore = Ext.create('Ext.data.Store', {
			model : 'TaskEvent',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				url : '../../../task/taskEvent!getAllByTask',
				reader : {
					type : 'json',
					root : 'items',
					totalProperty : 'total'
				}
			}
		});
var taskListStore = Ext.create('Ext.data.Store', {
			model : 'TaskInfo',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				url : '../../../task/taskInfo!getTaskList',
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'items',
					totalProperty : 'total'
				}
			}
		})
// 主窗口 -列表页
Ext.define('Task_list', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.task_list',
	layout : 'fit',
	autoScroll : true,
	items : [{
		xtype : 'grid',
		forceFit : true,
		frame : true,
		id : 'task_list_grid',
		store : taskListStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : taskListStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'add',
					text : '布置任务',
					handler : function() {
						var tabpanel = Ext.getCmp('MainTab');
						tabpanel.remove(Ext.getCmp('task_arrange'));
						var tab = tabpanel.add({
									title : '布置任务',
									iconCls : 'wb_task_list',
									id : 'task_arrange',
									xtype : 'task_arrange',
									closable : true
								});
						tabpanel.setActiveTab(tab);
					}
				}, '-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : function() {
						taskListStore.load();
					}
				}, '-', '->', '-', {
					width : 200,
					fieldLabel : '搜索',
					labelWidth : 35,
					emptyText : '标题',
					xtype : 'searchfield',
					store : taskListStore
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
					header : '任务标题',
					dataIndex : 'title',
					width : 130
				}, {
					header : '状态',
					dataIndex : 'state'
				}, {
					header : '负责人',
					dataIndex : 'responsibleUser'
				}, {
					header : '布置人',
					dataIndex : 'arrangeUser'
				}, {
					header : '开始时间',
					dataIndex : 'arrangeTime'
				}, {
					header : '结束时间',
					dataIndex : 'overTime'
				}],
		listeners : {
			afterrender : function() {
				taskListStore.load();
			},
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
			},
			itemdblclick : function(view, record, item, index, e, eOpts) {
				taskShowDetail(record);
			}
		}
	}]
});
// 显示任务的详细
var taskShowDetail = function(record) {
	var tabpanel = Ext.getCmp('MainTab');
	if (record.data.isUrge) {
		Ext.Ajax.request({
					url : '../../../task/taskInfo!update',
					params : {
						'taskInfo.id' : record.data.id,
						'taskInfo.isUrge' : false
					},
					success : function(res) {
						taskListStore.load();
					},
					failure : function(res) {
					}
				})

	}
	tabpanel.remove(Ext.getCmp('showTaskDetail_panel'));
	var taskShow = tabpanel.getComponent('showTaskDetail_panel');
	tabpanel.autoScroll = false;
	if (!taskShow) {
		taskShow = tabpanel.add({
			title : '查看任务',
			closable : true,
			autoScroll : true,
			id : 'showTaskDetail_panel',
			tbar : ['-', {
						text : '返回任务列表',
						iconCls : 'wb_task_list',
						handler : function() {
							var tabpanel = Ext.getCmp('MainTab');
							var tab = tabpanel.getComponent(Ext
									.getCmp('task_list'));
							if (!tab) {
								tab = tabpanel.add({
											title : '任务列表',
											iconCls : 'wb_task_list',
											id : 'task_list',
											xtype : 'task_list',
											closable : true
										});
							}
							tabpanel.setActiveTab(tab);
						}
					}, '-', {
						text : '关闭',
						iconCls : 'wb_tab_close',
						handler : function() {
							var tabpanel = Ext.getCmp('MainTab');
							tabpanel.remove(Ext.getCmp('showTaskDetail_panel'));
						}
					}, '-', '->', '-', {
						xtype : 'splitbutton',
						text : '',
						iconCls : 'email',
						menu : [{
									text : '图文帮助'
								}, {
									text : '视频帮助'
								}]
					}, '-'],
			items : [{
				xtype : 'panel',
				border : false,
				listeners : {
					afterrender : function(panel) {
						var title = record.data.title;
						if (title.indexOf('<') > 0) {
							record.data.title = title.substr(0, title
											.indexOf('<'));
						}
						tpl = Ext
								.create(
										'Ext.Template',
										'<p style="font-size:25px;text-align:center;background-color:#FFFFCC;">[任务]: {title}</p>');
						tpl.overwrite(panel.body, record.data);
						panel.doComponentLayout();
						record.data.title = title;
					}
				}
			}, {
				xtype : 'tabpanel',
				frame : true,
				items : [{
					title : '基本信息',
					padding : '5 0 0 10',
					frame:true,
					items : [{
						xtype : 'fieldset',
						title : '任务操作区',
						hidden : true,
						frame:true,
						defaults : {
							margin : '0 0 0 10'
						},
						listeners : {
							render : function(p) {
								Ext.Ajax.request({
									url : '../../../task/taskInfo!isCurrentUser',
									params : {
										taskArrangeUser : record.data.arrangeUser,
										taskResponsibleUserUser : record.data.responsibleUser,
										taskExamineUser : record.data.examineUser
									},
									success : function(res) {
										if (res.responseText == 1
												|| res.responseText == 4
												|| res.responseText == 5
												|| res.responseText == 7) {
											if (record.data.state
													.indexOf('id="1"') >= 0
													&& record.data.title
															.indexOf('b') > 0) {
												p.setVisible(true);
												p.add({
													xtype : 'button',
													text : '接收任务',
													handler : function() {
														var date = Ext.Date
																.format(
																		new Date(),
																		'Y-m-d G:i:s');
														var param = {
															'taskInfo.id' : record.data.id,
															'taskInfo.state' : 2,
															'taskInfo.rate' : 0,
															'taskInfo.startTime' : date
														};
														record.data.state = "<span id=\"2\" style=\"color:#3399CC\">进行中</span>(<span style=\"color:red\">0%</span>)";
														record.data.rate = 0;
														record.data.startTime = date;
														taskUpdataOperate(
																param, record)
														addTaskEvent(record,
																'接收任务', 9);
													}
												}, {
													xtype : 'button',
													text : '拒绝接收',
													handler : function() {

														showScoreOrRateWindow(
																'拒绝接收', '',
																true, '拒绝理由',
																record);
													}
												});
											} else if (record.data.state
													.indexOf('id="2"') >= 0
													&& record.data.title
															.indexOf('b') > 0) {
												p.setVisible(true);
												p.add({
													xtype : 'button',
													text : '汇报进度',
													handler : function() {
														showScoreOrRateWindow(
																'汇报进度',
																'任务进度<span style="color:red">(%)</span>',
																false, '进度说明',
																record);

													}
												}, {
													xtype : 'button',
													text : '完成任务',
													handler : function() {
														showScoreOrRateWindow(
																'完成任务', '不显示)',
																true, '任务总结',
																record);
													}
												})
											}
										}
										if (res.responseText == 3
												|| res.responseText == 5
												|| res.responseText == 6
												|| res.responseText == 7)
											if (record.data.state
													.indexOf('id="7"') >= 0
													&& record.data.title
															.indexOf('b') > 0) {
												p.setVisible(true);
												p.add({
															xtype : 'button',
															text : '同意进行',
															handler : function() {
																showScoreOrRateWindow(
																		'同意进行',
																		'不显示)',
																		true,
																		'意见建议',
																		record);
															}
														}, {
															xtype : 'button',
															text : '不同意进行',
															handler : function() {
																showScoreOrRateWindow(
																		'不同意进行',
																		'不显示)',
																		true,
																		'不同意理由',
																		record);
															}
														})
											}
										if (res.responseText == 2
												|| res.responseText == 4
												|| res.responseText == 6
												|| res.responseText == 7) {
											if (record.data.state
													.indexOf('id="3"') >= 0
													|| record.data.state
															.indexOf('id="8"') >= 0
													&& record.data.title
															.indexOf('b') > 0) {
												p.setVisible(true);
												p.add({
													xtype : 'button',
													text : '修改',
													handler : function() {
														var tabpanel = Ext
																.getCmp('MainTab');
														tabpanel
																.remove(Ext
																		.getCmp('task_arrange_edit'));
														isExamine = record.data.isExamine;
														var tab = tabpanel.add(
																{
																	title : '修改任务',
																	iconCls : 'wb_task_list',
																	id : 'task_arrange_edit',
																	xtype : 'task_arrange_edit',
																	closable : true
																});
														var title = record.data.title;
														if (title.indexOf('<') > 0) {
															record.data.title = title
																	.substr(
																			0,
																			title
																					.indexOf('<'));
														}
														Ext
																.getCmp('task_arrange_form_edit')
																.loadRecord(record);
														var dates = [];
														dates
																.push(record.data.beginTime);
														dates
																.push(record.data.overTime);
														dates
																.push(record.data.isAllDay);
														addTaskEvent(record,
																'修改任务', 10);
														Ext
																.getCmp('task_date_edit')
																.setValue(dates);
														tabpanel
																.setActiveTab(tab);
													}
												}, {
													xtype : 'button',
													text : '删除',
													handler : function() {
														Ext.Ajax.request({
															url : '../../../task/taskInfo!delete',
															params : {
																'taskInfo.id' : record.data.id
															},
															success : function(
																	res) {
																var tabpanel = Ext
																		.getCmp('MainTab');
																tabpanel
																		.remove(Ext
																				.getCmp('showTaskDetail_panel'));
																taskListStore
																		.load();
															},
															failure : function(
																	res) {
															}
														})
													}
												})
											} else if (record.data.state
													.indexOf('id="4"') >= 0
													&& record.data.title
															.indexOf('b') > 0) {
												p.setVisible(true);
												p.add({
													xtype : 'button',
													text : '同意任务完成',
													handler : function() {
														showScoreOrRateWindow(
																'同意任务完成',
																'任务评分', false,
																'任务意见', record);
													}
												}, {
													xtype : 'button',
													text : '不同意完成',
													handler : function() {
														showScoreOrRateWindow(
																'不同意完成',
																'不显示)', true,
																'不同意理由', record);
													}
												})
											} else if (record.data.state
													.indexOf('id="4"') >= 0) {
												p.setVisible(true);
												p.add({
															xtype : 'button',
															text : '撤消任务',
															handler : function() {
																showScoreOrRateWindow(
																		'撤消任务',
																		'',
																		true,
																		'撤消原因',
																		record);
															}
														})
											} else if (record.data.state
													.indexOf('id="2"') >= 0) {
												p.setVisible(true);
												p.add({
															xtype : 'button',
															text : '督办任务',
															handler : function() {
																showScoreOrRateWindow(
																		'督办任务',
																		'',
																		true,
																		'督办内容',
																		record);
															}
														}, {
															xtype : 'button',
															text : '任务延期',
															handler : function() {
																updateOverTime(record);
															}
														}, {
															xtype : 'button',
															text : '撤消任务',
															handler : function() {
																showScoreOrRateWindow(
																		'撤消任务',
																		'',
																		true,
																		'撤消原因',
																		record);
															}
														})
											}
										}
									},
									failure : function() {
									}
								});
							}
						}
					}, {
						xtype : 'panel',
						// title : '基本信息',
						layout : 'fit',
						height : 420,
						listeners : {
							afterrender : function(panel) {
								tpl = Ext
										.create(
												'Ext.Template',
												'<table border="0" width="100%" height="100%">'
														+ '<tr><td  colspan="3";  style="font-size:18;font-weight:bold; background-color:#c3daf9; text-align:left;">基本信息</td></tr>'
														+ '<tr style="background-color:#DEE9F8"><td>当前状态:{state}</td><td>任务布置时间:{arrangeTime}</td><td></td></tr>'
														+ '<tr style="background-color:#DEE9F8"><td>布置开始时间:{beginTime}</td><td>任务结束时间:{overTime}</td><td>任务评分:{score}</td></tr>'
														+ '<tr style="background-color:#DEE9F8"><td>实际开始时间:{startTime}</td><td>实际结束时间:{endTime}</td><td>任务进度:{rate}</td></tr>'
														+ '<tr style="background-color:#DEE9F8"><td>布置人:{arrangeUser}</td><td>负责人:{responsibleUser}</td><td>审批人:{examineUser}</td></tr>'
														+ '<tr style="background-color:#DEE9F8"><td>参与人:{partakeUsers}</td><td>评估工时:{predictHours}</td><td></td></tr>'
														+ '<tr><td  colspan="3";  style="font-size:18;font-weight:bold; background-color:#c3daf9; text-align:left;">任务内容</td></tr>'
														+ '<tr style="background-color:#DEE9F8"><td colspan="3";>---->{content}</td></tr>'
														+ '<tr><td  colspan="3";  style="font-size:18;font-weight:bold; background-color:#c3daf9; text-align:left;">奖罚标准</td></tr>'
														+ '<tr style="background-color:#DEE9F8"><td colspan="3"; >---->{rewardOrpenaltie}</td></tr>'
														+ '<tr><td  colspan="3";  style="font-size:18;font-weight:bold; background-color:#c3daf9; text-align:left;">领导批示</td></tr>'
														+ '<tr style="background-color:#DEE9F8"><td  colspan="3"; style="margin-top:20px;" >---->{leadAdvice}</td></tr>'
														+ '</table>');
								tpl.overwrite(panel.body, record.data);
								panel.doComponentLayout();
							}
						}
					}]
				}, {
					title : '任务事件',
					layout : 'fit',
					height : 430,
					items : [{
						xtype : 'grid',
						forceFit : true,
						frame : true,
						id : 'expenseFlow_grid',
						store : taskEventStore,
						multiSelect : true,
						dockedItems : [{
							xtype : 'pagingtoolbar',
							store : taskEventStore,
							dock : 'bottom',
							displayInfo : true,
							displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
						}],
						listeners : {
							afterrender : function() {
								taskEventStore.clearFilter(true);
								taskEventStore.filter('taskInfo',
										record.data.id);
								taskEventStore.load()
							}
						},
						columns : [{
							header : '类型',
							dataIndex : 'type',
							renderer : function(v) {
								if (v == 1) {
									return "<span style='background:red;color:#FFFFFF'>布置</span>";
								} else if (v == 2) {
									return "<span style='background:#FFCC00;color:#FFFFFF'>审批</span>";
								} else if (v == 3) {
									return "<span style='background:#FF3300;color:#FFFFFF'>汇报</span>";
								} else if (v == 4) {
									return "<span style='background:#660000;color:#FFFFFF'>完成</span>";
								} else if (v == 5) {
									return "<span style='background:#666600;color:#FFFFFF'>审核</span>";
								} else if (v == 6) {
									return "<span style='background:#66CC00;color:#FFFFFF'>撤消</span>";
								} else if (v == 7) {
									return "<span style='background:#66FF00;color:#FFFFFF'>督办</span>";
								} else if (v == 8) {
									return "<span style='background:#339900;color:#FFFFFF'>拒绝</span>";
								} else if (v == 9) {
									return "<span style='background:#333300;color:#FFFFFF'>接收</span>";
								} else if (v == 10) {
									return "<span style='background:#330000;color:#FFFFFF'>修改</span>";
								} else if (v == 11) {
									return "<span style='background:#0000FF;color:#FFFFFF'>延期</span>";
								}
							}
						}, {
							header : '操作者',
							dataIndex : 'operateUser'
						}, {
							header : '操作内容',
							dataIndex : 'content'
						}, {
							header : '操作时间',
							dataIndex : 'time'
						}]
					}]
				}]
			}],
			listeners : {
				render : function(p) {
					p.getEl().on("contextmenu", function(e) {
								e.preventDefault();
							})
				}

			}

		});
	}
	tabpanel.setActiveTab(taskShow);
}
var addTaskEvent = function(record, content, type) {
	Ext.Ajax.request({
				url : '../../../task/taskEvent!addEvent',
				params : {
					'taskID' : record.data.id,
					'taskEvent.content' : content,
					'taskEvent.type' : type
				},
				success : function(res) {
					taskListStore.load();
				},
				failure : function(res) {
				}
			})
}
var updateOverTime = function(record) {
	var minDateStr = record.data.overTime;
	var minDate = new Date(minDateStr.substr(0, 10));
	Ext.create('Ext.window.Window', {
		title : '任务延期',
		frame : true,
		border : false,
		draggable : true,
		closable : true,
		modal : true,
		resizable : false,
		layout : 'fit',
		items : [{
			xtype : 'form',
			frame : true,
			items : [{
						xtype : 'textfield',
						fieldLabel : '原结束时间',
						value : record.data.overTime
					}, {
						xtype : 'datefield',
						fieldLabel : '修改为',
						id : 'task_dateOverTime_update',
						format : 'Y-m-d',
						columnWidth : .5,
						minValue : minDate
					}, {
						xtype : 'timefield',
						hideLabel : true,
						margin : '0 0 0 105',
						id : 'task_timeOverTime_update',
						format : 'G:i'
					}],
			buttons : [{
				text : '确定',
				handler : function() {
					var params = {
						'taskInfo.id' : record.data.id,
						'taskInfo.overTime' : Ext.Date.format(
								Ext.getCmp('task_dateOverTime_update').value,
								'Y-m-d')
								+ ' '
								+ Ext.Date
										.format(
												Ext
														.getCmp('task_timeOverTime_update').value,
												'G:i:s')
					};
					var time = Ext.Date.format(Ext
									.getCmp('task_dateOverTime_update').value,
							'Y-m-d')
							+ ' '
							+ Ext.Date
									.format(
											Ext
													.getCmp('task_timeOverTime_update').value,
											'G:i:s');
					record.data.overTime = time;
					taskUpdataOperate(params, record);
					addTaskEvent(record, '延期', 11);
					this.ownerCt.ownerCt.ownerCt.close();
				}
			}, {
				text : '取消',
				handler : function() {
					this.ownerCt.ownerCt.ownerCt.close();
				}
			}]
		}],
		listeners : {
			render : function(p) {
				p.getEl().on("contextmenu", function(e) {
							e.preventDefault();
						})
			}
		}
	}).show();

}
var showScoreOrRateWindow = function(title, scoreOrRate, show, desc, record) {
	Ext.create('Ext.window.Window', {
		title : title,
		frame : true,
		border : false,
		draggable : true,
		closable : true,
		modal : true,
		width:550,
		resizable : false,
		layout : 'fit',
		listeners : {
			render : function(p) {
				p.getEl().on("contextmenu", function(e) {
							e.preventDefault();
						})
			}
		},
		items : [{
			xtype : 'form',
			id : 'scoreOrRate_form',
			layout : 'anchor',
			frame : true,
			defaults : {
				anchor : '100%'
			},
			margin : '0 2 2 2',
			items : [{
						xtype : 'numberfield',
						labelWidth : 80,
						fieldLabel : scoreOrRate,
						afterLabelTextTpl : required,
						hidden : show,
						allowBlank : show,
						name : 'num',
						anchor : '50%',
						margin : '0 0 0 5',
						emptyText : '0-100',
						maxValue : 100,
						minValue : 0
					}, {
						xtype : 'htmleditor',
						grow : true,
						name : 'content',
						margin : '0 0 0 5',
						labelWidth : 80,
						height:200,
						fieldLabel : desc
					}],
			buttons : [{
				text : '确定',
				handler : function() {
					var form = Ext.getCmp('scoreOrRate_form').getForm()
					var params = {}
					var values = [form.getFieldValues().num,
							form.getFieldValues().content];
					if (form.isValid()) {
						if (show && title.indexOf('完成任务') >= 0) {
							var date = Ext.Date.format(new Date(),
									'Y-m-d G:i:s');
							params = {
								'taskInfo.id' : record.data.id,
								'taskInfo.state' : 4,
								'taskInfo.rate' : 100,
								'taskInfo.endTime' : date
							}
							record.data.rate = 100 + '%';
							record.data.endTime = date;
							record.data.state = "<span  id=\"4\" style=\"color:#3333FF\">提交审核</span>";
							addTaskEvent(record, '完成任务<br/>' + values[1], 4);
						} else if (show && title.indexOf('拒绝接收') >= 0) {
							var param = {
								'taskInfo.id' : record.data.id,
								'taskInfo.state' : 3
							};
							record.data.state = "<span id=\"3\" style=\"color:red\">拒绝接收</span>";
							taskUpdataOperate(param, record)
							addTaskEvent(record, '拒绝接收任务', 8);
						} else if (show && title.indexOf('不同意完成') >= 0) {
							params = {
								'taskInfo.id' : record.data.id,
								'taskInfo.state' : 2
							}
							record.data.state = '<span id="2" style="color:#3399CC">进行中</span>(<span style="color:red">'
									+ record.data.rate + '</span>)';
							addTaskEvent(record, '审核---不同意完成<br/>' + values[1],
									5);
						} else if (show && title.indexOf('撤消') >= 0) {
							params = {
								'taskInfo.id' : record.data.id,
								'taskInfo.state' : 6
							}
							record.data.state = "<span  id=\"6\" style=\"color:#999999\">任务撤消</span>";
							addTaskEvent(record, '撤消<br/>' + values[1], 6);
						} else if (show && title.indexOf('督办') >= 0) {
							params = {
								'taskInfo.id' : record.data.id,
								'taskInfo.isUrge' : true
							}
							addTaskEvent(record, '督办<br/>' + values[1], 7);
						} else if (show && title.indexOf('不同意进行') >= 0) {
							params = {
								'taskInfo.id' : record.data.id,
								'taskInfo.state' : 8
							}
							record.data.state = "<span  id=\"8\" style=\"color:red\">审批不通过</span>";
							addTaskEvent(record, '审批---不通过<br/>' + values[1], 2);
						} else if (show && title.indexOf('同意进行') >= 0) {
							params = {
								'taskInfo.id' : record.data.id,
								'taskInfo.state' : 1
							}
							record.data.state = "<span id=\"1\" style=\"color:#66CC00\">等待接收</span>";
							addTaskEvent(record, '审批---通过', 2);
						} else if (title.indexOf('进度') >= 0) {
							params = {
								'taskInfo.id' : record.data.id,
								'taskInfo.rate' : values[0]
							}
							record.data.rate = values[0] + '%';
							record.data.state = '<span id="2" style="color:#3399CC">进行中</span>(<span style="color:red">'
									+ values[0] + '%</span>)';
							addTaskEvent(record, '汇报进度(' + values[0]
											+ '%)<br/>' + values[1], 3);
						} else if (title.indexOf('同意任务完成') >= 0) {
							params = {
								'taskInfo.id' : record.data.id,
								'taskInfo.score' : values[0],
								'taskInfo.state' : 5
							}
							record.data.score = values[0];
							record.data.state = "任务完成(<span  id=\"5\" style=\"color:red\">"
									+ values[0] + "分</span>)"
							addTaskEvent(record, '审核---同意完成<br/>' + values[1],
									5);
						}
						taskUpdataOperate(params, record);
						this.ownerCt.ownerCt.ownerCt.close();
					}

				}
			}, {
				text : '重置',
				handler : function() {
					Ext.getCmp('scoreOrRate_form').getForm().reset();
				}
			}, {
				text : '取消',
				handler : function() {
					this.ownerCt.ownerCt.ownerCt.close();
				}
			}]
		}]
	}).show();
}
var taskUpdataOperate = function(params, record) {
	Ext.Ajax.request({
				url : '../../../task/taskInfo!update',
				params : params,
				success : function(res) {
					var tabpanel = Ext.getCmp('MainTab');
					tabpanel.remove(Ext.getCmp('showTaskDetail_panel'));
					taskShowDetail(record);
					taskListStore.load();
				},
				failure : function(res) {
					Ext.Msg.alert('提示',
							"<span style='color:red'>操作失败，请联系管理员！</span>");
				}
			})

}
var isExamine = false;
Ext.define('Task_arrange_edit', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.task_arrange_edit',
	layout : 'fit',
	id : 'task_arrange_edit',
	items : [{
		xtype : 'form',
		border : false,
		id : 'task_arrange_form_edit',
		layout : 'anchor',
		defaults : {
			anchor : '100%',
			msgTarget : 'side'
		},
		padding : '20 20 20 20',
		items : [{
			xtype : 'fieldset',
			title : '基本信息',
			layout : 'anchor',
			defaultType : 'textfield',
			defaults : {
				anchor : '60%'
			},
			items : [{
				xtype : 'fieldset',
				layout : 'column',
				border : false,
				defaults : {
					columnWidth : 1,
					margin : '10 0 0 10'
				},
				defaultType : 'textfield',
				items : [{
							xtype : 'hidden',
							id : 'taskInfo_hiddenId',
							name : 'id'
						}, {
							fieldLabel : '任务标题',
							name : 'title',
							labelWidth : 60,
							allowBlank : false,
							columnWidth : .61,
							name : 'title',
							afterLabelTextTpl : required
						}, {
							xtype : 'numberfield',
							labelWidth : 60,
							name : 'predictHours',
							columnWidth : .51,
							fieldLabel : '估计工时',
							value : 0,
							minValue : 0
						}, {
							xtype : 'daterangefield',
							id : 'task_date_edit',
							afterLabelTextTpl : required,
							labelWidth : 60,
							singleLine : false,
							columnWidth : 1,
							fieldLabel : '任务周期'
						}, {
							fieldLabel : '审批人',
							readOnly : true,
							name : 'examineUser',
							id : 'task_edit_examineUser',
							labelWidth : 60,
							columnWidth : .5
						}, {
							xtype : 'button',
							text : '选择',
							columnWidth : .1,
							disabled : true,
							handler : function() {
								showUserInfoTree('审批人', taskUserTreeStore1,
										this.previousSibling(), false);
							}
						}, {
							xtype : 'checkbox',
							columnWidth : .2,
							boxLabel : '需要审批人审批',
							name : 'isExamine',
							id : 'task_edit_isExamine',
							listeners : {}
						}, {
							fieldLabel : '负责人',
							name : 'responsibleUser',
							columnWidth : .5,
							allowBlank : false,
							readOnly : true,
							afterLabelTextTpl : required,
							labelWidth : 60
						}, {
							xtype : 'button',
							columnWidth : .1,
							text : '选择',
							handler : function() {
								showUserInfoTree('负责人', taskUserTreeStore1,
										this.previousSibling(), false);
							}
						}, {
							xtype : 'textarea',
							fieldLabel : '参与人',
							name : 'partakeUsers',
							readOnly : true,
							columnWidth : .9,
							labelWidth : 60
						}, {
							xtype : 'button',
							columnWidth : .1,
							text : '选择',
							handler : function() {
								showUserInfoTree('参与人', taskUserTreeStore2,
										this.previousSibling(), true);
							}
						}, {
							xtype : 'textarea',
							fieldLabel : '任务内容',
							name : 'content',
							labelWidth : 60
						}, {
							xtype : 'textarea',
							fieldLabel : '奖罚标准',
							name : 'rewardOrpenaltie',
							labelWidth : 60
						}, {
							xtype : 'textarea',
							fieldLabel : '领导批示',
							name : 'leadAdvice',
							labelWidth : 60
						}]

			}]
		}],
		listeners : {
			render : function(p) {
				p.getEl().on("contextmenu", function(e) {
							e.preventDefault();
						})
			}
		}
	}],
	tbar : ['-', {
				text : '返回任务列表'
			}, '-', {
				text : '保存',
				handler : function() {
					var form = Ext.getCmp('task_arrange_form_edit').getForm();
					if (form.isValid()) {
						var dates = Ext.getCmp('task_date_edit').getValue();
						var myFormat = 'Y-m-d G:i:s';
						if (dates[2]) {
							myFormat = 'Y-m-d';
						}
						form.submit({
							url : '../../../task/taskInfo!updateAll',
							params : {
								'taskInfo.id' : Ext.getCmp('taskInfo_hiddenId').value,
								'beginTime' : Ext.Date.format(dates[0],
										myFormat),
								'endTime' : Ext.Date.format(dates[1], myFormat),
								'isAllDay' : dates[2]
							},
							success : function(form, action) {
								form.reset();
								Ext.Msg.alert('提示', '操作成功!');
								var tabpanel = Ext.getCmp('MainTab');
								taskListStore.load();
								tabpanel
										.remove(Ext.getCmp('task_arrange_edit'));
								tabpanel.remove(Ext
										.getCmp('showTaskDetail_panel'));
							},
							failure : function(form, action) {
								form.reset();
								Ext.Msg
										.alert('提示',
												"<span style='color:red'>操作失败，请联系管理员！</span>");
							}
						})
					}
				}
			}, '-', {
				text : '关闭',
				handler : function() {
					var tabpanel = Ext.getCmp('MainTab');
					tabpanel.remove(Ext.getCmp('task_arrange_edit'));
				}
			}, '-', '->', '-', {
				xtype : 'splitbutton',
				text : '',
				iconCls : 'help',
				menu : [{
							text : '图文帮助'
						}, {
							text : '视频帮助'
						}]
			}],
	listeners : {
		render : function(p) {
			p.getEl().on("contextmenu", function(e) {
						e.preventDefault();
					})
		},
		afterrender : function() {
			if (isExamine) {
				Ext.getCmp('task_edit_examineUser').allowBlank = false;
				Ext.getCmp('task_edit_isExamine').previousSibling()
						.setDisabled(false);
				Ext.getCmp('task_edit_isExamine').setValue(true);
			} else {
				Ext.getCmp('task_edit_examineUser').setValue('');
			}
			Ext.getCmp('task_edit_isExamine').on('change',
					function(field, newValue, oldValue, eOpts) {
						if (newValue) {
							Ext.Msg.alert("提示", '选择此项该任务将由审批人批准后才能进行！');
							this.previousSibling().previousSibling().allowBlank = false;
							this.previousSibling().setDisabled(false);
						} else {
							this.previousSibling().setDisabled(true);
							this.previousSibling().previousSibling().allowBlank = true;
							this.previousSibling().previousSibling()
									.setValue('');
						}
					});

		}
	}
});
