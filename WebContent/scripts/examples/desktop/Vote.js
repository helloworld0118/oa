Ext.define('Vote', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'vsId'
					}, {
						name : 'vsTitle'
					}, {
						name : 'vsUser'
					}, {
						name : 'vsType'
					}, {
						name : 'vsDes'
					}, {
						name : 'vsCreateTime'
					}, {
						name : 'vsBeginTime'
					}, {
						name : 'vsEndTime'
					}, {
						name : 'voteOptions'
					}, {
						name : 'state'
					}]
		});

var containerItems = [];
// 搜索store
var store_vote_search = Ext.create('Ext.data.Store', {
			model : 'Vote',
			pageSize : 20,
			proxy : {
				actionMethods : {
					read : 'POST'
				},
				type : 'ajax',
				url : '../../../vote/vote!getAll',
				reader : {
					type : 'json',
					root : 'items',
					totalProperty : 'total'
				}
			}
		});
Ext.define('VoteSubjectAdd', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.voteSubjectAdd',
	id : 'voteSubjectAdd',
	layout : 'fit',
	autoScroll : true,
	items : [{
		xtype : 'form',
		border : false,
		id : 'voteSubjectAdd_form',
		layout : 'column',
		defaults : {
			columnWidth : .55,
			xtype : 'textfield',
			msgTarget : 'side'
		},
		padding : '10 20 20 10',
		autoScroll : true,
		items : [{
					fieldLabel : '投票标题',
					name : 'vsTitle',
					labelWidth : 60,
					margin : '10 0 0 10',
					allowBlank : false,
					afterLabelTextTpl : required
				}, {
					xtype : 'daterangefield',
					id : 'vote_date',
					margin : '10 0 0 10',
					afterLabelTextTpl : required,
					labelWidth : 60,
					columnWidth : 1,
					fieldLabel : '投票时间'
				}, {
					xtype : 'fieldcontainer',
					fieldLabel : '投票类型',
					columnWidth : .7,
					margin : '10 0 0 10',
					labelWidth : 70,
					afterLabelTextTpl : required,
					defaultType : 'radiofield',
					layout : 'hbox',
					items : [{
								boxLabel : '单选',
								name : 'vsType',
								checked : true,
								labelWidth : 40,
								margin : '0 0 0 5',
								inputValue : '0'
							}, {
								boxLabel : '多选',
								name : 'vsType',
								margin : '0 0 0 25',
								labelWidth : 40,
								inputValue : '1'
							}]
				}, {
					xtype : 'fieldcontainer',
					fieldLabel : '投票选项',
					columnWidth : 1,
					afterLabelTextTpl : required,
					margin : '10 0 0 10',
					labelWidth : 60,
					id : 'vote_option_con',
					layout : 'vbox',
					items : [{
								xtype : 'textfield',
								name : 'options',
								labelWidth : 60,
								width : 548,
								allowBlank : false,
								afterLabelTextTpl : required
							}, {
								xtype : 'textfield',
								name : 'options',
								width : 548,
								labelWidth : 60,
								allowBlank : false,
								afterLabelTextTpl : required
							}]
				}, {
					xtype : 'fieldcontainer',
					columnWidth : .7,
					margin : '0 0 0 10',
					labelWidth : 70,
					layout : 'hbox',
					items : [{
								xtype : 'button',
								columnWidth : .3,
								margin : '0 0 0 250',
								text : '增加选项',
								handler : function() {
									var con = Ext.getCmp('vote_option_con');
									this.nextSibling().setDisabled(false);
									var item = con.add({
												xtype : 'textfield',
												name : 'options',
												width : 548,
												labelWidth : 60,
												allowBlank : false,
												afterLabelTextTpl : required
											});
									containerItems.push(item);
								}
							}, {
								xtype : 'button',
								margin : '0 0 0 10',
								columnWidth : .3,
								text : '删除选项',
								disabled : true,
								handler : function() {
									var con = Ext.getCmp('vote_option_con');
									con
											.remove(containerItems[containerItems.length
													- 1]);
									containerItems.pop();
									if (containerItems.length == 0) {
										this.setDisabled(true);
									}
								}
							}]
				}, {
					xtype : 'htmleditor',
					fieldLabel : '描述',
					height : 200,
					margin : '10 0 0 10',
					name : 'vsDes',
					labelWidth : 60
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
		iconCls : 'my_save',
		handler : function() {
			var form = Ext.getCmp('voteSubjectAdd_form').getForm();
			if (form.isValid()) {
				var dates = Ext.getCmp('vote_date').getValue();
				var myFormat = 'Y-m-d H:i:s';
				if (dates[2]) {
					myFormat = 'Y-m-d';
				}
				form.submit({
							url : '../../../vote/vote!addSubject',
							params : {
								'vsBeginTime' : Ext.Date.format(dates[0],
										myFormat),
								'vsEndTime' : Ext.Date.format(dates[1],
										myFormat),
								'vsIsAllDay' : dates[2]
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
			Ext.getCmp('voteSubjectAdd_form').getForm().reset();
		}
	}, '-', {
		text : '关闭',
		iconCls : 'wb_tab_close',
		handler : function() {
			var tabpanel = Ext.getCmp('voteMain');
			tabpanel.remove(Ext.getCmp('voteSubjectAdd'));
		}
	}, '-', '->', '-', {
		xtype : 'splitbutton',
		text : '',
		iconCls : 'help',
		menu : [{
					text : '图文帮助',
					iconCls : 'help_img',
					handler : function() {
						findFailShow('voteMain', 'help_img');
					}

				}, {
					text : '视频帮助',
					iconCls : 'help_video',
					handler : function() {
						findFailShow('voteMain', 'help_video');
					}
				}]
	}],
	bbar : ['-', {
		text : '确定',
		iconCls : 'my_save',
		handler : function() {
			var form = Ext.getCmp('voteSubjectAdd_form').getForm();
			if (form.isValid()) {
				var dates = Ext.getCmp('vote_date').getValue();
				var myFormat = 'Y-m-d H:i:s';
				if (dates[2]) {
					myFormat = 'Y-m-d';
				}
				form.submit({
							url : '../../../vote/vote!addSubject',
							params : {
								'vsBeginTime' : Ext.Date.format(dates[0],
										myFormat),
								'vsEndTime' : Ext.Date.format(dates[1],
										myFormat),
								'vsIsAllDay' : dates[2]
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
			Ext.getCmp('voteSubjectAdd_form').getForm().reset();
		}
	}, '-', {
		text : '关闭',
		iconCls : 'wb_tab_close',
		handler : function() {
			var tabpanel = Ext.getCmp('voteMain');
			tabpanel.remove(Ext.getCmp('voteSubjectAdd'));
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
// 头部
Ext.define('VoteTopPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.voteTopPanel',
	id : 'top',
	layout : 'column',
	items : [{
		xtype : 'toolbar',
		columnWidth : .7,
		height : 100,
		html : "<div style='width:100% height:100%;'><div style='float:left;background:url(images/office/brid.gif); height:100px; width:400px;'></div> <div style='float:right;id='search''></div></div>"

	}, {
		xtype : 'form',
		columnWidth : .3,
		height : 100,
		frame : true,
		layout : 'anchor',
		items : [{
					fieldLabel : '搜索',
					labelWidth : 35,
					margin : '35 0 0 0',
					anchor : '100%',
					emptyText : '标题',
					xtype : 'searchfield',
					store : store_vote_search,
					onTrigger2Click : function() {
						var me = this, value = me.getValue();
						if (value.length > 0) {
							me.store.filter({
										id : me.paramName,
										property : me.paramName,
										value : value
									});
							me.hasSearch = true;
							me.triggerCell.item(0).setDisplayed(true);
							me.updateLayout();
							var tabpanel = Ext.getCmp('voteMain');
							var voteSearch = tabpanel
									.getComponent('voteSearchPanel');
							if (!voteSearch) {
								voteSearch = tabpanel.add({
											title : '搜索结果',
											iconCls : '',// TODO
											// 样式没有加
											id : 'voteSearchPanel',
											xtype : 'voteSearchPanel',
											closable : true
										});
							}
							tabpanel.setActiveTab(voteSearch);
						}
					}
				}]
	}]
});
// 左侧的菜单栏
Ext.define('VoteBar', {
	extend : 'Ext.panel.Panel',
	frame : true,
	alias : 'widget.voteBar',
	defaults : {
		bodyStyle : 'padding:15px'
	},
	layoutConfig : {
		titleCollapse : false,
		animate : true,
		activeOnTop : true
	},
	items : [{
				xtype : 'datepicker',
				cls : 'ext-cal-nav-picker',
				todayText : '今天',
				ariaTitleDateFormat : 'Y-m-d',
				monthYearFormat : 'Y年m月',
				listeners : {}
			}, {
				xtype : 'panel',
				frame : true,
				border : false,
				defaultType : 'button',
				layout : 'column',
				defaults : {
					columnWidth : 1
				},
				listeners : {
					render : function(p) {
						Ext.Ajax.request({
							url : '../../../vote/vote!getCurrentUserRole',
							success : function(res) {
								if (res.responseText == 'true') {
									p.add({
										xtype : 'button',
										margin : '5 0 0 0',
										text : '发起投票',
										handler : function() {
											var tabpanel = Ext
													.getCmp('voteMain');
											var voteSubAdd = tabpanel
													.getComponent('voteSubjectAdd');
											if (!voteSubAdd) {
												voteSubAdd = tabpanel.add({
															title : '发起投票',
															iconCls : '',// TODO
															// 样式没有加
															id : 'voteSubjectAdd',
															xtype : 'voteSubjectAdd',
															closable : true
														});
											}
											tabpanel.setActiveTab(voteSubAdd);
										}
									})
								}
							},
							failure : function() {
							}
						});
					}
				},
				items : [{
							margin : '0 0 0 0',
							iconCls : '',
							text : '正/将进行',
							handler : function() {
								var tabpanel = Ext.getCmp('voteMain');
								var voteIng = tabpanel
										.getComponent('voteIngPanel');
								if (!voteIng) {
									voteIng = tabpanel.add({
												title : '正/将进行',
												iconCls : '',// TODO
												// 样式没有加
												id : 'voteIngPanel',
												xtype : 'voteIngPanel',
												closable : true
											});
								}
								tabpanel.setActiveTab(voteIng);

							}
						}, {
							margin : '5 0 0 0',
							iconCls : '',
							text : '历史投票',
							handler : function() {
								var tabpanel = Ext.getCmp('voteMain');
								var voteEd = tabpanel
										.getComponent('voteEdPanel');
								if (!voteEd) {
									voteEd = tabpanel.add({
												title : '历史投票',
												iconCls : '',// TODO
												// 样式没有加
												id : 'voteEdPanel',
												xtype : 'voteEdPanel',
												closable : true
											});
								}
								tabpanel.setActiveTab(voteEd);
							}
						}]
			}]

});
// 主窗口
Ext.define('MyDesktop.Vote', {
	extend : 'Ext.ux.desktop.Module',

	requires : ['Ext.form.field.HtmlEditor'
	// 'Ext.form.field.TextArea'
	],

	id : 'vote',

	init : function() {
		this.launcher = {
			text : '投票',
			iconCls : 'vote'
		}
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('vote');
		if (!win) {
			win = desktop.createWindow({
				id : 'vote',
				title : '投票',
				width : 600,
				height : 400,
				iconCls : 'vote',
				animCollapse : false,
				border : false,
				hideMode : 'offsets',
				layout : 'border',
				listeners : {
					render : function(p) {
						p.getEl().on("contextmenu", function(e) {// 右键事件
									e.preventDefault();
								})
					}
				},
				items : [{
							id : 'voteBar',
							region : 'west',
							width : 190,
							xtype : 'voteBar'
						}, {
							region : 'north',
							xtype : 'voteTopPanel',
							height : 70,
							border : '1 1 1 1'
						}, {
							id : 'voteBody',
							region : 'center',
							enableTabScroll : true,
							autoScroll : true,
							layout : 'fit',
							items : [{
								xtype : 'tabpanel',
								id : 'voteMain',
								// alias : 'widget.voteMain',
								activeTab : 0,
								layout : 'fit',
								plugins : Ext.create('Ext.ux.TabCloseMenu'),
								items : [{
									title : '首页',
									bodyPadding : 10,
									iconCls : 'wb_home',
									html : '<center style="margin-top:100px;font-size:72px;">因为有你 , 所以会更好</center>'
								}]
							}]

						}]
			});
		}
		return win;
	}
});
// VoteIng store
var VoteIngStore = Ext.create('Ext.data.Store', {
			model : 'Vote',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../vote/vote!getVoteIng'
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
// VoteEd store
var VoteEdStore = Ext.create('Ext.data.Store', {
			model : 'Vote',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../vote/vote!getVoteEd'
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
var voteIng_refresh = function(store) {
	store.load();
}
// Ingxtype
Ext.define('VoteIngPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.voteIngPanel',
	id : 'voteIngPanel',
	layout : 'fit',
	listeners : {
		afterrender : function() {
			VoteIngStore.load();
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
		height : 400,
		frame : true,
		id : 'voteIngPanel_grid',
		store : VoteIngStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : VoteIngStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : function() {
						voteIng_refresh(VoteIngStore);
					}
				}, '-', {
					iconCls : 'wb_vote_show',
					text : '投票情况',
					handler : function() {
						showChartByGrid('voteIngPanel_grid');
					}
				}, '-', '->', '-', {
					xtype : 'splitbutton',
					text : '',
					iconCls : 'help',
					menu : [{
								text : '图文帮助',
								iconCls : 'help_img',
								handler : function() {
									findFailShow('voteMain', 'help_img');
								}

							}, {
								text : '视频帮助',
								iconCls : 'help_video',
								handler : function() {
									findFailShow('voteMain', 'help_video');
								}
							}]
				}],
		columns : [{
					header : '标题',
					dataIndex : 'vsTitle'
				}, {
					header : '发起人',
					dataIndex : 'vsUser'
				}, {
					header : '发起时间',
					dataIndex : 'vsCreateTime'
				}, {
					header : '开始时间',
					dataIndex : 'vsBeginTime'
				}, {
					header : '结束时间',
					dataIndex : 'vsEndTime'
				}, {
					header : '状态',
					dataIndex : 'state'
				}],
		listeners : {
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
			},
			itemdblclick : function(view, record, item, index, e, eOpts) {
				voteShowDetail(record);
			}
		}
	}]
});
// Edxtype
Ext.define('VoteEdPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.voteEdPanel',
	id : 'voteEdPanel',
	layout : 'fit',
	listeners : {
		afterrender : function() {
			VoteEdStore.load();
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
		height : 400,
		frame : true,
		id : 'voteEdPanel_grid',
		store : VoteEdStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : VoteEdStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : function() {
						voteIng_refresh(VoteEdStore);
					}
				}, '-', {
					iconCls : 'delte0',
					text : '删除',
					handler : function() {
						var grid = Ext.getCmp('voteEdPanel_grid');
						var selModel = grid.getSelectionModel();
						if (selModel.hasSelection()) {
							Ext.Array.each(selModel.getSelection(), function(
											item) {
										Ext.Ajax.request({
													url : '../../../vote/vote!delete',
													params : {
														'vsId' : item.data.vsId
													},
													success : function(res) {
													},
													failure : function(res) {
													}
												})
									});
							VoteEdStore.load();
						} else {
							Ext.Msg
									.alert('提示',
											"<span style='color:red'>请至少选择一条数据！</span>");
						}
					}
				}, '-', {
					iconCls : 'wb_vote_show',
					text : '投票情况',
					handler : function() {
						showChartByGrid('voteEdPanel_grid');
					}
				}, '-', '->', '-', {
					xtype : 'splitbutton',
					text : '',
					iconCls : 'help',
					menu : [{
								text : '图文帮助',
								iconCls : 'help_img',
								handler : function() {
									findFailShow('voteMain', 'help_img');
								}

							}, {
								text : '视频帮助',
								iconCls : 'help_video',
								handler : function() {
									findFailShow('voteMain', 'help_video');
								}
							}]
				}],
		columns : [{
					header : '标题',
					dataIndex : 'vsTitle'
				}, {
					header : '发起人',
					dataIndex : 'vsUser'
				}, {
					header : '发起时间',
					dataIndex : 'vsCreateTime'
				}, {
					header : '开始时间',
					dataIndex : 'vsBeginTime'
				}, {
					header : '结束时间',
					dataIndex : 'vsEndTime'
				}],
		plugins : [{
			ptype : 'rowexpander',
			rowBodyTpl : [
					"<b style='margin-left:0px;'>描述:</b> {vsDes}",
					'<tpl for="voteOptions">',
					'<p style="margin-left:0px;"><b><span style="color:green"> 选项：</span></b>{option}</p>',
					'</tpl>']
		}],
		listeners : {
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
			}
		}
	}]
});
// Searchxtype
Ext.define('VoteSearchPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.voteSearchPanel',
	id : 'voteSearchPanel',
	layout : 'fit',
	listeners : {
		afterrender : function() {
			store_vote_search.load();
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
		height : 400,
		frame : true,
		id : 'voteSearchPanel_grid',
		store : store_vote_search,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : store_vote_search,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : function() {
						voteIng_refresh(store_vote_search);
					}
				}, '-', {
					iconCls : 'wb_vote_show',
					text : '投票情况',
					handler : function() {
						showChartByGrid('voteSearchPanel_grid');
					}
				}, '-', '->', '-', {
					xtype : 'splitbutton',
					text : '',
					iconCls : 'help',
					menu : [{
								text : '图文帮助',
								iconCls : 'help_img',
								handler : function() {
									findFailShow('voteMain', 'help_img');
								}

							}, {
								text : '视频帮助',
								iconCls : 'help_video',
								handler : function() {
									findFailShow('voteMain', 'help_video');
								}
							}]
				}],
		columns : [{
					header : '标题',
					dataIndex : 'vsTitle'
				}, {
					header : '发起人',
					dataIndex : 'vsUser'
				}, {
					header : '发起时间',
					dataIndex : 'vsCreateTime'
				}, {
					header : '开始时间',
					dataIndex : 'vsBeginTime'
				}, {
					header : '结束时间',
					dataIndex : 'vsEndTime'
				}, {
					header : '状态',
					dataIndex : 'state'
				}],
		plugins : [{
			ptype : 'rowexpander',
			rowBodyTpl : [
					"<b style='margin-left:0px;'>描述:</b> {vsDes}",
					'<tpl for="voteOptions">',
					'<p style="margin-left:0px;"><b><span style="color:green"> 选项：</span></b>{option}</p>',
					'</tpl>']
		}],
		listeners : {
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
			}
		}
	}]
});
var showChartByGrid = function(id) {
	var grid = Ext.getCmp(id)
	var selModel = grid.getSelectionModel();
	if (selModel.getSelection().length == 1) {
		var VoteChartStore = Ext.create('Ext.data.Store', {
					fields : ['name', 'count'],
					proxy : {
						type : 'ajax',
						api : {
							read : '../../../vote/vote!getVoteDetail?vsId='
									+ selModel.getSelection()[0].data.vsId
						},
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json'
						}
					}
				});
		VoteChartStore.load();
		var title = selModel.getSelection()[0].data.vsTitle;
		Ext.Ajax.request({
					url : '../../../vote/vote!getVoteItemsSize?vsId='
							+ selModel.getSelection()[0].data.vsId,
					success : function(res) {
						title=title+ "<span style='color:red;margin-left:10px;'>(" + res.responseText + ")人投票</span>"
						Ext.create('Ext.window.Window', {
			title : title,
			id : 'role_add',
			frame : true,
			border : false,
			draggable : true,
			closable : true,
			modal : true,
			resizable : false,
			listeners : {
				render : function(p) {
					p.getEl().on("contextmenu", function(e) {
								e.preventDefault();
							})
				}
			},
			items : [{
				xtype : 'tabpanel',
				items : [{
					title : '柱状图',
					xtype : 'chart',
					animate : true,
					width : 660,
					height : 400,
					frame : true,
					store : VoteChartStore,
					axes : [{
								type : 'Numeric',
								position : 'left',
								fields : ['count'],
								label : {
									renderer : Ext.util.Format
											.numberRenderer('0,0')
								},
								title : '票数',
								grid : true,
								minimum : 0
							}, {
								type : 'Category',
								position : 'bottom',
								fields : ['name'],
								title : '选项'
							}],
					series : [{
						type : 'column',
						axis : 'left',
						highlight : true,
						tips : {
							trackMouse : true,
							width : 140,
							height : 28,
							renderer : function(storeItem, item) {
								this.setTitle(storeItem.get('name') + ': '
										+ storeItem.get('count') + "票");
							}
						},
						label : {
							display : 'insideEnd',
							'text-anchor' : 'middle',
							field : 'count',
							renderer : Ext.util.Format.numberRenderer('0'),
							orientation : 'vertical',
							color : '#333'
						},
						xField : 'name',
						yField : 'count'
					}]
				}, {
					title : '扇形图',
					width : 660,
					height : 400,
					frame : true,
					xtype : 'chart',
					animate : true,
					store : VoteChartStore,
					series : [{
						type : 'pie',
						angleField : 'count',
						showInLegend : true,
						tips : {
							trackMouse : true,
							width : 140,
							height : 28,
							renderer : function(storeItem, item) {
								var total = 0;
								VoteChartStore.each(function(rec) {
											total += rec.get('count');
										});
								this.setTitle(storeItem.get('name')
										+ ': '
										+ Math.round(storeItem.get('count')
												/ total * 100) + '%');
							}
						},
						highlight : {
							segment : {
								margin : 20
							}
						},
						label : {
							field : 'name',
							display : 'rotate',
							contrast : true,
							font : '18px Arial'
						}
					}]

				}]
			}]
		}).show();
					}
				})
	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请选择一条数据！</span>");
	}
}
// 进行投票或查看
var voteShowDetail = function(record) {
	Ext.create('Ext.window.Window', {
		border : false,
		draggable : true,
		closable : true,
		modal : true,
		resizable : false,
		width : 550,
		title : '正/将进行',
		iconCls : '',// TODO
		// 样式没有加
		id : 'voteDetailShowPanel',
		closable : true,
		layout : 'anchor',
		defaults : {
			anchor : '100%'
		},
		items : [{
			xtype : 'panel',
			listeners : {
				afterrender : function(panel) {
					tpl = Ext
							.create(
									'Ext.XTemplate',
									'<p style="font-size:25px;text-align:center;background-color:#FFFFCC;">{vsTitle}</p>',
									'<div style="background-color:#DEE9F8;margin-left:5px;margin-right:5px;">',
									'<p style="background-color:#c3daf9"><b>描述</b></p>',
									'<p>{vsDes}</p>', '</div>');
					tpl.overwrite(panel.body, record.data);
					panel.doComponentLayout();
				}
			}
		}, {
			xtype : 'form',
			layout : 'auto',
			frame : true,
			buttonAlign : 'center',
			buttons : [{
				text : '投票',
				disabled : record.data.state.indexOf('进行中') > 0 ? false : true,
				handler : function() {
					var form = this.ownerCt.ownerCt.getForm();
					var ids = [];
					Ext.Array.each(form.getFields().items, function(item) {
								if (item.checked) {
									ids.push(item.id);
								}
							})
					if (ids.length == 0) {
						Ext.Msg.alert('提示',
								"<span style='color:red'>请进行选择！</span>");
						return;
					}
					Ext.Ajax.request({
						url : '../../../vote/vote!addItems',
						params : {
							'vsId' : record.data.vsId,
							'options' : ids
						},
						success : function(res) {
							if (res.responseText != 'true') {
								Ext.Msg
										.alert('提示',
												"<span style='color:red'>你已经投过票了！</span>");
							} else {
								Ext.Msg.alert('提示', "谢谢你的参与！");
							}
						},
						failure : function(res) {
							Ext.Msg
									.alert('提示',
											"<span style='color:red'>操作失败，请联系管理员！</span>");
						}
					})
				}
			}, {
				text : '取消',
				handler : function() {
					this.ownerCt.ownerCt.ownerCt.close();
				}
			}],
			items : [{
				xtype : 'fieldcontainer',
				fieldLabel : '选项',
				margin : '5 0 0 10',
				labelWidth : 60,
				layout : 'vbox',
				items : [],
				listeners : {
					render : function(p) {
						var options = Ext.Array.sort(record.data.voteOptions);
						Ext.Array.each(options, function(item) {
									p.add({
												xtype : record.data.vsType == 1
														? 'checkbox'
														: 'radio',
												id : item.id,
												name : 'voteName',
												inputValue : item.id,
												boxLabel : item.option,
												labelWidth : 60
											})
								})
					}
				}
			}]
		}]
	}).show();
}