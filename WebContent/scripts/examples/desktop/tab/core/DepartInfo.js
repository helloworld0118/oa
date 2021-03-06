// 右键菜单
var rec;

var depart_menu = Ext.create('Ext.menu.Menu', {
			margin : '0 0 10 0',
			items : [{
						iconCls : 'add',
						text : '增加',
						handler : function() {
							Ext.create('Depart_EditWindow', {
										title : '增加'
									}).show();
						}
					}, {
						iconCls : 'tabel_edit',
						text : '修改',
						handler : function() {
							depart_edit()
						}

					}, {
						iconCls : 'delte0',
						text : '删除',
						handler : function() {
							depart_delete();
						}
					}, {
						iconCls : 'refresh',
						text : '刷新',
						handler : function() {
							depart_refresh()
						}
					}]
		})
// model
Ext.define('Depart', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id'
					}, {
						name : 'departName'
					}, {
						name : 'departDes'
					}]
		})
// 部门store
var DeptStore = Ext.create('Ext.data.Store', {
			model : 'Depart',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../security/depart!getAll',
					update : '../../../security/depart!updateJson',
					destroy : '../../../security/depart!delete',
					create : '../../../security/depart!add'// 现在没有用
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
var depart_refresh = function() {
	DeptStore.load();
}
// 行编辑器
var depart_editing = Ext.create('Ext.grid.plugin.RowEditing', {
			clicksToEdit : 2,
			listeners : {
				canceledit : function(editor, e, eOpts) {
					if (rec) {
						DeptStore.remove(rec);
					}
				}
			}
		});
// 删除
var depart_delete = function() {
	var grid = Ext.getCmp('depart_grid');
	var selModel = grid.getSelectionModel();
	if (selModel.hasSelection()) {
		var select = selModel.getSelection();
		DeptStore.remove(select);
		DeptStore.sync();

	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请至少选择一条数据！</span>");
	}
}
// 修改
var depart_edit = function() {
	var grid = Ext.getCmp('depart_grid');
	var selModel = grid.getSelectionModel();

	if (selModel.getSelection().length == 1) {
		var window = Ext.create('Depart_EditWindow', {
					title : '修改'
				}).show();
		var select = selModel.getSelection();
		Ext.getCmp('depart_form').getForm().loadRecord(select[0]);
	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请选择一条数据！</span>");
	}
}
// 增加，修改Window
Ext.define('Depart_EditWindow', {
	extend : 'Ext.window.Window',
	width : 470,
	title : '',
	id : 'depart_add',
	frame : true,
	border : false,
	draggable : true,
	closable : true,
	modal : true,
	resizable : false,
	items : [{
		xtype : 'form',
		bodyPadding : 5,
		id : 'depart_form',
		layout : 'anchor',
		frame : true,
		defaults : {
			anchor : '100%',
			msgTarget : 'side'
		},
		margin : '0 2 2 2',
		listeners : {
			render : function(p) {
				p.getEl().on("contextmenu", function(e) {
							e.preventDefault();
						})
			}
		},
		items : [{
					xtype : 'hiddenfield',
					name : 'id'
				}, {
					xtype : 'textfield',
					name : 'departName',
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
					name : 'departDes',
					height:200,	
					afterLabelTextTpl : required,
					labelWidth : 40,
					fieldLabel : '描述'
				}],
		buttons : [{
			text : '确定',
			handler : function() {
				var form = Ext.getCmp('depart_form').getForm();
				var title = Ext.getCmp('depart_add').title;
				var url;
				if (title == '增加') {
					url = '../../../security/depart!add';
				} else {
					url = '../../../security/depart!update'
				}
				if (form.isValid()) {
					form.submit({
						clientValidation : true,
						url : url,
						success : function(form, action) {
							DeptStore.load();
							Ext.getCmp('depart_add').close();
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
				Ext.getCmp('depart_form').getForm().reset();
			}
		}, {
			text : '取消',
			handler : function() {
				Ext.getCmp('depart_add').close();
			}
		}]
	}]
})

// xtype
Ext.define('DepartInfo', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.departInfo',
	layout : 'fit',
	listeners : {
		afterrender : function() {
			DeptStore.load();
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
		id : 'depart_grid',
		store : DeptStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : DeptStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'add',
					text : '增加',
					handler : function() {
						Ext.create('Depart_EditWindow', {
									title : '增加'
								}).show();
					}
				}, '-', {
					iconCls : 'delte0',
					text : '删除',
					handler : depart_delete
				}, '-', {
					iconCls : 'tabel_edit',
					text : '修改',
					handler : depart_edit
				}, '-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : depart_refresh
				}, '-', '->', '-', {
					width : 200,
					fieldLabel : '搜索',
					labelWidth : 35,
					emptyText : '名称',
					xtype : 'searchfield',
					store : DeptStore
				}, '-', {
					xtype : 'splitbutton',
					text : '',
					iconCls : 'help',
					menu : [{
								text : '图文帮助',
								iconCls:'help_img',
								handler:function(){
								  findFailShow('MainTab','help_img');
								}
							}, {
								text : '视频帮助',
								iconCls:'help_video',
								handler:function(){
								  findFailShow('MainTab','help_video');
								}
								
							}]
				}],
		columns : [{
					header : '编号',
					dataIndex : 'id'
				}, {
					header : '名称',
					dataIndex : 'departName',
					editor : {
						xtype : 'textfield',
						allowBlank : false
					}
				}, {
					header : '描述',
					dataIndex : 'departDes',
					editor : {
						xtype : 'textfield',
						allowBlank : false
					}
				}
		 ],
		selType : 'checkboxmodel',
		listeners : {
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
				depart_menu.showAt(e.getXY());
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
				depart_menu.showAt(e.getXY());
			}
		}
	}]
});