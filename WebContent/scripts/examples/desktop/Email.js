Ext.define('emailBox', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'emailId'
					}, {
						name : 'emailAttachments'
					}, {
						name : 'emailTitle'
					}, {
						name : 'userAccept'
					}, {
						name : 'userSend'
					}, {
						name : 'emailContent'
					}, {
						name : 'emailJudge'
					}, {
						name : 'isRead'
					}, {
						name : 'emailDate'
					}]
		});
// 收件箱store
var store_rec = Ext.create('Ext.data.Store', {
			model : 'emailBox',
			pageSize : 15,
			proxy : {
				type : 'ajax',
				url : '../../../email/email!getRec?emailBox.judge=3',
				reader : {
					type : 'json',
					root : 'items',
					totalProperty : 'total'
				}
			}
		});
// 已发送store
var store_send = Ext.create('Ext.data.Store', {
			model : 'emailBox',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				url : '../../../email/email!getSend?emailBox.judge=0',
				reader : {
					type : 'json',
					root : 'items',
					totalProperty : 'total'
				}
			}
		});
// 草稿箱store
var store_straw = Ext.create('Ext.data.Store', {
			model : 'emailBox',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				url : '../../../email/email!getStraw?emailBox.judge=1',
				reader : {
					type : 'json',
					root : 'items',
					totalProperty : 'total'
				}
			}
		});
// 垃圾箱store
var store_dustbin = Ext.create('Ext.data.Store', {
			model : 'emailBox',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				url : '../../../email/email!getDustbin?emailBox.judge=2',
				reader : {
					type : 'json',
					root : 'items',
					totalProperty : 'total'
				}
			}
		});
// 搜索store
var store_email_search = Ext.create('Ext.data.Store', {
			model : 'emailBox',
			pageSize : 20,
			actionMethods : {
				create : "POST",
				read : "POST",
				update : "POST",
				destroy : "POST"
			},
			proxy : {
				type : 'ajax',
				url : '../../../email/email!getAll',
				reader : {
					type : 'json',
					root : 'items',
					totalProperty : 'total'
				}
			}
		});
