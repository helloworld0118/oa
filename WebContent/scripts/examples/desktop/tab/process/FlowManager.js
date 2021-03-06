// model
Ext.define('processDefinition', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id'
					}, {
						name : 'name'
					}, {
						name : 'version'
					}, {
						name : 'deploymentId'
					}]
		})
// 流程定义 store
var processDefinitionStore = Ext.create('Ext.data.Store', {
			model : 'processDefinition',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../process/definition!getAll',
					update : '../../../process/definition!updateJson',
					destroy : '../../../process/definition!delete',
					create : '../../../process/definition!add'// 现在没有用
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
var processDefinition_menu = Ext.create('Ext.menu.Menu', {
			margin : '0 0 10 0',
			items : [{
						iconCls : 'add',
						text : '增加',
						handler : function() {
							Ext.create('processDefinition_EditWindow', {
										title : '增加'
									}).show();
						}
					}, {
						iconCls : 'delte0',
						text : '删除',
						handler : function() {
							processDefinition_delete();
						}
					}, {
						iconCls : 'refresh',
						text : '刷新',
						handler : function() {
							processDefinition_refresh()
						}
					}]
		});
// 刷新
var processDefinition_refresh = function() {
	processDefinitionStore.load();
}
// 删除
var processDefinition_delete = function() {
	var grid = Ext.getCmp('processDefinition_grid');
	var selModel = grid.getSelectionModel();
	if (selModel.hasSelection()) {
		var select = selModel.getSelection();
		processDefinitionStore.remove(select);
		processDefinitionStore.sync();

	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请至少选择一条数据！</span>");
	}
}
// 增加
Ext.define('processDefinition_EditWindow', {
	extend : 'Ext.window.Window',
	width : 250,
	id : 'processDefinition_window',
	frame : true,
	border : false,
	draggable : false,
	closable : true,
	resizable : false,
	modal : true,
	items : [{
		xtype : 'form',
		frame : true,
		id : 'processDefinition_form',
		items : [{
					xtype : 'filefield',
					id : 'processDefinition_File',
					emptyText : '流程文件',
					labelWidth : 70,
					allowBlank : false,
					fieldLabel : '流程文件',
					name : 'process',
					buttonText : '',
					buttonConfig : {
						iconCls : 'upload-icon'
					}
				}],
		buttons : [{
			text : '确定',
			handler : function() {
				var form = Ext.getCmp('processDefinition_form').getForm();
				if (form.isValid()) {
					var image = Ext.getCmp('processDefinition_File').value
					var type = image.substr(image.lastIndexOf('.') + 1)
					if (type != 'zip') {
						Ext.Msg.alert('提示',
								"<span style='color:red'>请上传 zip 格式头像！</span>")
					} else {
						form.submit({
							url : '../../../process/definition!deploy',
							waitTitle : '提示',
							waitMsg : '正在在上传',
							success : function(fp, o) {
								processDefinitionStore.load();
								Ext.getCmp('processDefinition_window').close();
							},
							failure : function(fp, o) {
								Ext.Msg
										.alert('提示',
												"<span style='color:red'>操作失败请联系管理员！</span>")
								Ext
										.getCmp('processDefinition_window' + ''
												+ '').close();
							}
						})
					}
				}
			}
		}, {
			text : '取消',
			handler : function() {
				Ext.getCmp('processDefinition_window').close();
			}
		}]
	}]
})
// xtype
Ext.define('FlowManager', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.flowManager',
	layout : 'fit',
	listeners : {
		afterrender : function() {
			processDefinitionStore.load();
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
		id : 'processDefinition_grid',
		store : processDefinitionStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : processDefinitionStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'add',
					text : '增加',
					handler : function() {
						Ext.create('processDefinition_EditWindow', {
									title : '增加'
								}).show();
					}
				}, '-', {
					iconCls : 'delte0',
					text : '删除',
					handler : processDefinition_delete
				}, '-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : processDefinition_refresh
				}, '-', '->', '-', {
					width : 200,
					fieldLabel : '搜索',
					labelWidth : 35,
					emptyText : '名称',
					xtype : 'searchfield',
					store : processDefinitionStore
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
					dataIndex : 'name'
				}, {
					header : '版本',
					dataIndex : 'version'
				}],
		selType : 'checkboxmodel',
		listeners : {
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
				processDefinition_menu.showAt(e.getXY());
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
				processDefinition_menu.showAt(e.getXY());
			}
		}
	}]
});