var rec;
// 删除
var role_delete = function() {
	var grid = Ext.getCmp('role_grid');
	var selModel = grid.getSelectionModel();
	if (selModel.hasSelection()) {
		var select = selModel.getSelection();
		roleStore.remove(select);
		roleStore.sync();

	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请至少选择一条数据！</span>");
	}
}
var role_menu = Ext.create('Ext.menu.Menu', {
			margin : '0 0 10 0',
			items : [{
						iconCls : 'logoff',
						text : '权限分配',
						handler : function() {
							roleRight_edit()
						}
					}, {
						iconCls : 'add',
						text : '增加',
						handler : function() {
							Ext.create('role_EditWindow', {
										title : '增加'
									}).show();
						}
					}, {
						iconCls : 'tabel_edit',
						text : '修改',
						handler : function() {
							role_edit()
						}

					}, {
						iconCls : 'delte0',
						text : '删除',
						handler : function() {
							role_delete();
						}
					}, {
						iconCls : 'refresh',
						text : '刷新',
						handler : function() {
							role_refresh();
						}
					}]
		})
// 刷新
var role_refresh = function() {
	roleStore.load();
}
Ext.define('roleInfo', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id'
					}, {
						name : 'roleName'
					}, {
						name : 'roleDesc'
					}, {
						name : 'roleHave'
					}, {
						name : 'rolePower'
					}]
		});
// 角色store
var roleStore = Ext.create('Ext.data.Store', {
			model : 'roleInfo',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../security/roleRight!getAll',
					update : '../../../security/roleRight!updateJson',
					destroy : '../../../security/roleRight!delete',
					create : '../../../security/roleRight!add'// 现在没有用
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
// 增加，修改Window
Ext.define('role_EditWindow', {
	extend : 'Ext.window.Window',
	width : 470,
	title : '',
	id : 'role_edit',
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
		xtype : 'form',
		bodyPadding : 5,
		id : 'role_form',
		layout : 'anchor',
		frame : true,
		defaults : {
			anchor : '100%',
			msgTarget : 'side'
		},
		margin : '0 2 2 2',
		items : [{
					xtype : 'hiddenfield',
					name : 'id'
				}, {
					xtype : 'textfield',
					name : 'roleName',
					fieldLabel : '名称',
					labelWidth : 40,
					regex : /^[\u4e00-\u9fa5\w]*$/,
					regexText : '请输入中英文',
					afterLabelTextTpl : required,
					allowBlank : false
				}, {
					xtype : 'htmleditor',
					grow : true,
					allowBlank : false,
					name : 'roleDesc',
					labelWidth : 40,
					height : 200,
					afterLabelTextTpl : required,
					fieldLabel : '描述'
				}, {
					xtype : 'hiddenfield',
					name : 'roleHave',
					value : false
				}, {
					xtype : 'numberfield',
					value : 1,
					anchor : '100%',
					name : 'rolePower',
					labelWidth : 60,
					margin : '5 0 0 0',
					afterLabelTextTpl : required,
					maxValue : 5,
					fieldLabel : '权力级别',
					minValue : 1,
					allowBlank : false
				}],
		buttons : [{
			text : '确定',
			handler : function() {
				var form = Ext.getCmp('role_form').getForm();
				var title = Ext.getCmp('role_edit').title;
				var url;
				if (title == '增加') {
					url = '../../../security/roleRight!add';
				} else {
					url = '../../../security/roleRight!update'
				}
				if (form.isValid()) {
					form.submit({
						url : url,
						success : function(form, action) {
							roleStore.load();
							Ext.getCmp('role_edit').close();
						},
						failure : function(form, action) {
							if (action.result.msg == 'have') {
								Ext.Msg
										.alert('提示',
												"<span style='color:red'>请您填写的数据有误！</span>");
							} else {
								Ext.Msg
										.alert('提示',
												"<span style='color:red'>操作失败,请联系管理员！</span>");
							}
						}
					});
				}

			}
		}, {
			text : '重置',
			handler : function() {
				Ext.getCmp('role_form').getForm().reset();
			}
		}, {
			text : '取消',
			handler : function() {
				this.ownerCt.ownerCt.ownerCt.close();
			}
		}]
	}]
})
var roleRight_edit = function() {
	var grid = Ext.getCmp('role_grid');
	var selModel = grid.getSelectionModel();
	if (selModel.getSelection().length == 1) {
		var select = selModel.getSelection();
		userTreeStore.proxy.url = '../../../security/tree!queryRoleRight?roleID='
				+ select[0].data.id;
		var window = Ext.create('role_rightWindow', {
					title : '分配->' + select[0].data.roleName
				}).show();

	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请选择一条数据！</span>");
	}
}
var userTreeStore = Ext.create('Ext.data.TreeStore', {
			sorters : [{
						property : 'id',
						direction : 'ASC'
					}],
			proxy : {
				type : 'ajax',
				url : '',
				reader : {
					type : 'json'
				}
			}
		});