// 邮箱头部
Ext.define('TopPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.topPanel',
	id : 'email_top',
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
					emptyText : '主题',
					xtype : 'searchfield',
					store : store_email_search,
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
							emailSearch();
						}
					}
				}]
	}]
});
// 定义自己的API
var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
// 发件右键菜单
var menu_writer = Ext.create('Ext.menu.Menu', {
	margin : '0 0 10 0',
	items : [{
		text : '选择收件人',
		handler : function() {
			Ext.create('Ext.window.Window', {
				title : '选择收件人',
				layout : 'fit',
				modal : true,
				height : 410,
				buttonAlign : 'center',
				buttons : [{
					text : '确定',
					handler : function() {
						var users = [];
						Ext.Array.each(userTreeDrogStore2.tree.root.childNodes,
								function(child) {
									if (child.data.leaf) {
										users.push(child.data.userName + '('
												+ child.data.qtitle + ');')
									} else {
										Ext.Array.each(child.data.children,
												function(subChild) {
													users
															.push(subChild.userName
																	+ '('
																	+ subChild.qtitle
																	+ ');')
												})
									}
								})
						var userStr = "";
						Ext.Array.each(users, function(user) {
									userStr = userStr + user;
								})
						this.ownerCt.ownerCt.close();
						Ext.getCmp('userAccept_form').setValue(userStr);
					}
				}, {
					text : '重置',
					handler : function() {
						userTreeDrogStore1.load();
						userTreeDrogStore2.load();
					}
				}, {
					text : '取消',
					handler : function() {
						this.ownerCt.ownerCt.close();
					}
				}],
				items : [{
					xtype : 'panel',
					layout : 'column',
					width : 400,
					height : 350,
					items : [{
								xtype : 'treepanel',
								columnWidth : .5,
								height : 350,
								autoScroll : true,
								id : 'drop_tree1',
								store : userTreeDrogStore1,
								useArrows : true,
								rootVisible : true,
								multiSelect : true,
								root : {
									userName : "联系人",
									expanded : true
								},
								tbar : ['-', {
											text : '展开所有',
											iconCls : 'up',
											handler : function() {
												Ext.getCmp('drop_tree1')
														.expandAll();
											}
										}, '-', '->', '-', {
											text : '关闭所有',
											iconCls : 'down',
											handler : function() {
												Ext.getCmp('drop_tree1')
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
										}],
								viewConfig : {
									plugins : {
										ptype : 'treeviewdragdrop',
										allowContainerDrops : false,
										appendOnly : true
									}
								}
							}, {
								xtype : 'treepanel',
								columnWidth : .5,
								id : 'drop_tree2',
								height : 350,
								autoScroll : true,
								store : userTreeDrogStore2,
								useArrows : true,
								rootVisible : true,
								root : {
									userName : "发送给"
								},
								tbar : ['-', {
											text : '展开所有',
											iconCls : 'up',
											handler : function() {
												Ext.getCmp('drop_tree2')
														.expandAll();
											}
										}, '-', '->', '-', {
											text : '关闭所有',
											iconCls : 'down',
											handler : function() {
												Ext.getCmp('drop_tree2')
														.collapseAll();
											}
										}, '-'],
								multiSelect : true,
								columns : [{
											xtype : 'treecolumn',
											text : '姓名 ',
											flex : 2,
											dataIndex : 'userName'
										}, {
											text : '职位',
											flex : 1,
											dataIndex : 'positionName'
										}],
								viewConfig : {
									plugins : {
										ptype : 'treeviewdragdrop',
										allowContainerDrops : false,
										appendOnly : true
									},
									listeners : {
										beforedrop : function(node, data,
												overModel, dropPosition,
												dropHandler, eOpts) {
											if (overModel.data.userName != "发送给") {
												dropHandler.cancelDrop();
											}
										}
									}
								}
							}]
				}]
			}).show();
		}
	}, {
		text : '取消',
		handler : function() {
			var tabpanel = Ext.getCmp('eamilMain');
			var wrierTab = tabpanel.getComponent('writer');
			tabpanel.remove(wrierTab)
		}
	}]
})
// 收件箱右键菜单
var menu_rec = Ext.create('Ext.menu.Menu', {
			margin : '0 0 10 0',
			items : [{
						text : '查看	',
						menu : {
							items : [{
										text : '全部',
										handler : function() {
											rec_filter = null;
											store_rec.load();
										}
									}, {
										text : '已读',
										handler : function() {
											rec_filter = true;
											store_rec.load({
														params : {
															'query' : true
														}
													});
										}
									}, {
										text : '未读',
										handler : function() {
											rec_filter = false;
											store_rec.load({
														params : {
															'query' : false
														}
													});
										}
									}]
						}
					}, {
						text : '删除',
						handler : function() {
							move2DustbinRecord();
						}
					}]
		})
// 已发送右键菜单
var menu_send = Ext.create('Ext.menu.Menu', {
			margin : '0 0 10 0',
			items : [{
				text : '移动到	',
				menu : {
					items : [{
						text : '草稿箱',
						handler : function() {
							save2strawByrecord(false, Ext
											.getCmp('emailsendbox'));
						}
					}]
				}
			}, {
				text : '删除',
				handler : function() {
					email_delete(true, false, store_send, Ext
									.getCmp('emailsendbox'));
				}
			}]
		})
// 草稿箱右键菜单
var menu_straw = Ext.create('Ext.menu.Menu', {
	margin : '0 0 10 0',
	items : [{
		text : '删除',
		handler : function() {
			email_delete(true, false, store_straw, Ext.getCmp('emailstrawbox'));
		}
	}, {
		text : '发送',
		handler : function() {
			sendSecond(false, Ext.getCmp('emailstrawbox'));
		}
	}]
})
// 垃圾箱右键菜单
var menu_dustbin = Ext.create('Ext.menu.Menu', {
			width : 30,
			height : 65,
			margin : '0 0 10 0',
			items : [{
						text : '还原',
						handler : function() {
							move2back();
						}
					}, {
						text : '彻底删除',
						handler : function() {
							email_delete(false, false, store_dustbin, Ext
											.getCmp('emaildustbinbox'));
						}
					}]
		})
// 收件箱--分页栏已经修改
var rec_filter;
var receive = function() {
	var tabpanel = Ext.getCmp('eamilMain');
	var recTab = tabpanel.getComponent('receive');
	tabpanel.autoScroll = false;
	store_rec.load();
	if (!recTab) {
		recTab = tabpanel.add({
			title : '收件箱',
			closable : true,
			iconCls : 'email-recBox',
			autoScorll : false,
			id : 'receive',
			layout : 'fit',
			bbar : Ext.create('Ext.PagingToolbar', {
				store : store_rec,
				displayInfo : true,
				displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>封邮件"
			}),

			tbar : ['-', {
						text : '删除',
						handler : function() {
							move2DustbinRecord();
						}
					}, '-', {
						xtype : 'splitbutton',
						text : '标记为',
						menu : [{
									text : '已读',
									handler : function() {
										switchIsRead(true);
									}
								}, {
									text : '未读',
									handler : function() {
										switchIsRead(false);
									}
								}]
					}, '-', {
						xtype : 'splitbutton',
						text : '查看',
						menu : [{
									text : '全部',
									handler : function() {
										rec_filter = null;
										store_rec.load();
									}
								}, {
									text : '已读',
									handler : function() {
										rec_filter = true;
										store_rec.load({
													params : {
														'query' : true
													}
												});
									}
								}, {
									text : '未读',
									handler : function() {
										rec_filter = false;
										store_rec.load({
													params : {
														'query' : false
													}
												});
									}
								}]
					}, '-'],
			items : [{
						xtype : 'emailrecbox'
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
	tabpanel.setActiveTab(recTab);
}
// 收件箱grid
Ext.define('EmailRecBox', {
			extend : 'Ext.ux.LiveSearchGridPanel',
			alias : 'widget.emailrecbox',
			id : 'emailrecbox',
			loadMask : {
				msg : '正在加载数据,请稍等......'
			},
			frame : true,
			forceFit : true,
			selType : 'checkboxmodel',
			store : store_rec,
			multiSelect : true,
			columns : [{
						header : '发件人',
						dataIndex : 'userSend'
					}, {
						header : '主题',
						dataIndex : 'emailTitle'
					}, {
						header : '时间',
						dataIndex : 'emailDate'
					}, {
						header : '状态',
						dataIndex : 'isRead',
						renderer : function(v) {
							if (v == 'true' || v) {
								return '已读'
							} else {
								return "<span style='color:red'>未读</span>"

							}
						}
					}],
			listeners : {
				render : function() {
				},
				itemcontextmenu : function(view, record, item, index, e, eOpts) {
					e.preventDefault();
					menu_rec.showAt(e.getXY());
				},
				containercontextmenu : function(view, e, eOpts) {
					menu_rec.showAt(e.getXY());
				},
				itemdblclick : function(view, record, item, index, e, eOpts) {
					showRec(record);
				}
			}

		});// 收件箱grid
// 搜索grid
Ext.define('EmailSearchBox', {
			extend : 'Ext.ux.LiveSearchGridPanel',
			alias : 'widget.emailSearchbox',
			id : 'emailSearchbox',
			loadMask : {
				msg : '正在加载数据,请稍等......'
			},
			frame : true,
			forceFit : true,
			store : store_email_search,
			multiSelect : true,
			columns : [{
						xtype : 'rownumberer'
					}, {
						header : '发件人',
						dataIndex : 'userSend'
					}, {
						header : '收件人',
						dataIndex : 'userAccept'
					}, {
						header : '主题',
						dataIndex : 'emailTitle'
					}, {
						header : '时间',
						dataIndex : 'emailDate'
					}, {
						header : '位置',
						dataIndex : 'emailJudge',
						renderer : function(v) {
							if (v == 0 || v == '0') {
								return '已发送'
							} else if (v == 1 || v == '1') {
								return "草稿稿"
							} else if (v == 2 || v == '2') {
								return "垃圾箱"
							} else {
								return "收件箱"
							}
						}
					}],
			listeners : {
				render : function() {
				},
				itemcontextmenu : function(view, record, item, index, e, eOpts) {
					e.preventDefault();
					menu_rec.showAt(e.getXY());
				},
				containercontextmenu : function(view, e, eOpts) {
					menu_rec.showAt(e.getXY());
				},
				itemdblclick : function(view, record, item, index, e, eOpts) {
					showSearchOrDustbin(record);
				}
			}

		});
// 已发送grid
Ext.define('EmailSendBox', {
			extend : 'Ext.grid.Panel',
			alias : 'widget.emailsendbox',
			id : 'emailsendbox',
			store : store_send,
			forceFit : true,
			loadMask : {
				msg : '正在加载数据,请稍等......'
			},
			frame : true,
			multiSelect : true,
			selType : 'checkboxmodel',
			columns : [{
						header : '收件人',
						dataIndex : 'userAccept'
					}, {
						header : '主题',
						dataIndex : 'emailTitle'
					}, {
						header : '时间',
						dataIndex : 'emailDate'
					}],
			listeners : {
				itemcontextmenu : function(view, record, item, index, e, eOpts) {
					e.preventDefault();
					menu_send.showAt(e.getXY());
				},
				containercontextmenu : function(view, e, eOpts) {
					menu_send.showAt(e.getXY());
				},
				itemdblclick : function(view, record, item, index, e, eOpts) {
					showSend(record);
				}
			}
		});
// 草稿箱grid
Ext.define('EmailstrawBox', {
			extend : 'Ext.grid.Panel',
			alias : 'widget.emailstrawbox',
			id : 'emailstrawbox',
			store : store_straw,
			loadMask : {
				msg : '正在加载数据,请稍等......'
			},
			forceFit : true,
			frame : true,
			multiSelect : true,
			selType : 'checkboxmodel',
			columns : [{
						header : '收件人',
						width : 180,
						dataIndex : 'userAccept'
					}, {
						header : '主题',
						width : 550,
						dataIndex : 'emailTitle'
					}, {
						header : '时间',
						width : 180,
						dataIndex : 'emailDate'
					}],
			listeners : {
				itemcontextmenu : function(view, record, item, index, e, eOpts) {
					e.preventDefault();
					menu_straw.showAt(e.getXY());
				},
				containercontextmenu : function(view, e, eOpts) {
					menu_straw.showAt(e.getXY());
				},
				itemdblclick : function(view, record, item, index, e, eOpts) {
					writerByEdit(record, true, true);
				}
			}
		});
// 垃圾箱grid
Ext.define('EmaildustbinBox', {
			extend : 'Ext.grid.Panel',
			alias : 'widget.emaildustbinbox',
			id : 'emaildustbinbox',
			store : store_dustbin,
			loadMask : {
				msg : '正在加载数据,请稍等......'
			},
			forceFit : true,
			frame : true,
			multiSelect : true,
			selType : 'checkboxmodel',
			columns : [{
						header : '发件人',
						dataIndex : 'userSend'
					}, {
						header : '主题',
						dataIndex : 'emailTitle'
					}, {
						header : '时间',
						dataIndex : 'emailDate'
					}],
			listeners : {
				itemcontextmenu : function(view, record, item, index, e, eOpts) {
					e.preventDefault();
					menu_dustbin.showAt(e.getXY());
				},
				containercontextmenu : function(view, e, eOpts) {
					menu_dustbin.showAt(e.getXY());
				},
				itemdblclick : function(view, record, item, index, e, eOpts) {
					showSearchOrDustbin(record);
				}
			}
		});
// 已发送
var send = function() {
	var tabpanel = Ext.getCmp('eamilMain');
	var sendTab = tabpanel.getComponent('send');
	tabpanel.autoScroll = false;
	store_send.load();
	if (!sendTab) {
		sendTab = tabpanel.add({
			title : '已发送',
			closable : true,
			iconCls : 'email-sendBox',
			autoScorll : false,
			id : 'send',
			layout : 'fit',
			bbar : Ext.create('Ext.PagingToolbar', {
				store : store_send,
				displayInfo : true,
				displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>封邮件"
			}),

			tbar : ['-', {
				text : '删除',
				handler : function() {
					email_delete(true, false, store_send, Ext
									.getCmp('emailsendbox'));
				}
			}, '-', {
				xtype : 'splitbutton',
				text : '移动到',
				menu : [{
							text : '草稿箱',
							handler : function() {
								save2strawByrecord(false, Ext
												.getCmp('emailsendbox'));
							}
						}]
			}, '-'],
			items : [{
						xtype : 'emailsendbox'
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
	tabpanel.setActiveTab(sendTab);
}
// 草稿箱
var straw = function() {
	var tabpanel = Ext.getCmp('eamilMain');
	var strawTab = tabpanel.getComponent('straw');
	tabpanel.autoScroll = false;
	store_straw.load();
	if (!strawTab) {
		strawTab = tabpanel.add({
			title : '草稿箱',
			closable : true,
			autoScorll : false,
			id : 'straw',
			iconCls : 'email-straw',
			layout : 'fit',
			bbar : Ext.create('Ext.PagingToolbar', {
				store : store_straw,
				displayInfo : true,
				displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>封邮件"
			}),

			tbar : ['-', {
				text : '删除',
				handler : function() {
					email_delete(true, false, store_straw, Ext
									.getCmp('emailstrawbox'));
				}
			}, '-', {
				text : '发送',
				handler : function() {
					sendSecond(false, Ext.getCmp('emailstrawbox'))
				}
			}, '-'],
			items : [{
						xtype : 'emailstrawbox'
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
	tabpanel.setActiveTab(strawTab);
}
// 垃圾箱
var dustbin = function() {
	var tabpanel = Ext.getCmp('eamilMain');
	var dustbinTab = tabpanel.getComponent('dustbin');
	tabpanel.autoScroll = false;
	store_dustbin.load();
	if (!dustbinTab) {
		dustbinTab = tabpanel.add({
			title : '垃圾箱',
			closable : true,
			iconCls : 'email-dustbin',
			autoScorll : false,
			id : 'dustbin',
			layout : 'fit',
			bbar : Ext.create('Ext.PagingToolbar', {
				store : store_dustbin,
				displayInfo : true,
				displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>封邮件"
			}),

			tbar : ['-', {
				text : '彻底删除',
				handler : function() {
					email_delete(false, false, store_dustbin, Ext
									.getCmp('emaildustbinbox'));
				}
			}, '-', {
				text : '还原',
				handler : function() {
					move2back();
				}
			}, '-'],
			items : [{
						xtype : 'emaildustbinbox'
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
	tabpanel.setActiveTab(dustbinTab);
}
// 搜索
var emailSearch = function() {
	var tabpanel = Ext.getCmp('eamilMain');
	var emailSearch = tabpanel.getComponent('emailSearch');
	tabpanel.autoScroll = false;
	if (!emailSearch) {
		emailSearch = tabpanel.add({
			title : '搜索结果',
			closable : true,
			autoScorll : false,
			iconCls : 'email_search',
			id : 'emailSearch',
			layout : 'fit',
			bbar : Ext.create('Ext.PagingToolbar', {
				store : store_email_search,
				displayInfo : true,
				displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>封邮件"
			}),
			items : [{
						xtype : 'emailSearchbox'
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
	tabpanel.setActiveTab(emailSearch);
}
// 关闭正在写的窗口
var closeWriter = function(id, update) {
	var accept;
	var title;
	var writerPanel;
	var tabpanel = Ext.getCmp('eamilMain');
	if (id) {
		writerPanel = tabpanel.getComponent('writer' + id);
		accept = Ext.getCmp('userAccept_form' + id).value;
		title = Ext.getCmp('emailTitle_form' + id).value;
	} else {
		writerPanel = tabpanel.getComponent('writer');
		accept = Ext.getCmp('userAccept_form').value;
		title = Ext.getCmp('emailTitle_form').value;
	}
	if (accept && title) {
		Ext.Msg.confirm('提示', '是否保存草稿？', function callBack(result) {
					if (result == 'yes') {
						if (id) {
							save2straw('email_edit_form' + id,
									'filebar_edit_form' + id, update);
						} else {
							save2straw('email_form', 'filebar', update);
						}
					} else {
						tabpanel.remove(writerPanel);
					}
				});
	} else {
		tabpanel.remove(writerPanel);
	}
}
// 写信
var writer = function() {
	var tabpanel = Ext.getCmp('eamilMain');
	var wrierTab = tabpanel.getComponent('writer');
	tabpanel.autoScroll = true;
	if (!wrierTab) {
		wrierTab = tabpanel.add({
			title : '写信',
			layout : 'fit',
			closable : true,
			id : 'writer',
			items : [{
				xtype : 'panel',
				layout : 'column',
				autoScroll : true,
				bbar : ['-', {
							text : '发送',
							handler : function() {
								sendEmailForm('email_form', 'filebar', false);
							}
						}, '-', {
							text : '存草稿',
							handler : function() {
								save2straw('email_form', 'filebar', false);
							}
						}, '-', {
							text : '取消',
							handler : function() {
								closeWriter();
							}
						}, '-'],
				tbar : ['-', {
							text : '发送',
							handler : function() {
								sendEmailForm('email_form', 'filebar', false);
							}
						}, '-', {
							text : '存草稿',
							handler : function() {
								save2straw('email_form', 'filebar', false);
							}
						}, '-', {
							text : '取消',
							handler : function() {
								closeWriter();
							}
						}],
				items : [{
					xtype : 'form',
					id : 'email_form',
					layout : 'column',
					columnWidth : .82,
					defaults : {
						columnWidth : 1
					},
					defaultType : 'textfield',
					padding : '10 0 0 0',
					items : [{
								xtype : 'label',
								padding : '10 0 0 0',
								margin : '10 0 0 10',
								html : '发件人:' + '<span style="margin-left:15px;"></span>'+Ext.getCmp('current_user').text
							}, {
								fieldLabel : '收件人',
								afterLabelTextTpl : required,
								readOnly : true,
								name : 'userAccept',
								id : 'userAccept_form',
								labelWidth : 50,
								margin : '10 0 0 10',
								allowBlank : false,
								columnWidth : .85
							}, {
								xtype : 'button',
								text : '清空',
								margin : '10 0 0 30',
								columnWidth : .1,
								handler : function() {
									Ext.getCmp('userAccept_form').setValue('');
								}
							}, {
								fieldLabel : '主题',
								afterLabelTextTpl : required,
								name : 'emailBox.emailTitle',
								id : 'emailTitle_form',
								labelWidth : 50,
								margin : '10 0 0 10',
								allowBlank : false
							}, {
								xtype : 'toolbar',
								id : 'filebar',
								vertical : true,
								name : 'emailAttachments',
								margin : '0 0 0 66'
							}, {
								xtype : 'fileuploadfield',
								buttonOnly : true,
								hideLabel : false,
								labelAlign : 'top',
								id : 'fileupload',
								buttonText : '上传附件',
								name : 'emailAtt',
								margin : '0 0 0 70',
								listeners : {
									render : function() {
										Ext.Ajax.request({
											url : '../../../email/email!getCurrentUserPower',
											success : function(res) {
												var index = parseInt(res.responseText);
												Ext
														.getCmp('fileupload')
														.setFieldLabel("最大<span style='color:red'>"
																+ index
																* 20
																+ "M</span>");

											},
											failure : function(res) {
											}
										});
									},
									'change' : function(fb, v) {
										var form = Ext.getCmp('email_form')
												.getForm();
										if (form.isValid()) {
											var bar = Ext.getCmp('filebar');
											if (bar.getComponent(v)) {
												Ext.Msg.alert('提示', "<span style='color:red'>此文件已存在</span>");
												return;
											}
											bar.add({
												iconCls : 'wb_attach',
												id : v,
												myurl : v,
												html : v
														+ "<span style='color:red;margin-left:20px;'>删除</span>",
												handler : function() {
													bar.remove(this);
													if (bar.getComponent(v
															+ 'pro')) {
														bar.remove(v + 'pro');
													}
													Ext.Ajax.request({
														url : '../../../email/email!deleteFile',
														params : {
															fileName : Ext
																	.getCmp(v
																			+ record.data.emailId).myurl
														},
														success : function(res) {
														}
													});
												}
											}, {
												xtype : 'progressbar',
												text : '进行中',
												id : v + 'pro'
											});
											var pro = Ext.getCmp(v + 'pro');
											pro.wait({
														interval : 500,
														duration : 50000,
														text : '进行中...',
														increment : 10
													});

											form.submit({
												params : {
													form : 'no'
												},
												url : '../../../email/email!uploadFile',
												success : function(form, action) {
													bar.remove(pro);
													Ext.getCmp(v).myurl = action.result.msg;
												},
												failure : function(form, action) {
													bar.remove(v)
													bar.remove(pro)
													Ext.Msg.alert('提示',
															"<span style='color:red'>"+action.result.msg+"</span>");
												}
											})
										}
									}
								}
							}, {
								xtype : 'label',
								padding : '10 0 0 10',
								text : '内容:'
							}, {
								xtype : 'htmleditor',
								name : 'emailBox.emailContent',
								height : 280,
								margin : '10 0 0 10'
							}],
					listeners : {
						render : function(p) {
							p.getEl().on("contextmenu", function(e) {// 右键事件
										e.preventDefault();
										menu_writer.showAt(e.getXY());
									})
						}
					}
				}, {
					xtype : 'treepanel',
					columnWidth : .18,
					autoScroll : true,
					height : 480,
					id : 'tree_communication',
					store : userTreeStore1,
					useArrows : true,
					rootVisible : true,
					multiSelect : true,
					root : {
						userName : "联系人",
						expanded : true
					},
					columns : [{
								xtype : 'treecolumn',
								text : '姓名	',
								flex : 1.5,
								dataIndex : 'userName'
							}, {
								text : '职位',
								flex : 1,
								dataIndex : 'positionName'
							}],
					listeners : {
						itemdblclick : function(View, record, item, index, e,
								eOpts) {
							if (record.data.leaf) {
								var userAccept = Ext.getCmp('userAccept_form');
								var value = userAccept.getValue();
								userAccept.setValue(value
										+ record.data.userName + "("
										+ record.data.qtitle + ");");
							} else {
								Ext.Array.each(record.data.children, function(
												item) {
											var userAccept = Ext
													.getCmp('userAccept_form');
											var value = userAccept.getValue();
											userAccept.setValue(value
													+ item.userName + "("
													+ item.qtitle + ");");
										})
							}
						}
					}
				}]
			}]

		});
	}
	tabpanel.setActiveTab(wrierTab);
};
// 发送
var sendEmailForm = function(form, fileBar, panel) {
	var form = Ext.getCmp(form).getForm();
	var fileBar = Ext.getCmp(fileBar);
	var urls = [];
	Ext.Array.each(fileBar.items.items, function(item) {
				urls.push(item.myurl);
			});

	if (form.isValid()) {
		var url = '../../../email/email!send';
		form.submit({
					url : url,
					waitTitle : '提示',
					waitMsg : '正在发送...',
					params : {
						atts : urls
					},
					success : function(form, action) {
						Ext.Msg.alert('提示', '邮件发送成功！');
						form.reset();
						fileBar.removeAll();
						if (panel) {
							var tabpanel = Ext.getCmp('eamilMain');
							tabpanel.remove(Ext.getCmp(panel))
						}
						store_send.load();
					},
					failure : function(form, action) {
					}
				})
	}
}
// 再次发送
var sendSecond = function(record, grid) {
	if (record) {
		Ext.Ajax.request({
					url : '../../../email/email!send',
					params : {
						atts : record.data.emailAttachments,
						userAccept : record.data.userAccept,
						'emailBox.emailTitle' : record.data.emailTitle,
						'emailBox.emailContent' : record.data.emailContent
					},
					success : function(res) {
						Ext.Msg.alert('提示', '邮件发送成功！');
						store_send.load();
					},
					failure : function(res) {
					}
				})
	} else {
		var selModel = grid.getSelectionModel();
		if (selModel.hasSelection()) {
			Ext.Array.each(selModel.getSelection(), function(record) {
				Ext.Ajax.request({
							url : '../../../email/email!send',
							params : {
								atts : record.data.emailAttachments,
								userAccept : record.data.userAccept,
								'emailBox.emailTitle' : record.data.emailTitle,
								'emailBox.emailContent' : record.data.emailContent
							},
							success : function(res) {
							},
							failure : function(res) {
							}
						})
			})
			Ext.Msg.alert('提示', '邮件发送成功！');
			store_send.load();
		} else {
			Ext.Msg.alert('提示', "<span style='color:red'>请至少选择一条数据！</span>");
		}
	}
}
// 左侧的菜单栏
Ext.define('EmailBar', {
			extend : 'Ext.panel.Panel',
			frame : true,
			alias : 'widget.emailbar',
			defaults : {
				bodyStyle : 'padding:15px'
			},
			layoutConfig : {
				titleCollapse : false,
				animate : true,
				activeOnTop : true
			},
			items : [{
						xtype : 'emailbtn'
					}, {
						xtype : 'toolbar',
						dock : 'left',
						border : '0 0 0 0',
						width : 180,
						defaultType : 'button',
						items : [{
									margin : '5 0 0 0',
									iconCls : 'email-recBox',
									text : '收件箱',
									handler : receive
								}, {
									margin : '5 0 0 0',
									iconCls : 'email-sendBox',
									text : '已发送',
									handler : send
								}, {
									margin : '5 0 0 0',
									iconCls : 'email-straw',
									text : '草稿箱',
									handler : straw
								}, {
									margin : '5 0 0 0',
									iconCls : 'email-dustbin',
									text : '垃圾箱',
									handler : dustbin
								}]
					}]

		});
// 左侧菜单上
Ext.define('Emailbtn', {
			frame : true,
			height : 30,
			extend : 'Ext.panel.Panel',
			alias : 'widget.emailbtn',
			buttons : [{
						text : '收信',
						iconCls : 'email-rec',
						margin : '1 0 0 -90',
						handler : receive
					}, {
						text : '写信',
						iconCls : 'email-send',
						margin : '1 5 0 0',
						handler : writer
					}]
		});
// emailApp
Ext.define('MyDesktop.Email', {
	extend : 'Ext.ux.desktop.Module',
	requires : [],
	id : 'email',
	init : function() {
		this.launcher = {
			text : '内部邮箱',
			iconCls : 'email'
		}
	},
	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('email');
		if (!win) {
			win = desktop.createWindow({
				id : 'email',
				title : '内部邮箱',
				width : 600,
				height : 400,
				iconCls : 'email',
				animCollapse : false,
				border : false,
				// maximized : true,
				hideMode : 'offsets',
				autoScroll : true,
				layout : 'border',
				listeners : {
					render : function(p) {
						p.getEl().on("contextmenu", function(e) {// 右键事件
									e.preventDefault();
								})
					}
				},
				items : [{
							id : 'emailBar',
							region : 'west',
							width : 180,
							xtype : 'emailbar'
						}, {
							region : 'north',
							xtype : 'topPanel',
							height : 70,
							border : '1 1 1 1'
						}, {
							id : 'emailbody',
							region : 'center',
							enableTabScroll : true,
							autoScroll : true,
							layout : 'fit',
							items : [{
								xtype : 'tabpanel',
								id : 'eamilMain',
								alias : 'widget.emailmain',
								activeTab : 0,
								layout : 'fit',
								plugins : Ext.create('Ext.ux.TabCloseMenu'),
								items : [{
									title : '首页',
									bodyPadding : 10,
									iconCls : 'wb_home',
									html : '<center style="margin-top:100px;font-size:72px;">多点沟通、少点抱怨<br/>多点理解、少点争执</center>'
								}]
							}]

						}]
			});
		}
		return win;
	}

});
// 显示详细内容-收件箱
var showRec = function(record) {
	if (!record.data.isRead) {
		Ext.Ajax.request({
					url : '../../../email/email!update',
					params : {
						'emailBox.emailId' : record.data.emailId,
						'relationAccept.isRead' : true
					},
					success : function(res) {
						store_rec.load();
					},
					failure : function(res) {
					}
				});
	}
	var tabpanel = Ext.getCmp('eamilMain');
	var showRecTab = tabpanel.getComponent('showRec' + record.data.emailId);
	tabpanel.autoScroll = true;
	if (!showRecTab) {
		showRecTab = tabpanel.add({
			title : record.data.emailTitle,
			closable : true,
			id : 'showRec' + record.data.emailId,
			autoScroll : true,
			iconCls : 'email_title',
			tbar : ['-', {
						text : '回复',
						handler : function() {
							writerByEdit(record, false, false);
						}
					}, '-', {
						text : '转发',
						handler : function() {
							writerByEdit(record, true, false, true);
						}
					},  '-', {
						text : '删除',
						handler : function() {
							move2DustbinRecord(record, showRecTab);
						}
					}, '-'],
			bbar : [{
						text : '回复',
						handler : function() {
							writerByEdit(record, false, false);
						}
					}, '-', {
						text : '转发',
						handler : function() {
							writerByEdit(record, true, false, true);
						}
					},  '-', {
						text : '删除',
						handler : function() {
							move2DustbinRecord(record, showRecTab);
						}
					}, '-'],
			items : [{
						xtype : 'form',
						layout : 'anchor',
						defaults : {
							anchor : '100%'
						},
						frame : true,
						items : [{
									xtype : 'label',
									margin : '10 0 0 20',
									text : record.data.emailTitle
								}, {
									xtype : 'fieldset',
									title : '完整信息',
									layout : 'anchor',
									defaults : {
										anchor : '100%',
										margin : '5 10 10 10'
									},
									collapsible : true,
									defaultType : 'label',
									margin : '10 10 10 10',
									items : [{
												text : '发件人:'
														+ record.data.userSend,
												listeners : {
													move : function() {
														alert(true);
													}
												}
											}, {
												text : '时间:'
														+ record.data.emailDate
											}, {

												text : '收件人:'
														+ record.data.userAccept
											}]
								}]
					}, {
						xtype : 'toolbar',
						id : 'recfileBar' + record.data.emailId,
						vertical : true,
						items : []
					}, {
						xtype : 'panel',
						margin : '5 20 5 20',
						autoScroll : true,
						html : record.data.emailContent
					}, {
						xtype : 'form',
						layout : 'fit',
						id : 'quick_form' + record.data.emailId,
						margin : '20 20 5 20',
						frame : true,
						items : [{
							xtype : 'textarea',
							height : 20,
							id : 'quick_emailContent' + record.data.emailId,
							autoScroll : true,
							emptyText : '快速回复给：' + record.data.userSend,
							listeners : {
								focus : function(cmp, EventObject, eOpts) {
									var quickSend = Ext.getCmp('quickSend'
											+ record.data.emailId);
									quickSend.setVisible(true);
									cmp.setHeight(50);

								},
								blur : function(cmp, EventObject, eOpts) {
									if (cmp.getValue() == '') {
										var quickSend = Ext.getCmp('quickSend'
												+ record.data.emailId);
										cmp.setHeight(20);
										quickSend.setVisible(false);
									}
								}
							}
						}],
						buttons : [{
							text : '发送',
							id : 'quickSend' + record.data.emailId,
							hidden : true,
							handler : function() {
								Ext.Ajax.request({
									url : '../../../email/email!quickSend',
									params : {
										'userAccept' : record.data.userSend,
										'emailBox.emailContent' : Ext
												.getCmp('quick_emailContent'
														+ record.data.emailId).value
									},
									success : function(res) {
										if (res.responseText == 'true') {
											Ext.Msg.alert('提示', '操作成功！');
											Ext.getCmp('quick_form'
													+ record.data.emailId)
													.getForm().reset();
											var quickSend = Ext
													.getCmp('quickSend'
															+ record.data.emailId);
											var cmp = Ext
													.getCmp('quick_emailContent'
															+ record.data.emailId);
											cmp.setHeight(20);
											quickSend.setVisible(false);
										}
									},
									failure : function(res) {
									}
								});
							}
						}]
					}],
			listeners : {
				render : function(p) {
					if (record.data.emailAttachments != '') {
						var bar = Ext
								.getCmp('recfileBar' + record.data.emailId);
						var items = record.data.emailAttachments;
						Ext.Array.each(items, function(name, index, self) {
							bar.add({
								iconCls : 'wb_attach',
								padding : '0 0 0 0',
								html : name.substr(name.indexOf('/') + 1, name
												.lastIndexOf('_')
												- name.indexOf('/') - 1)
										+ name.substr(name.lastIndexOf('.'))
										+ "<span style='color:red;margin-left:20px;'>打开</span>",
								handler : function() {
									location.href = '../../../email/email?fileName='
											+ name
											+ '&sendID='
											+ record.data.userSend;
								}
							});
						});

					}
					p.getEl().on("contextmenu", function(e) {
								e.preventDefault();
							})
				}
			}

		});
	}
	tabpanel.setActiveTab(showRecTab);
}
// 显示详细内容-已发送
var showSend = function(record) {
	var tabpanel = Ext.getCmp('eamilMain');
	var showSendTab = tabpanel.getComponent('showSend' + record.data.emailId);
	tabpanel.autoScroll = true;
	if (!showSendTab) {
		showSendTab = tabpanel.add({
			title : record.data.emailTitle,
			closable : true,
			iconCls : 'email_title',
			id : 'showSend' + record.data.emailId,
			autoScroll : true,
			tbar : ['-', {
						text : '再次发送',
						handler : function() {
							sendSecond(record);
						}
					}, '-', {
						text : '转发',
						handler : function() {
							writerByEdit(record, true, false, true);
						}
					}, '-', '-', {
						text : '删除',
						handler : function() {
							email_delete(true, record, store_send, false,
									showSendTab);
						}
					}, '-', {
						xtype : 'splitbutton',
						text : '移动到',
						menu : [{
									text : '草稿箱',
									handler : function() {
										save2strawByrecord(record, false,
												showSendTab);
									}
								}]
					}, '-'],
			bbar : ['-', {
						text : '再次发送',
						handler : function() {
							sendSecond(record);
						}
					}, '-', {
						text : '转发',
						handler : function() {
							writerByEdit(record, true, false, true);
						}
					}, '-', '-', {
						text : '删除',
						handler : function() {
							email_delete(true, record, store_send, false,
									showSendTab);
						}
					}, '-', {
						xtype : 'splitbutton',
						text : '移动到',
						menu : [{
									text : '草稿箱',
									handler : function() {
										save2strawByrecord(record, false,
												showSendTab);
									}
								}]
					}, '-'],
			items : [{
						xtype : 'form',
						layout : 'anchor',
						id : 'recForm' + record.data.emailId,
						defaults : {
							anchor : '100%'
						},
						frame : true,
						items : [{
									xtype : 'label',
									margin : '10 0 0 20',
									text : record.data.emailTitle
								}, {
									xtype : 'fieldset',
									title : '完整信息',
									layout : 'anchor',
									defaults : {
										anchor : '100%',
										margin : '5 10 10 10'
									},
									collapsible : true,
									defaultType : 'label',
									margin : '10 10 10 10',
									items : [{
												text : '发件人:'
														+ record.data.userSend,
												listeners : {
													move : function() {
														alert(true);
													}
												}
											}, {
												text : '时间:'
														+ record.data.emailDate
											}, {

												text : '收件人:'
														+ record.data.userAccept
											}]
								}]
					}, {
						xtype : 'toolbar',
						id : 'recfileBar' + record.data.emailId,
						vertical : true,
						items : []
					}, {
						xtype : 'panel',
						margin : '5 20 5 20',
						autoScroll : true,
						html : record.data.emailContent
					}],
			listeners : {
				render : function(p) {
					if (record.data.emailAttachments != '') {
						var bar = Ext
								.getCmp('recfileBar' + record.data.emailId);
						var items = record.data.emailAttachments;
						Ext.Array.each(items, function(name, index, self) {
							bar.add({
								iconCls : 'wb_attach',
								padding : '0 0 0 0',
								myurl : name,
								html : name.substr(name.indexOf('/') + 1, name
												.lastIndexOf('_')
												- name.indexOf('/') - 1)
										+ name.substr(name.lastIndexOf('.'))
										+ "<span style='color:red;margin-left:20px;'>打开</span>",
								handler : function() {
									location.href = '../../../email/email?fileName='
											+ name
											+ '&sendID='
											+ record.data.userSend;
								}
							});
						});
					}
					p.getEl().on("contextmenu", function(e) {
								e.preventDefault();
							})
				}
			}

		});
	}
	tabpanel.setActiveTab(showSendTab);
}
// 显示详细内容-搜索或者垃圾
var showSearchOrDustbin = function(record) {
	var tabpanel = Ext.getCmp('eamilMain');
	var showSearchOrDustbin = tabpanel.getComponent('showSearchOrDustbin'
			+ record.data.emailId);
	tabpanel.autoScroll = true;
	if (!showSearchOrDustbin) {
		showSearchOrDustbin = tabpanel.add({
			title : record.data.emailTitle,
			closable : true,
			iconCls : 'email_title',
			id : 'showSearchOrDustbin' + record.data.emailId,
			autoScroll : true,
			items : [{
						xtype : 'form',
						layout : 'anchor',
						id : 'recForm' + record.data.emailId,
						defaults : {
							anchor : '100%'
						},
						frame : true,
						items : [{
									xtype : 'label',
									margin : '10 0 0 20',
									text : record.data.emailTitle
								}, {
									xtype : 'fieldset',
									title : '完整信息',
									layout : 'anchor',
									defaults : {
										anchor : '100%',
										margin : '5 10 10 10'
									},
									collapsible : true,
									defaultType : 'label',
									margin : '10 10 10 10',
									items : [{
												text : '发件人:'
														+ record.data.userSend,
												listeners : {
													move : function() {
														alert(true);
													}
												}
											}, {
												text : '时间:'
														+ record.data.emailDate
											}, {

												text : '收件人:'
														+ record.data.userAccept
											}]
								}]
					}, {
						xtype : 'toolbar',
						id : 'recfileBar' + record.data.emailId,
						vertical : true,
						items : []
					}, {
						xtype : 'panel',
						margin : '5 20 5 20',
						autoScroll : true,
						html : record.data.emailContent
					}],
			listeners : {
				render : function(p) {
					if (record.data.emailAttachments != '') {
						var bar = Ext
								.getCmp('recfileBar' + record.data.emailId);
						var items = record.data.emailAttachments;
						Ext.Array.each(items, function(name, index, self) {
							bar.add({
								iconCls : 'wb_attach',
								padding : '0 0 0 0',
								myurl : name,
								html : name.substr(name.indexOf('/') + 1, name
												.lastIndexOf('_')
												- name.indexOf('/') - 1)
										+ name.substr(name.lastIndexOf('.'))
										+ "<span style='color:red;margin-left:20px;'>打开</span>",
								handler : function() {
									location.href = '../../../email/email?fileName='
											+ name
											+ '&sendID='
											+ record.data.userSend;
								}
							});
						});
					}
					p.getEl().on("contextmenu", function(e) {
								e.preventDefault();
							})
				}
			}

		});
	}
	tabpanel.setActiveTab(showSearchOrDustbin);
}
// 移到垃圾箱
var move2DustbinRecord = function(record, panel) {
	if (record) {
		Ext.Ajax.request({
					url : '../../../email/email!update',
					params : {
						'emailBox.emailId' : record.data.emailId,
						'relationAccept.judge' : 2
					},
					success : function(res) {
						if (panel) {
							var tabpanel = Ext.getCmp('eamilMain');
							tabpanel.remove(panel);
						}

					},
					failure : function(res) {
					}
				});
	} else {
		var grid = Ext.getCmp('emailrecbox');
		var selModel = grid.getSelectionModel();
		if (selModel.hasSelection()) {
			Ext.Array.each(selModel.getSelection(), function(record) {
						Ext.Ajax.request({
									url : '../../../email/email!update',
									params : {
										'emailBox.emailId' : record.data.emailId,
										'relationAccept.judge' : 2
									},
									success : function(res) {
									},
									failure : function(res) {
									}
								});
					})

		} else {
			Ext.Msg.alert('提示', "<span style='color:red'>请至少选择一条数据！</span>");
		}
	}
	if (rec_filter != null) {
		store_rec.load({
					params : {
						'query' : rec_filter
					}
				});
	} else {
		store_rec.load();
	}

}
// 彻底删除
var email_delete = function(send, record, store, grid, panel) {
	if (record) {
		Ext.Msg.confirm('提示', '你确定要删除吗？', function callBack(id) {
					if (id == 'yes') {
						Ext.Ajax.request({
									url : '../../../email/email!delete',
									params : {
										'emailBox.emailId' : record.data.emailId,
										send : send
									},
									success : function(res) {
										if (res.responseText == 'true') {
											store.load();
											if (panel) {
												var tabpanel = Ext
														.getCmp('eamilMain');
												tabpanel.remove(panel);
											}
										}

									},
									failure : function(res) {
									}
								});
					}
				});
	} else {
		var selModel = grid.getSelectionModel();
		if (selModel.hasSelection()) {
			Ext.Msg.confirm('提示', '你确定要删除吗？', function callBack(id) {
				if (id == 'yes') {
					Ext.Array.each(selModel.getSelection(), function(record) {
						Ext.Ajax.request({
									url : '../../../email/email!delete',
									params : {
										'emailBox.emailId' : record.data.emailId,
										send : send
									},
									success : function(res) {
									},
									failure : function(res) {
									}
								});
						store.load();
					});
				}
			});
		} else {
			Ext.Msg.alert('提示', "<span style='color:red'>请至少选择一条数据！</span>");
		}
	}

}
// 标记为已读或未读
var switchIsRead = function(value) {
	var grid = Ext.getCmp('emailrecbox');
	var selModel = grid.getSelectionModel();
	if (selModel.hasSelection()) {
		Ext.Array.each(selModel.getSelection(), function(record) {
					Ext.Ajax.request({
								url : '../../../email/email!update',
								params : {
									'emailBox.emailId' : record.data.emailId,
									'relationAccept.isRead' : value
								},
								success : function(res) {
								},
								failure : function(res) {
								}
							});
				})
		store_rec.load();
	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请至少选择一条数据！</span>");
	}
}
// 加载后再发送
var writerByEdit = function(record, edit, update, clear) {
	var tabpanel = Ext.getCmp('eamilMain');
	var wrierTab = tabpanel.getComponent('writer' + record.data.emailId);
	tabpanel.autoScroll = true;
	var title = '写信';
	if (edit) {
		title = record.data.emailTitle
	}
	if (!wrierTab) {
		wrierTab = tabpanel.add({
			title : title,
			layout : 'fit',
			iconCls : 'email-send',
			closable : true,
			id : 'writer' + record.data.emailId,
			items : [{
				xtype : 'panel',
				layout : 'column',
				autoScroll : true,
				bbar : ['-', {
					text : '发送',
					handler : function() {
						sendEmailForm('email_edit_form' + record.data.emailId,
								'filebar_edit_form' + record.data.emailId,
								'writer' + record.data.emailId);
					}
				}, '-', {
					text : '存草稿',
					handler : function() {
						save2straw('email_edit_form' + record.data.emailId,
								'filebar_edit_form' + record.data.emailId,
								update);
					}
				}, '-', {
					text : '取消',
					handler : function() {
						closeWriter(record.data.emailId, update);
					}
				}, '-'],
				tbar : ['-', {
					text : '发送',
					handler : function() {
						sendEmailForm('email_edit_form' + record.data.emailId,
								'filebar_edit_form' + record.data.emailId,
								'writer' + record.data.emailId);
					}
				}, '-', {
					text : '存草稿',
					handler : function() {
						save2straw('email_edit_form' + record.data.emailId,
								'filebar_edit_form' + record.data.emailId,
								update);
					}
				}, '-', {
					text : '取消',
					handler : function() {
						closeWriter(record.data.emailId, update);
					}
				}, '-'],
				items : [{
					xtype : 'form',
					id : 'email_edit_form' + record.data.emailId,
					layout : 'column',
					columnWidth : .82,
					defaults : {
						columnWidth : 1
					},
					defaultType : 'textfield',
					padding : '10 0 0 0',
					items : [{
								xtype : 'hiddenfield',
								name : 'emailBox.emailId',
								value : record.data.emailId
							}, {
								xtype : 'label',
								padding : '10 0 0 0',
								margin : '10 0 0 10',
								html : '发件人:' + '<span style="margin-left:15px;"></span>'+Ext.getCmp('current_user').text
							}, {
								fieldLabel : '收件人',
								afterLabelTextTpl : required,
								readOnly : true,
								id : 'userAccept_form' + record.data.emailId,
								name : 'userAccept',
								labelWidth : 50,
								margin : '10 0 0 10',
								columnWidth : .85,
								allowBlank : false
							}, {
								xtype : 'button',
								text : '清空',
								margin : '10 0 0 30',
								columnWidth : .1,
								handler : function() {
									Ext.getCmp('userAccept_form'
											+ record.data.emailId).setValue('');
								}
							}, {
								fieldLabel : '主题',
								afterLabelTextTpl : required,
								name : 'emailBox.emailTitle',
								id : 'emailTitle_form' + record.data.emailId,
								labelWidth : 50,
								margin : '10 0 0 10',
								allowBlank : false
							}, {
								xtype : 'toolbar',
								id : 'filebar_edit_form' + record.data.emailId,
								vertical : true,
								name : 'emailAttachments',
								margin : '0 0 0 66'
							}, {
								xtype : 'fileuploadfield',
								buttonOnly : true,
								hideLabel : false,
								labelAlign : 'top',
								id : 'fileupload' + record.data.emailId,
								buttonText : '上传附件',
								name : 'emailAtt',
								margin : '0 0 0 70',
								listeners : {
									render : function() {
										Ext.Ajax.request({
											url : '../../../email/email!getCurrentUserPower',
											success : function(res) {
												var index = parseInt(res.responseText);
												Ext
														.getCmp('fileupload'
																+ record.data.emailId)
														.setFieldLabel("最大<span style='color:red'>"
																+ index
																* 20
																+ "M</span>");

											},
											failure : function(res) {
											}
										});
									},
									'change' : function(fb, v) {
										var form = Ext.getCmp('email_edit_form'
												+ record.data.emailId)
												.getForm();
										if (form.isValid()) {
											var bar = Ext
													.getCmp('filebar_edit_form'
															+ record.data.emailId);
											if (bar.getComponent(v)) {
												Ext.Msg.alert('提示', "<span style='color:red'>此文件已存在</span>");
												return;
											}
											bar.add({
												iconCls : 'wb_attach',
												id : v + record.data.emailId,
												myurl : v,
												html : v
														+ "<span style='color:red;margin-left:20px;'>删除</span>",
												handler : function() {
													bar.remove(this);
													if (bar
															.getComponent(v
																	+ record.data.emailId
																	+ 'pro')) {
														bar
																.remove(v
																		+ record.data.emailId
																		+ 'pro');
													}
													Ext.Ajax.request({
														url : '../../../email/email!deleteFile',
														params : {
															fileName : Ext
																	.getCmp(v
																			+ record.data.emailId).myurl
														},
														success : function(res) {
														}
													});
												}
											}, {
												xtype : 'progressbar',
												text : '进行中',
												id : v + record.data.emailId
														+ 'pro'
											});
											var pro = Ext.getCmp(v
													+ record.data.emailId
													+ 'pro');
											pro.wait({
														interval : 500,
														duration : 50000,
														text : '进行中...',
														increment : 10
													});

											form.submit({
												params : {
													form : 'no'
												},
												url : '../../../email/email!uploadFile',
												success : function(form, action) {
													bar.remove(pro);
													Ext
															.getCmp(v
																	+ record.data.emailId).myurl = action.result.msg;
												},
												failure : function(form, action) {
													bar.remove(v)
													bar.remove(pro)
													Ext.Msg.alert('提示',
															"<span style='color:red'>"+action.result.msg+"</span>");
												}
											})
										}
									}
								}
							}, {
								xtype : 'label',
								padding : '10 0 0 10',
								text : '内容:'
							}, {
								xtype : 'htmleditor',
								name : 'emailBox.emailContent',
								id : 'emailContent_form' + record.data.emailId,
								height : 280,
								margin : '10 0 0 10'
							}],
					listeners : {
						render : function(p) {
							p.getEl().on("contextmenu", function(e) {// 右键事件
										e.preventDefault();
									})
						}
					}
				}, {
					xtype : 'treepanel',
					columnWidth : .18,
					autoScroll : true,
					height : 480,
					id : 'tree_communication' + record.data.emailId,
					store : userTreeStore1,
					useArrows : true,
					rootVisible : true,
					multiSelect : true,
					root : {
						userName : "联系人",
						expanded : true
					},
					columns : [{
								xtype : 'treecolumn',
								text : '姓名	',
								flex : 1.5,
								dataIndex : 'userName'
							}, {
								text : '职位',
								flex : 1,
								dataIndex : 'positionName'
							}],
					listeners : {
						itemdblclick : function(View, rec, item, index, e,
								eOpts) {
							if (rec.data.leaf) {
								var userAccept = Ext.getCmp('userAccept_form'
										+ record.data.emailId);
								var value = userAccept.getValue();
								userAccept.setValue(value + rec.data.userName
										+ "(" + rec.data.qtitle + ");");
							} else {
								var userAccept = Ext.getCmp('userAccept_form'
										+ record.data.emailId);
								Ext.Array.each(rec.data.children,
										function(item) {
											var value = userAccept.getValue();
											userAccept.setValue(value
													+ item.userName + "("
													+ item.qtitle + ");");
										})
							}
						}
					}
				}]
			}]

		});
	}
	if (!clear) {
		Ext.getCmp('userAccept_form' + record.data.emailId)
				.setValue(record.data.userSend);
	}
	if (edit) {
		title = record.data.emailTitle
		Ext.getCmp('emailContent_form' + record.data.emailId)
				.setValue(record.data.emailContent);
		Ext.getCmp('emailTitle_form' + record.data.emailId)
				.setValue(record.data.emailTitle);
		if (!clear) {
			Ext.getCmp('userAccept_form' + record.data.emailId)
					.setValue(record.data.userAccept);
		}
		var form = Ext.getCmp('email_edit_form' + record.data.emailId)
				.getForm();

		if (record.data.emailAttachments != '') {
			var bar = Ext.getCmp('filebar_edit_form' + record.data.emailId);
			var items = record.data.emailAttachments;
			Ext.Array.each(items, function(name, index, self) {
				bar.add({
					iconCls : 'wb_attach',
					padding : '0 0 0 0',
					id : name + record.data.emailId,
					myurl : name,
					html : name.substr(name.indexOf('/') + 1, name
									.lastIndexOf('_')
									- name.indexOf('/') - 1)
							+ name.substr(name.lastIndexOf('.'))
							+ "<span style='color:red;margin-left:20px;'>删除</span>",
					handler : function() {
						bar.remove(this);
					}
				});
			});
		}
	}
	tabpanel.setActiveTab(wrierTab);
};
// 保存草稿
var save2straw = function(form, fileBar, update) {
	var form = Ext.getCmp(form).getForm();
	var fileBar = Ext.getCmp(fileBar);
	var urls = [];
	Ext.Array.each(fileBar.items.items, function(item) {
				urls.push(item.myurl);
			});

	if (form.isValid()) {
		var url = '../../../email/email!save2Straw';
		if (update) {
			url = '../../../email/email!updateDetail';
		}
		form.submit({
					url : url,
					waitTitle : '提示',
					waitMsg : '正在保存...',
					params : {
						atts : urls
					},
					success : function(form, action) {
						Ext.Msg.alert('提示', '邮件保存成功！');
						store_straw.load();
					},
					failure : function(form, action) {
					}
				})
	}
}
// 保存草稿
var save2strawByrecord = function(record, grid, panel) {
	if (record) {
		Ext.Ajax.request({
					url : '../../../email/email!update',
					params : {
						'emailBox.emailId' : record.data.emailId,
						'emailBox.judge' : 1
					},
					success : function(res) {
						Ext.Msg.alert('提示', '邮件移动成功！');
						store_send.load();
						if (panel) {
							var tabpanel = Ext.getCmp('eamilMain');
							tabpanel.remove(panel);
						}
					},
					failure : function(res) {
					}
				});
	} else {
		var selModel = grid.getSelectionModel();
		if (selModel.hasSelection()) {
			Ext.Array.each(selModel.getSelection(), function(record) {
						Ext.Ajax.request({
									url : '../../../email/email!update',
									params : {
										'emailBox.emailId' : record.data.emailId,
										'emailBox.judge' : 1
									},
									success : function(res) {

									},
									failure : function(res) {
									}
								});
					})
			Ext.Msg.alert('提示', '邮件移动成功！');
			store_send.load();
		} else {
			Ext.Msg.alert('提示', "<span style='color:red'>请至少选择一条数据！</span>");
		}
	}
}
// 还原
var move2back = function() {
	var grid = Ext.getCmp('emaildustbinbox');
	var selModel = grid.getSelectionModel();
	if (selModel.hasSelection()) {
		Ext.Array.each(selModel.getSelection(), function(record) {
					Ext.Ajax.request({
								url : '../../../email/email!update',
								params : {
									'emailBox.emailId' : record.data.emailId,
									'relationAccept.judge' : 3
								},
								success : function(res) {

								},
								failure : function(res) {
								}
							});
				})
		store_dustbin.load();
		store_rec.load();
	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请至少选择一条数据！</span>");
	}
}
// 通讯录tree1
Ext.define('user_tree_drog', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'userName',
						type : 'string'
					}, {
						name : 'departName',
						type : 'string'
					}, {
						name : 'positionName',
						type : 'string'
					}]
		});
var userTreeDrogStore1 = Ext.create('Ext.data.TreeStore', {
			sorters : [{
						property : 'id',
						direction : 'ASC'
					}],
			model : 'user_tree_drog',
			proxy : {
				type : 'ajax',
				url : '../../../security/tree!getUserInfoTree',
				reader : {
					type : 'json'
				}
			}
		});
var userTreeStore1 = Ext.create('Ext.data.TreeStore', {
			sorters : [{
						property : 'id',
						direction : 'ASC'
					}],
			model : 'user_tree_drog',
			proxy : {
				type : 'ajax',
				url : '../../../security/tree!getUserInfoTree',
				reader : {
					type : 'json'
				}
			}
		});
var userTreeDrogStore2 = Ext.create('Ext.data.TreeStore', {
			sorters : [{
						property : 'id',
						direction : 'ASC'
					}],
			model : 'user_tree_drog',
			proxy : {
				type : 'ajax',
				url : '../../../security/tree!setUserInfoTree',
				reader : {
					type : 'json'
				}
			}
		});
