// 树形菜单的store
var SysTreeStore = Ext.create('Ext.data.TreeStore', {
	defaultRootId : 'root',
	sorters : [{
				property : 'id',
				direction : 'ASC'
			}],
	proxy : {
		type : 'ajax',
		reader : 'json',
		url : '../../../security/tree!getUserRight'
	},
	listeners : {
		datachanged : function() {
			try {
				var prompt_bar = Ext.getCmp('prompt_bar');
				var store = SysTreeStore;
				if (!prompt_bar.getComponent('of_exam')) {
					if (store.getNodeById(300)) {
						prompt_bar.add({
									xtype : 'splitbutton',
									id : 'of_exam',
									text : '考勤管理'
											+ "(<span style='color:red'>0</span>)",
									iconCls : 'database_table',
									menu : [{
												text : '加班审批',
												id : 'of_workExtra_exam',
												handler : function() {
													workExtraExamShow();
												}
											}, {
												text : '外出审批',
												id : 'of_outApply_exam',
												handler : function() {
													outExamShow();
												}
											}, {
												text : '出差审批',
												id : 'of_workOut_exam',
												handler : function() {
													workOutExamShow();
												}
											}]
								});
					}
				}
				if (!prompt_bar.getComponent('of_apply')) {
					if (store.getNodeById(400)) {
						prompt_bar.add({
									xtype : 'splitbutton',
									iconCls : 'building',
									id : 'of_apply',
									text : '个人办公'
											+ "(<span style='color:red'>0</span>)",
									menu : [{
												text : '加班登记',
												id : 'of_workExtra_apply',
												handler : function() {
													workExtraApplyShow();
												}
											}, {
												text : '外出登记',
												id : 'of_outApply_apply',
												handler : function() {
													outApplyShow();
												}
											}, {
												text : '出差登记',
												id : 'of_workOut_apply',
												handler : function() {
													workOutApplyShow();
												}
											}]
								})
					}
				}
				if (!prompt_bar.getComponent('of_wait_count')) {
					if (store.getNodeById(530)) {
						prompt_bar.add({
									iconCls : 'building_link',
									id : 'of_wait_count',
									text : '我的待办'
											+ "(<span style='color:red'>0</span>)",
									handler : function() {
										flowWaitShow();
									}
								})
					}
				}
			} catch (e) {
			}

		}
	}
});
// 左侧树形菜单
Ext.define('SysTree', {
			id : 'sysTreePanel',
			frame : true,
			tbar : ['-', {
						text : '展开所有',
						iconCls : 'up',
						handler : function() {
							Ext.getCmp('sysTreePanel').expandAll();
						}
					}, '-', {
						text : '关闭所有',
						iconCls : 'down',
						handler : function() {
							Ext.getCmp('sysTreePanel').collapseAll();
						}
					}, '-'],
			extend : 'Ext.tree.Panel',
			alias : 'widget.sysTree',
			width : 200,
			useArrows : true,
			animate : true,
			height : 150,
			store : SysTreeStore,
			rootVisible : false,
			listeners : {
				render : function(p) {
					p.getEl().on("contextmenu", function(e) {
								e.preventDefault();
							})
				},
				itemdblclick : function(view, record, item, index, e, eOpts) {
					var tabpanel = Ext.getCmp('MainTab');
					tabpanel.autoScroll = true;
					if (record.data.qtitle == '') {
						return;
					}
					if (record.data.id == '410') {
						window.open(record.data.qtitle);
						return;
					}
					var tab = tabpanel.getComponent(record.data.qtitle);
					if (!tab) {
						tab = tabpanel.add({
									title : record.data.text,
									iconCls : record.data.iconCls,
									id : record.data.qtitle,
									xtype : record.data.qtitle,
									closable : true
								})
					}
					tabpanel.setActiveTab(tab);
				}
			}
		});