// 权限菜单
Ext.define('role_rightWindow', {
	extend : 'Ext.window.Window',
	frame : true,
	id : 'role_rightEdit',
	border : false,
	width : 220,
	height : 400,
	draggable : true,
	closable : true,
	modal : true,
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
		xtype : 'treepanel',
		frame : true,
		id : 'roleRight_edit',
		useArrows : true,
		title : '',
		store : userTreeStore,
		autoScroll : true,
		root : {
			text : "权限分配",
			iconCls : 'role',
			id : '-1',
			checked : false,
			expanded : true
		},
		tbar : ['-', {
					text : '展开所有',
					iconCls : 'up',
					handler : function() {
						Ext.getCmp('roleRight_edit').expandAll();
					}
				}, '-', '->', '-', {
					text : '关闭所有',
					iconCls : 'down',
					handler : function() {
						Ext.getCmp('roleRight_edit').collapseAll();
					}
				}, '-'],
		bbar : ['-', {
			xtype : 'button',
			text : '保存',
			iconCls : 'save',
			handler : function() {
				var checkeds = Ext.getCmp('roleRight_edit').getChecked();
				var ids = [];
				for (var i = 0; i < checkeds.length; i++) {
					if (checkeds[i].data.id != '-1') {
						ids.push(checkeds[i].data.id);
					}
				}
				Ext.Ajax.request({
					url : '../../../security/tree!addRoleRight',
					params : {
						id : ids,
						role : Ext.getCmp('role_grid').getSelectionModel()
								.getSelection()[0].data.id
					},
					success : function(res) {
						if (res.responseText == 'false') {
							Ext.Msg
									.alert('提示',
											"<span style='color:red'>操作失败，请联系管理员！</span>");
						} else {
							role_refresh();
						}
					},
					failure : function(res) {
						Ext.Msg.alert('提示',
								"<span style='color:red'>操作失败请联系管理员！</span>");
					}
				});
				Ext.getCmp('role_rightEdit').close();
			}
		}, '-', {
			xtype : 'button',
			text : '重置',
			iconCls : 'refresh',
			handler : function() {
				userTreeStore.load();
			}
		}, '-', {
			xtype : 'button',
			text : '取消',
			iconCls : 'delte',
			handler : function() {
				Ext.getCmp('role_rightEdit').close();
			}
		}, '-'],
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
		}
	}]
})
// 定义自己的API
var required = '<span style="color:red;font-weight:bold" data-qtip="不可为空！">*</span>';
// 修改
var role_edit = function() {
	var grid = Ext.getCmp('role_grid');
	var selModel = grid.getSelectionModel();

	if (selModel.getSelection().length == 1) {
		var window = Ext.create('role_EditWindow', {
					title : '修改'
				}).show();
		var select = selModel.getSelection();
		Ext.getCmp('role_form').getForm().loadRecord(select[0]);
	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请选择一条数据！</span>");
	}
}
Ext.define('RoleManager', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.roleManager',
	layout : 'fit',
	listeners : {
		afterrender : function() {
			roleStore.load();
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
		id : 'role_grid',
		store : roleStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : roleStore,
			displayInfo : true,
			dock : 'bottom',
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'add',
					text : '增加',
					handler : function() {
						Ext.create('role_EditWindow', {
									title : '增加'
								}).show();
					}
				}, '-', {
					iconCls : 'delte0',
					text : '删除',
					handler : role_delete
				}, '-', {
					iconCls : 'tabel_edit',
					text : '修改',
					handler : role_edit
				}, '-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : role_refresh
				}, '-', {
					iconCls : 'logoff',
					text : '权限分配',
					handler : roleRight_edit
				}, '-', '->', '-', {
					width : 200,
					fieldLabel : '搜索',
					labelWidth : 35,
					emptyText : '名称',
					xtype : 'searchfield',
					store : roleStore
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
					header : '名称',
					dataIndex : 'roleName',
					editor : {
						xtype : 'textfield',
						allowBlank : false
					}
				}, {
					header : '描述',
					dataIndex : 'roleDesc',
					editor : {
						xtype : 'textfield',
						allowBlank : false
					}
				}, {
					header : '是否分配权限',
					dataIndex : 'roleHave',
					renderer : function(v) {
						if (v == true) {
							return '是'
						} else {
							return "<span style='color:red'>否</span>"
						}
					}
				}, {
					header : '权限级别',
					dataIndex : 'rolePower',
					editor : {
						xtype : 'numberfield',
						value : 1,
						maxValue : 5,
						minValue : 1,
						allowBlank : false
					}
				}],
		selType : 'checkboxmodel',
		listeners : {
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
				role_menu.showAt(e.getXY());
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
				role_menu.showAt(e.getXY());
			}
		}
	}]
});