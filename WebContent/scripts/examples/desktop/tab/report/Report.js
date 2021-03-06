// model
Ext.define('report', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id'
					}, {
						name : 'beginTime'
					}, {
						name : 'endTime'
					}, {
						name : 'title'
					}, {
						name : 'time'
					}, {
						name : 'type'
					}, {
						name : 'content'
					}, {
						name : 'reportUser'
					}, {
						name : 'examineUser'
					}]
		});
var reportListStore = Ext.create('Ext.data.Store', {
			model : 'report',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				url : '../../../report/report!getAll2me',
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
Ext.define('Report', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.report',
	layout : 'fit',
	autoScroll : true,
	items : [{
		xtype : 'grid',
		forceFit : true,
		frame : true,
		id : 'report_grid',
		store : reportListStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : reportListStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'add',
					text : '新增总结',
					handler : function() {
						var tabpanel = Ext.getCmp('MainTab');
						tabpanel.remove(Ext.getCmp('reportAdd'));
						var tab = tabpanel.add({
									title : '新增总结',
									iconCls : 'wb_add_report',
									id : 'reportAdd',
									xtype : 'reportAdd',
									closable : true
								});
						tabpanel.setActiveTab(tab);
					}
				}, '-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : function() {
						reportListStore.load();
					}
				}, '-', '->', '-', {
					width : 200,
					fieldLabel : '搜索',
					labelWidth : 35,
					emptyText : '标题',
					xtype : 'searchfield',
					store : reportListStore
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
					header : '标题',
					dataIndex : 'title',
					width : 130
				}, {
					header : '汇报时间',
					dataIndex : 'time'
				}, {
					header : '类型',
					dataIndex : 'type'
				}, {
					header : '汇报给',
					dataIndex : 'examineUser'
				}],
		listeners : {
			afterrender : function() {
				reportListStore.load();
			},
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
			},
			itemdblclick : function(view, record, item, index, e, eOpts) {
				reportShowDetail(record);
			}
		}
	}]
});
var reportShowDetail = function(record) {
	var tabpanel = Ext.getCmp('MainTab');
	tabpanel.remove(Ext.getCmp('showReportDetail_panel'));
	var reportShow = tabpanel.getComponent('showReportDetail_panel');
	tabpanel.autoScroll = false;
	if (!reportShow) {
		reportShow = tabpanel.add({
			title : '查看总结',
			closable : true,
			autoScroll : true,
			id : 'showReportDetail_panel',
			tbar : ['-', {
						text : '关闭',
						iconCls:'wb_tab_close',
						handler : function() {
							var tabpanel = Ext.getCmp('MainTab');
							tabpanel.remove(Ext
									.getCmp('showReportDetail_panel'));
						}
					}, '-'],
			items : [{
				xtype : 'panel',
				border : false,
				listeners : {
					afterrender : function(panel) {
						tpl = Ext
								.create(
										'Ext.Template',
										'<p style="font-size:25px;text-align:center;background-color:#FFFFCC;">[{type}]: {title}</p>',
										'<p style="background-color:#c3daf9;font-size:20px;"><b>基本信息</b></p>',
										'<div style="background-color:#DEE9F8;margin-left:5px;">',
										'<p style="padding-left:20px;"><b>总结人: </b>{reportUser}<b style="margin-left:20px;">总结时间: </b>{time}</p>',
										'<p style="padding-left:20px;"><b>开始时间: </b>{beginTime}<b  style="margin-left:20px;">结束时间: </b>{endTime}</p>',
										'</div>',
										'<p style="background-color:#c3daf9;font-size:20px; margin-left:5px;"><b>内容</b></p>', '<div style="background-color:#DEE9F8;padding-left:20px;margin-left:5px;">{content}</div>');
						tpl.overwrite(panel.body, record.data);
						panel.doComponentLayout();
					}
				}
			}]
		});
	}
	tabpanel.setActiveTab(reportShow);
}
Ext.define('ReportAdd', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.reportAdd',
	id : 'reportAdd',
	layout : 'fit',
	autoScroll : true,
	items : [{
		xtype : 'form',
		border : false,
		id : 'report_form',
		layout : 'anchor',
		defaults : {
			anchor : '100%',
			msgTarget : 'side'
		},
		padding : '10 20 20 10',
		autoScroll : true,
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
							fieldLabel : '标题',
							name : 'title',
							labelWidth : 60,
							allowBlank : false,
							afterLabelTextTpl : required
						}, {
							xtype : 'fieldcontainer',
							fieldLabel : '总结类型',
							columnWidth : .7,
							labelWidth : 70,
							afterLabelTextTpl : required,
							defaultType : 'radiofield',
							layout : 'hbox',
							items : [{
								boxLabel : '日总结',
								name : 'type',
								checked : true,
								labelWidth : 40,
								inputValue : '日总结',
								id : 'radio1',
								listeners : {
									change : function(field, newValue,
											oldValue, eOpts) {
										if (newValue) {
											Ext.getCmp('report_begin')
													.setValue(Ext.Date
															.format(new Date(),
																	'Y-m-d'));
											Ext.getCmp('report_end')
													.setValue(Ext.Date
															.format(new Date(),
																	'Y-m-d'));
										}
									}
								}
							}, {
								boxLabel : '周总结',
								name : 'type',
								inputValue : '周总结',
								margin : '0 0 0 10',
								labelWidth : 40,
								id : 'radio2',
								listeners : {
									change : function(field, newValue,
											oldValue, eOpts) {
										if (newValue) {
											Ext
													.getCmp('report_begin')
													.setValue(Ext.Date
															.format(
																	getFirstDateOfWeek(new Date()),
																	'Y-m-d'));
											Ext
													.getCmp('report_end')
													.setValue(Ext.Date
															.format(
																	getLastDateOfWeek(new Date()),
																	'Y-m-d'));
										}
									}
								}
							}, {
								boxLabel : '月总结',
								name : 'type',
								margin : '0 0 0 10',
								labelWidth : 40,
								inputValue : '月总结',
								id : 'radio3',
								listeners : {
									change : function(field, newValue,
											oldValue, eOpts) {
										if (newValue) {
											var firstDate = new Date();

											firstDate.setDate(1); // 第一天

											var endDate = new Date(firstDate);

											endDate.setMonth(firstDate
													.getMonth()
													+ 1);

											endDate.setDate(0);

											var da1 = new Date(firstDate);
											var da2 = new Date(endDate);
											Ext.getCmp('report_begin')
													.setValue(Ext.Date.format(
															da1, 'Y-m-d'));
											Ext.getCmp('report_end')
													.setValue(Ext.Date.format(
															da2, 'Y-m-d'));
										}
									}
								}
							}]
						}, {
							fieldLabel : '开始时间',
							columnWidth : .5,
							id : 'report_begin',
							name : 'beginTime',
							labelWidth : 60,
							value : Ext.Date.format(new Date(), 'Y-m-d'),
							readOnly : true
						}, {
							fieldLabel : '结束时间',
							labelWidth : 60,
							id : 'report_end',
							name : 'endTime',
							columnWidth : .5	,
							value : Ext.Date.format(new Date(), 'Y-m-d'),
							readOnly : true
						}, {
							xtype : 'htmleditor',
							fieldLabel : '内容',
							afterLabelTextTpl : required,
							allowBlank : false,
							height:200,
							name : 'content',
							labelWidth : 60
						}]

			}]
		}, {
			xtype : 'fieldset',
			columnWidth : 0.6,
			checkboxToggle : true,
			collapsed : true,
			layout : 'column',
			title : '汇报我的总结',
			listeners : {
				collapse : function(f, eOpts) {
					Ext.getCmp('examine_user').setValue('');
				}
			},
			items : [{
						xtype : 'textarea',
						fieldLabel : '汇报给谁',
						name : 'examineUser',
						id : 'examine_user',
						readOnly : true,
						margin:'0 0 0 20',
						columnWidth : .6,
						labelWidth : 60
					}, {
						xtype : 'button',
						columnWidth : .15,
						margin : '5 0 0 65',
						text : '选择',
						handler : function() {
							showReportUserInfoTree();
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
	}],
	tbar : ['-', {
		text : '确定',
		iconCls:'my_save',
		handler : function() {
			var form = Ext.getCmp('report_form').getForm();
			if (form.isValid()) {
				form.submit({
							url : '../../../report/report!add',
							success : function(form, action) {
								form.reset();
								Ext.Msg.alert('提示', '操作成功!');
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
		text : '重置',
		iconCls:'wb_reset',
		handler : function() {
			Ext.getCmp('report_form').getForm().reset();
		}
	}, '-', {
		text : '关闭',
		iconCls:'wb_tab_close',
		handler : function() {
			var tabpanel = Ext.getCmp('MainTab');
			tabpanel.remove(Ext.getCmp('reportAdd'));
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
	bbar : ['-', {
		text : '确定',
		iconCls:'my_save',
		handler : function() {
			var form = Ext.getCmp('report_form').getForm();
			if (form.isValid()) {
				form.submit({
							url : '../../../report/report!add',
							success : function(form, action) {
								form.reset();
								Ext.Msg.alert('提示', '操作成功!');
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
		text : '重置',
		iconCls:'wb_reset',
		handler : function() {
			Ext.getCmp('report_form').getForm().reset();
		}
	}, '-', {
		text : '关闭',
		iconCls:'wb_tab_close',
		handler : function() {
			var tabpanel = Ext.getCmp('MainTab');
			tabpanel.remove(Ext.getCmp('reportAdd'));
		}
	}],
	listeners : {
		render : function(p) {
			p.getEl().on("contextmenu", function(e) {
						e.preventDefault();
					})
		}
	}
});
var reportUserTree = Ext.create('Ext.data.TreeStore', {
			sorters : [{
						property : 'id',
						direction : 'ASC'
					}],
			model : 'user_tree_drog',
			proxy : {
				type : 'ajax',
				actionMethods : {
					read : 'POST'
				},
				url : '../../../security/tree!getUserInfoCboTree',
				reader : {
					type : 'json'
				}
			}
		});
var showReportUserInfoTree = function() {
	Ext.create('Ext.window.Window', {
		title : '选择人员',
		layout : 'fit',
		height : 410,
		frame : true,
		border : false,
		draggable : true,
		closable : true,
		modal : true,
		resizable : false,
		buttonAlign : 'center',
		buttons : [{
			text : '确定',
			handler : function() {
				var users = [];
				var userStr = "";
				var tree = Ext.getCmp('report_tree');
				var select = tree.getSelectionModel();
				Ext.Array.each(tree.getChecked(), function(child) {
							if (child.data.leaf) {
								users.push(child.data.userName + "("
										+ child.data.qtitle + ");")
							}
						});
				Ext.Array.each(users, function(user) {
							userStr = userStr + user
						})
				this.ownerCt.ownerCt.close();
				Ext.getCmp('examine_user').setValue(userStr);

			}
		}, {
			text : '重置',
			handler : function() {
				reportUserTree.load();
			}
		}, {
			text : '取消',
			handler : function() {
				this.ownerCt.ownerCt.close();
			}
		}],
		items : [{
			xtype : 'panel',
			layout : 'fit',
			width : 250,
			height : 350,
			items : [{
				xtype : 'treepanel',
				height : 350,
				autoScroll : true,
				id : 'report_tree',
				store : reportUserTree,
				useArrows : true,
				rootVisible : true,
				multiSelect : true,
				root : {
					userName : "公司成员",
					iconCls : 'user_gray',
					expanded : true,
					checked : false
				},
				listeners : {
					render : function(p) {
						p.getEl().on("contextmenu", function(e) {
									e.preventDefault();
								})
					},
					checkchange : function(node, checked, options) {
						if (node.data.leaf == false) {
							if (checked) {
								node.expand();
								node.eachChild(function(n) {
											n.data.checked = true;
											n.updateInfo({
														checked : true
													});
											if (n.data.leaf == false) {
												n.expand();
												n.eachChild(function(n) {
															n.data.checked = true;
															n.updateInfo({
																		checked : true
																	});
														});
											}
										});
							} else {
								node.eachChild(function(n) {
											n.data.checked = false;
											n.updateInfo({
														checked : false
													});
											if (n.data.leaf == false) {
												n.expand();
												n.eachChild(function(n) {
															n.data.checked = false;
															n.updateInfo({
																		checked : false
																	});
														});
											}
										});
							}
						} else {
							if (!checked) {
								var parent = node.parentNode;
								var flag = false;
								parent.eachChild(function(n) {
											if (n.data.checked) {
												flag = true
											}
										})
								parent.data.checked = flag;
								node.parentNode.updateInfo({
											checked : flag
										});
							} else {
								node.parentNode.data.checked = true;
								node.parentNode.updateInfo({
											checked : true
										});
							}
						}
					}
				},
				tbar : ['-', {
							text : '展开所有',
							iconCls : 'up',
							handler : function() {
								Ext.getCmp('report_tree').expandAll();
							}
						}, '-', '->', '-', {
							text : '关闭所有',
							iconCls : 'down',
							handler : function() {
								Ext.getCmp('report_tree').collapseAll();
							}
						}, '-'],
				columns : [{
							xtype : 'treecolumn',
							text : '姓名	',
							flex : 2,
							dataIndex : 'userName'
						}, {
							text : '职位',
							flex : 1,
							dataIndex : 'positionName'
						}]
			}]
		}]
	}).show();
}
// 得到每周的第一天(周一)
function getFirstDateOfWeek(theDate) {
	var firstDateOfWeek;
	theDate.setDate(theDate.getDate() + 1 - theDate.getDay());
	firstDateOfWeek = theDate;
	return firstDateOfWeek;
}
// 得到每周的最后一天(周日)
function getLastDateOfWeek(theDate) {
	var lastDateOfWeek;
	theDate.setDate(theDate.getDate() + 7 - theDate.getDay());
	lastDateOfWeek = theDate;
	return lastDateOfWeek;
}