// 顶部
Ext.define('OfficeTop', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.officeTop',
	layout : 'column',
	defaults : {
		anchor : '100%'
	},
	items : [{
		xtype : 'toolbar',
		columnWidth : .3,
		height : 100,
		html : "<div style='width:100% height:100%;'><div style='float:left;background:url(images/office/brid.gif); height:100px; width:400px;'></div> <div style='float:right;id='search''></div></div>"

	}, {
		xtype : 'panel',
		columnWidth : .7,
		height : 100,
		frame : true,
		dockedItems : [{
					xtype : 'toolbar',
					dock : 'top',
					id : 'prompt_bar',
					items : []
				}],
		listeners : {
			render : function(p) {
				of_remind();
				p.getEl().on("contextmenu", function(e) {
							e.preventDefault();
						});
				try {
					var prompt_bar = Ext.getCmp('prompt_bar');
					var store = SysTreeStore;
					if (!prompt_bar.getComponent('bar_approve')) {
						if (store.getNodeById(300)) {
							prompt_bar.add({
										xtype : 'splitbutton',
										id : 'of_exam',
										text : '考勤管理'
												+ "(<span style='color:red'>0</span>)",
										iconCls : 'database_table',
										menu : [{
													text : '加班审批',
													id : 'of_workExtra_exam',
													handler : function() {
														workExtraExamShow();
													}
												}, {
													text : '外出审批',
													id : 'of_outApply_exam',
													handler : function() {
														outExamShow();
													}
												}, {
													text : '出差审批',
													id : 'of_workOut_exam',
													handler : function() {
														workOutExamShow();
													}
												}]
									});
						}
					}
					if (!prompt_bar.getComponent('of_apply')) {
						if (store.getNodeById(400)) {
							prompt_bar.add({
										xtype : 'splitbutton',
										iconCls : 'building',
										id : 'of_apply',
										text : '个人办公'
												+ "(<span style='color:red'>0</span>)",
										menu : [{
													text : '加班登记',
													id : 'of_workExtra_apply',
													handler : function() {
														workExtraApplyShow();
													}
												}, {
													text : '外出登记',
													id : 'of_outApply_apply',
													handler : function() {
														outApplyShow();
													}
												}, {
													text : '出差登记',
													id : 'of_workOut_apply',
													handler : function() {
														workOutApplyShow();
													}
												}]
									})
						}
					}
					if (!prompt_bar.getComponent('of_wait')) {
						if (store.getNodeById(530)) {
							prompt_bar.add({
										iconCls : 'building_link',
										id : 'of_wait_count',
										text : '我的待办'
												+ "(<span style='color:red'>0</span>)",
										handler : function() {
											flowWaitShow();
										}
									})
						}
					}
				} catch (e) {
				}
			}
		}
	}]
});
var remind_task = {
	run : function() {
		of_remind();
	},
	interval : 5000
}
// 提醒
var of_remind = function() {
	Ext.Ajax.request({
				url : '../../../process/task!getWaitCount',
				success : function(res) {
					try {
						Ext.getCmp('of_wait_count').setText('我的待办'
								+ "(<span style='color:red'>"
								+ res.responseText + "</span>)");
					} catch (e) {
					}
				}
			});
	Ext.Ajax.request({
				url : '../../../remind/remind!getRemindAll',
				success : function(res) {
					var counts = res.responseText.split('-');
					Ext.Array.each(counts, function(item, index) {
								if (index == 0) {
									try {
										Ext.getCmp('of_apply').setText('个人办公'
												+ "(<span style='color:red'>"
												+ item + "</span>)");
									} catch (e) {
									}
								} else if (index == 1) {
									try {
										Ext
												.getCmp('of_workExtra_apply')
												.setText('加班登记'
														+ "(<span style='color:red'>"
														+ item + "</span>)");
									} catch (e) {
									}
								} else if (index == 2) {
									try {
										Ext
												.getCmp('of_outApply_apply')
												.setText('外出登记'
														+ "(<span style='color:red'>"
														+ item + "</span>)");
									} catch (e) {
									}
								} else if (index == 3) {
									try {
										Ext
												.getCmp('of_workOut_apply')
												.setText('出差登记'
														+ "(<span style='color:red'>"
														+ item + "</span>)");
									} catch (e) {
									}
								} else if (index == 4) {
									try {
										Ext.getCmp('of_exam').setText('考勤管理'
												+ "(<span style='color:red'>"
												+ item + "</span>)");
									} catch (e) {
									}
								} else if (index == 5) {
									try {
										Ext
												.getCmp('of_workExtra_exam')
												.setText('加班审批'
														+ "(<span style='color:red'>"
														+ item + "</span>)");
									} catch (e) {
									}
								} else if (index == 6) {
									try {
										Ext
												.getCmp('of_outApply_exam')
												.setText('外出审批'
														+ "(<span style='color:red'>"
														+ item + "</span>)");
									} catch (e) {
									}
								} else if (index == 7) {
									try {
										Ext
												.getCmp('of_workOut_exam')
												.setText('出差审批'
														+ "(<span style='color:red'>"
														+ item + "</span>)");
									} catch (e) {
									}
								}
							})
				},
				failure : function(res) {
				}
			});
}
// 加班审批
var workExtraExamShow = function() {
	var tabpanel = Ext.getCmp('MainTab');
	var tab = tabpanel.getComponent('workExamine_extra');
	if (!tab) {
		tab = tabpanel.add({
					title : '加班审批',
					iconCls : 'exam_user',
					id : 'workExamine_extra',
					xtype : 'workExamine_extra',
					closable : true
				})
	}
	tabpanel.setActiveTab(tab);
}
// 外出审批
var outExamShow = function() {
	var tabpanel = Ext.getCmp('MainTab');
	var tab = tabpanel.getComponent('workExamine_out');
	if (!tab) {
		tab = tabpanel.add({
					title : '外出审批',
					iconCls : 'exam_user',
					id : 'workExamine_out',
					xtype : 'workExamine_out',
					closable : true
				})
	}
	tabpanel.setActiveTab(tab);
}
// 出差审批
var workOutExamShow = function() {
	var tabpanel = Ext.getCmp('MainTab');
	var tab = tabpanel.getComponent('workExamine_outWork');
	if (!tab) {
		tab = tabpanel.add({
					title : '出差审批',
					iconCls : 'exam_user',
					id : 'workExamine_outWork',
					xtype : 'workExamine_outWork',
					closable : true
				})
	}
	tabpanel.setActiveTab(tab);
}
// 加班登记
var workExtraApplyShow = function() {
	var tabpanel = Ext.getCmp('MainTab');
	var tab = tabpanel.getComponent('workExtraApply');
	if (!tab) {
		tab = tabpanel.add({
					title : '加班审批',
					iconCls : 'apply_user',
					id : 'workExtraApply',
					xtype : 'workExtraApply',
					closable : true
				})
	}
	tabpanel.setActiveTab(tab);
}
// 外出登记
var outApplyShow = function() {
	var tabpanel = Ext.getCmp('MainTab');
	var tab = tabpanel.getComponent('outApply');
	if (!tab) {
		tab = tabpanel.add({
					title : '外出审批',
					iconCls : 'apply_user',
					id : 'outApply',
					xtype : 'outApply',
					closable : true
				})
	}
	tabpanel.setActiveTab(tab);
}
// 出差登记
var workOutApplyShow = function() {
	var tabpanel = Ext.getCmp('MainTab');
	var tab = tabpanel.getComponent('workoutApply');
	if (!tab) {
		tab = tabpanel.add({
					title : '出差登记',
					iconCls : 'apply_user',
					id : 'workoutApply',
					xtype : 'workoutApply',
					closable : true
				})
	}
	tabpanel.setActiveTab(tab);
}
// 我的待办
var flowWaitShow = function() {
	var tabpanel = Ext.getCmp('MainTab');
	var tab = tabpanel.getComponent('flowManager_waitFlow');
	if (!tab) {
		tab = tabpanel.add({
					title : '我的待办',
					iconCls : 'building_link',
					id : 'flowManager_waitFlow',
					xtype : 'flowManager_waitFlow',
					closable : true
				})
	}
	tabpanel.setActiveTab(tab);
}
// office 结构
Ext.define('MyDesktop.Office', {
	extend : 'Ext.ux.desktop.Module',
	requires : ['Ext.form.field.HtmlEditor'],
	id : 'office',
	init : function() {
		this.launcher = {
			text : '办公',
			iconCls : 'office'
		}
	},
	createWindow : function() {
		Ext.TaskManager.start(remind_task);
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('office');
		if (!win) {
			win = desktop.createWindow({
				id : 'office',
				title : '办公',
				width : 600,
				height : 400,
				iconCls : 'office',
				animCollapse : false,
				border : false,
				hideMode : 'offsets',
				layout : 'border',
				listeners:{
					beforeclose:function(){
						Ext.TaskManager.stop(remind_task);
					}
				},	
				items : [{
							title : '菜单',
							region : 'west',
							iconCls : 'edit0',
							width : 200,
							xtype : 'sysTree',
							collapsible : true
						}, {
							region : 'center',
							enableTabScroll : true,
							id : 'center',
							autoScroll : true,
							layout : 'fit',
							items : [{
								xtype : 'tabpanel',
								id : 'MainTab',
								alias : 'widget.mainTab',
								activeTab : 0,
								autoScroll : false,
								plugins : Ext.create('Ext.ux.TabCloseMenu'),
								items : [{
									title : '首页',
									layout : 'border',
									iconCls : 'wb_home',
									autoScroll : false,
									applyTo : 'iconmain',
									items : [{
										xtype : 'portalpanel',
										region : 'center',
										margins : '5 5 5 0',
										items : [{
											columnWidth : .5,
											style : 'padding:10px 0 10px 10px',
											items : [{
												title : '公告/通知',
												items : [{
															xtype : 'protal_notice'
														}],
												height : 240
											}, {
												title : '任务列表',
												items : [{
															xtype : 'protal_task_list'
														}]
											}]
										}, {
											columnWidth : .5,
											margins : '5 5 5 10',
											style : 'padding:10px 0 10px 10px',
											items : [{
												title : '最新共享',
												height : 240,
												items : [{
															xtype : 'portalShare'
														}]
											}, {
												title : '我的待办',
												items : [{
															xtype : 'portal_waitFlow'
														}]
											}]
										}]
									}]
								}]
							}]

						}, {
							height : 50,
							region : 'north',
							xtype : 'officeTop'
						}]
			});
		}
		return win;
	}
});
