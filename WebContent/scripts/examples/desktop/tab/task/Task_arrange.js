Ext.define('Task_arrange', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.task_arrange',
	layout : 'fit',
	autoScroll : true,
	items : [{
		xtype : 'form',
		border : false,
		id : 'task_arrange_form',
		layout : 'anchor',
		defaults : {
			anchor : '100%',
			msgTarget : 'side'
		},
		padding : '20 20 20 20',
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
							fieldLabel : '任务标题',
							name : 'title',
							labelWidth : 60,
							allowBlank : false,
							afterLabelTextTpl : required
						}, {
							xtype : 'numberfield',
							labelWidth : 60,
							name : 'predictHours',
							fieldLabel : '估计工时',
							value : 0,
							minValue : 0
						}, {
							xtype : 'daterangefield',
							id : 'task_date',
							afterLabelTextTpl : required,
							labelWidth : 60,
							columnWidth : 1,
							fieldLabel : '任务周期'
						}, {
							fieldLabel : '审批人',
							readOnly : true,
							name : 'examineUser',
							allowBlank : true,
							labelWidth : 60,
							columnWidth : .7
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
							listeners : {
								change : function(field, newValue, oldValue,
										eOpts) {
									if (newValue) {
										Ext.Msg.alert("提示",
												'选择此项该任务将由审批人批准后才能进行！');
										this.previousSibling()
												.previousSibling().allowBlank = false;
										this.previousSibling()
												.setDisabled(false);
									} else {
										this.previousSibling()
												.previousSibling().allowBlank = true;
										this.previousSibling()
												.previousSibling().setValue('');
										this.previousSibling()
												.setDisabled(true);
									}
								}
							}
						}, {
							fieldLabel : '负责人',
							name : 'responsibleUser',
							columnWidth : .9,
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
				text : '返回任务列表',
				iconCls : 'wb_task_list',
				handler : function() {
					var tabpanel = Ext.getCmp('MainTab');
					var tab = tabpanel.getComponent(Ext.getCmp('task_list'));
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
				text : '确定',
				iconCls : 'my_save',
				handler : function() {
					var form = Ext.getCmp('task_arrange_form').getForm();
					if (form.isValid()) {
						var dates = Ext.getCmp('task_date').getValue();
						var myFormat = 'Y-m-d H:i:s';
						if (dates[2]) {
							myFormat = 'Y-m-d';
						}
						form.submit({
							url : '../../../task/taskInfo!addTask',
							params : {
								'beginTime' : Ext.Date.format(dates[0],
										myFormat),
								'endTime' : Ext.Date.format(dates[1], myFormat),
								'isAllDay' : dates[2]
							},
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
				iconCls : 'wb_reset',
				handler : function() {
					Ext.getCmp('task_arrange_form').getForm().reset();
				}
			}, '-', {
				text : '关闭',
				iconCls : 'wb_tab_close',
				handler : function() {
					var tabpanel = Ext.getCmp('MainTab');
					tabpanel.remove(Ext.getCmp('task_arrange'));
				}
			}, '-', '->', '-', {
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
	bbar : ['-', {
				text : '返回任务列表',
				iconCls : 'wb_task_list',
				handler : function() {
					var tabpanel = Ext.getCmp('MainTab');
					var tab = tabpanel.getComponent(Ext.getCmp('task_list'));
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
				text : '确定',
				iconCls : 'my_save',
				handler : function() {
					var form = Ext.getCmp('task_arrange_form').getForm();
					if (form.isValid()) {
						var dates = Ext.getCmp('task_date').getValue();
						var myFormat = 'Y-m-d H:i:s';
						if (dates[2]) {
							myFormat = 'Y-m-d';
						}
						form.submit({
							url : '../../../task/taskInfo!addTask',
							params : {
								'beginTime' : Ext.Date.format(dates[0],
										myFormat),
								'endTime' : Ext.Date.format(dates[1], myFormat),
								'isAllDay' : dates[2]
							},
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
				iconCls : 'wb_reset',
				handler : function() {
					Ext.getCmp('task_arrange_form').getForm().reset();
				}
			}, '-', {
				text : '关闭',
				iconCls : 'wb_tab_close',
				handler : function() {
					var tabpanel = Ext.getCmp('MainTab');
					tabpanel.remove(Ext.getCmp('task_arrange'));
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
var taskUserTreeStore1 = Ext.create('Ext.data.TreeStore', {
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
				url : '../../../security/tree!getUserInfoTree',
				reader : {
					type : 'json'
				}
			}
		});
var taskUserTreeStore2 = Ext.create('Ext.data.TreeStore', {
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
var showUserInfoTree = function(title, store, field, muti) {
	Ext.create('Ext.window.Window', {
		title : title,
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
				var tree = Ext.getCmp('task_drop_tree1' + field.name);
				var select = tree.getSelectionModel();
				if (field.name.indexOf('partakeUsers') >= 0) {
					Ext.Array.each(tree.getChecked(), function(child) {
								if (child.data.leaf) {
									users.push(child.data.userName + "("
											+ child.data.qtitle + ");")
								}
							});
					Ext.Array.each(users, function(user) {
								userStr = userStr + user
							})
				} else {
					userStr = select.selected.items[0].data.userName + "("
							+ select.selected.items[0].data.qtitle + ")"
				}
				this.ownerCt.ownerCt.close();
				field.setValue(userStr);

			}
		}, {
			text : '重置',
			handler : function() {
				store.load();
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
				id : 'task_drop_tree1' + field.name,
				store : store,
				useArrows : true,
				rootVisible : muti,
				multiSelect : muti,
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
								Ext.getCmp('task_drop_tree1' + field.name)
										.expandAll();
							}
						}, '-', '->', '-', {
							text : '关闭所有',
							iconCls : 'down',
							handler : function() {
								Ext.getCmp('task_drop_tree1' + field.name)
										.collapseAll();
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