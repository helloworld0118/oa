// 右键菜单
var rec;

var position_menu = Ext.create('Ext.menu.Menu', {
			margin : '0 0 10 0',
			items : [{
						iconCls : 'add',
						text : '增加',
						handler : function() {
							Ext.create('Position_EditWindow', {
										title : '增加'
									}).show();
						}
					}, {
						iconCls : 'tabel_edit',
						text : '修改',
						handler : function() {
							position_edit()
						}

					}, {
						iconCls : 'delte0',
						text : '删除',
						handler : function() {
							position_delete();
						}
					}, {
						iconCls : 'refresh',
						text : '刷新',
						handler : function() {
							position_refresh()
						}
					}]
		})
// model
Ext.define('Position', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id'
					}, {
						name : 'positionName'
					}, {
						name : 'positionDes'
					}]
		})
// 部门store
var PositionStore = Ext.create('Ext.data.Store', {
			model : 'Position',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../security/position!getAll',
					update : '../../../security/position!updateJson',
					destroy : '../../../security/position!delete',
					create : '../../../security/position!add'// 现在没有用
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
var position_refresh = function() {
	PositionStore.load();
}
// 行编辑器
var position_editing = Ext.create('Ext.grid.plugin.RowEditing', {
			clicksToEdit : 2,
			listeners : {
				edit : function(editor, e, eOpts) {
					var my = e;

				},
				canceledit : function(editor, e, eOpts) {
					if (rec) {
						PositionStore.remove(rec);
					}
				}
			}
		});
// 删除
var position_delete = function() {
	var grid = Ext.getCmp('position_grid');
	var selModel = grid.getSelectionModel();
	if (selModel.hasSelection()) {
		var select = selModel.getSelection();
		PositionStore.remove(select);
		PositionStore.sync();

	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请至少选择一条数据！</span>");
	}
}
// 修改
var position_edit = function() {
	var grid = Ext.getCmp('position_grid');
	var selModel = grid.getSelectionModel();

	if (selModel.getSelection().length == 1) {
		var window = Ext.create('Position_EditWindow', {
					title : '修改'
				}).show();
		var select = selModel.getSelection();
		Ext.getCmp('position_form').getForm().loadRecord(select[0]);
	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请选择一条数据！</span>");
	}
}
// 增加，修改Window
Ext.define('Position_EditWindow', {
	extend : 'Ext.window.Window',
	width : 470,
	title : '',
	id : 'position_add',
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
		id : 'position_form',
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
					name : 'positionName',
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
					afterLabelTextTpl : required,
					name : 'positionDes',
					labelWidth : 40,
					height : 200,
					fieldLabel : '描述'
				}],
		buttons : [{
			text : '确定',
			handler : function() {
				var form = Ext.getCmp('position_form').getForm();
				var title = Ext.getCmp('position_add').title;
				var url;
				if (title == '增加') {
					url = '../../../security/position!add';
				} else {
					url = '../../../security/position!update'
				}
				if (form.isValid()) {
					form.submit({
						clientValidation : true,
						url : url,
						success : function(form, action) {
							PositionStore.load();
							Ext.getCmp('position_add').close();
						},
						failure : function(form, action) {
							if (action.result.msg == 'have') {
								Ext.Msg
										.alert('提示',
												"<span style='color:red'>请您填写的数据有误！</span>");
							} else {
								Ext.Msg
										.alert('提示',
												"<span style='color:red'>操作失败请联系管理员！</span>");
							}
						}
					});
				}

			}
		}, {
			text : '重置',
			handler : function() {
				Ext.getCmp('position_form').getForm().reset();
			}
		}, {
			text : '取消',
			handler : function() {
				Ext.getCmp('position_add').close();
			}
		}]
	}]
})
// xtype
Ext.define('PositionInfo', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.positionInfo',
	layout : 'fit',
	listeners : {
		afterrender : function() {
			PositionStore.load();
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
		id : 'position_grid',
		store : PositionStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : PositionStore,
			displayInfo : true,
			dock : 'bottom',
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'add',
					text : '增加',
					handler : function() {
						Ext.create('Position_EditWindow', {
									title : '增加'
								}).show();
					}
				}, '-', {
					iconCls : 'delte0',
					text : '删除',
					handler : position_delete
				}, '-', {
					iconCls : 'tabel_edit',
					text : '修改',
					handler : position_edit
				}, '-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : position_refresh
				}, '-', '->', '-', {
					width : 200,
					fieldLabel : '搜索',
					labelWidth : 35,
					emptyText : '名称',
					xtype : 'searchfield',
					store : PositionStore
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
					dataIndex : 'positionName',
					editor : {
						xtype : 'textfield',
						allowBlank : false
					}
				}, {
					header : '描述',
					dataIndex : 'positionDes',
					editor : {
						xtype : 'textfield',
						allowBlank : false
					}
				}],
		selType : 'checkboxmodel',
		listeners : {
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
				position_menu.showAt(e.getXY());
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
				position_menu.showAt(e.getXY());
			}
		}
	}]
});