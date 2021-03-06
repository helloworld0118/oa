var isManager = false;
Ext.define('shareFile', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id'
					}, {
						name : 'shareCatalogue'
					}, {
						name : 'title'
					}, {
						name : 'fileType'
					}, {
						name : 'fileUrl'
					}, {
						name : 'shareDes'
					}, {
						name : 'shareUser'
					}, {
						name : 'fileSize'
					}, {
						name : 'shareDate'
					}]

		});
var catalogueTreeStore = Ext.create('Ext.data.TreeStore', {
			sorters : [{
						property : 'id',
						direction : 'ASC'
					}],
			proxy : {
				type : 'ajax',
				url : '../../../security/tree!getCatalogueInfo',
				reader : {
					type : 'json'
				}
			}
		});
// 定义 store
var shareFileStore = Ext.create('Ext.data.Store', {
			model : 'shareFile',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../share/shareManager!getAll'
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
var catalogID4add;
var shareManager_menu = Ext.create('Ext.menu.Menu', {
			margin : '0 0 10 0',
			items : [{
						iconCls : 'add',
						text : '上传',
						handler : function() {
							if (catalogID4add) {
								shareFileupload(true);
							} else {
								shareFileupload(false);
							}
						}
					}, {
						iconCls : 'wb_downLoad',
						text : '下载',
						handler : function() {
							shareDownLoad(false, Ext
											.getCmp('shareManager_grid'))
						}
					}, {
						iconCls : 'refresh',
						text : '刷新',
						handler : function() {
							shareFileStore.load();
						}
					}]
		});
// 增加或修改
var addOrUpdate = function(isAdd) {
	var url;
	var title;
	var tree = Ext.getCmp('shareTree_panel');
	var select = tree.getSelectionModel().getSelection();
	if (isAdd) {
		url = '../../../share/shareManager!addCatalog'
		title = "增加"
	} else {
		url = '../../../share/shareManager!updateCatalog'
		title = "修改"
		if (!select.length == 1) {
			Ext.Msg.alert('提示', "<span style='color:red'>请选择一条数据！</span>");
			return;
		}
	}
	Ext.create('Ext.window.Window', {
		frame : true,
		border : false,
		draggable : true,
		closable : true,
		title : title,
		modal : true,
		resizable : false,
		layout : 'fit',
		items : [{
					xtype : 'form',
					frame : true,
					id : 'shareCatelogForm',
					items : [{
								xtype : 'textfield',
								fieldLabel : '文件夹名称 ',
								labelWidth : 80,
								allowBlank : false,
								id : 'shareCatalogName',
								afterLabelTextTpl : required
							}]
				}],
		buttons : [{
			text : '确定',
			handler : function() {
				var params = {};
				if (isAdd) {
					if (select.length == 0) {
						params = {
							'catalogue.catalogueName' : Ext
									.getCmp('shareCatalogName').value
						}
					} else if (select[0].data.id == 'root') {
						params = {
							'catalogue.catalogueName' : Ext
									.getCmp('shareCatalogName').value
						}
					} else if (!select[0].data.leaf) {
						params = {
							'catalogue.catalogueName' : Ext
									.getCmp('shareCatalogName').value,
							'catalogue.parentId' : select[0].data.id
						}
					} else {
						params = {
							'catalogue.catalogueName' : Ext
									.getCmp('shareCatalogName').value,
							'catalogue.parentId' : select[0].data.parentId
						}
					}
				} else {
					params = {
						'catalogue.id' : select[0].data.id,
						'catalogue.catalogueName' : Ext
								.getCmp('shareCatalogName').value
					}
				}
				var form = Ext.getCmp('shareCatelogForm').getForm();
				if (form.isValid()) {
					Ext.Ajax.request({
						url : url,
						params : params,
						success : function(res) {
							if (res.responseText == 'true'
									|| res.responseText == true) {
								catalogueTreeStore.load();
							}
						},
						failure : function() {
							Ext.Msg
									.alert('提示',
											"<span style='color:red'>操作失败，请联系管理员！</span>");
						}
					})
				}
				this.ownerCt.ownerCt.close();
			}
		}, {
			text : '取消',
			handler : function() {
				this.ownerCt.ownerCt.close();
			}
		}]
	}).show();
	if (!isAdd) {
		Ext.getCmp('shareCatalogName').setValue(select[0].data.text);
	}
}
var shareManagerTree_menu = Ext.create('Ext.menu.Menu', {
	margin : '0 0 10 0',
	items : [{
				iconCls : 'add',
				text : '新建',
				handler : function() {
					addOrUpdate(true);
				}
			}, {
				text : '修改',
				iconCls : 'tabel_edit',
				handler : function() {
					addOrUpdate(false);
				}
			}, {
				iconCls : 'delte0',
				text : '删除',
				handler : function() {
					var tree = Ext.getCmp('shareTree_panel');
					var select = tree.getSelectionModel().getSelection();
					if (select.length == 1) {
						Ext.Msg.confirm('提示', '你确定要删除吗？',
								function callBack(id) {
									if (id == 'yes') {
										Ext.Ajax.request({
											url : '../../../share/shareManager!deleteCatalog',
											params : {
												'catalogue.id' : select[0].data.id
											},
											success : function(res) {
												if (res.responseText == 'true'
														|| res.responseText == true) {
													catalogueTreeStore.load();
												}
											},
											failure : function() {
												Ext.Msg
														.alert('提示',
																"<span style='color:red'>操作失败，请联系管理员！</span>");
											}
										})
									}
								});
					} else {
						Ext.Msg.alert('提示',
								"<span style='color:red'>请选择一条数据！</span>");
					}
				}
			}]
});
var shareDownLoad = function(record, grid) {
	if (record) {
		window.location.href = '../../../share/shareManager?fileName='
				+ record.data.fileUrl;
	} else {
		var selModel = grid.getSelectionModel();
		if (selModel.getSelection().length == 1) {
			window.location.href = '../../../share/shareManager?fileName='
					+ selModel.getSelection()[0].data.fileUrl;
		} else {
			Ext.Msg.alert('提示', "<span style='color:red'>请选择一条数据！</span>");
		}
	}
}
Ext.define('ShareMananger', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.shareMananger',
	layout : 'fit',
	autoScroll : true,
	items : [{
		xtype : 'panel',
		layout : 'border',
		items : [{
			xtype : 'treepanel',
			region : 'west',
			width : 180,
			id : 'shareTree_panel',
			store : catalogueTreeStore,
			title : '目录',
			useArrows : true,
			root : {
				text : "管理",
				expanded : true
			},
			listeners : {
				render : function(p) {
					p.getEl().on("contextmenu", function(e) {
								e.preventDefault();
							})
				},
				itemcontextmenu : function(view, record, item, index, e, eOpts) {
					if (isManager) {
						shareManagerTree_menu.showAt(e.getXY());
					}
				},
				containercontextmenu : function(view, e, eOpts) {
					if (isManager) {
						shareManagerTree_menu.showAt(e.getXY());
					}
				},
				itemdblclick : function(view, record, item, index, e, eOpts) {
					if (record.data.leaf) {
						shareFileStore.clearFilter(true);
						shareFileStore.filter('', record.data.id + "");
						catalogID4add = record.data.id
					}
				}
			}
		}, {
			region : 'center',
			xtype : 'panel',
			layout : 'fit',
			items : [{
				xtype : 'grid',
				forceFit : true,
				frame : true,
				id : 'shareManager_grid',
				store : shareFileStore,
				multiSelect : false,
				dockedItems : [{
					xtype : 'pagingtoolbar',
					store : shareFileStore,
					dock : 'bottom',
					displayInfo : true,
					displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
				}],
				tbar : ['-', {
							iconCls : 'add',
							text : '上传',
							handler : function() {
								if (catalogID4add) {
									shareFileupload(true);
								} else {
									shareFileupload(false);
								}

							}
						}, '-', {
							iconCls : 'wb_downLoad',
							text : '下载',
							handler : function() {
								shareDownLoad(false, Ext
												.getCmp('shareManager_grid'))
							}
						}, '-', {
							iconCls : 'refresh',
							text : '刷新',
							handler : function() {
								shareFileStore.load();
							}
						}, '-', '->', {
							width : 200,
							fieldLabel : '搜索',
							labelWidth : 35,
							emptyText : '文件名',
							xtype : 'searchfield',
							hidden : true,
							store : shareFileStore
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
											findFailShow('MainTab',
													'help_video');
										}
									}]
						}],
				columns : [{
					header : '',
					dataIndex : 'fileType',
					width : 15,
					renderer : function(v) {
						if (v.indexOf('doc') >= 0) {
							return "<img src='images/img/word.gif' title='WORD'/>"
						} else if (v.indexOf('xls') >= 0) {
							return "<img src='images/img/excel.gif' title='EXCEL' />"
						} else if (v.indexOf('txt') >= 0) {
							return "<img src='images/img/txt.gif' title='记事本'/>"
						} else if (v.indexOf('psd') >= 0) {
							return "<img src='images/img/icon_psd.gif' title='图像'/>"
						} else if (v.indexOf('avi') >= 0
								|| v.indexOf('rmvb') >= 0
								|| v.indexOf('mv') >= 0
								|| v.indexOf('mkv') >= 0
								|| v.indexOf('rm') >= 0
								|| v.indexOf('wmv') >= 0
								|| v.indexOf('mp4') >= 0) {
							return "<img src='images/img/icon_mv.gif' title='视频'/>"
						} else if (v.indexOf('mp3') >= 0) {
							return "<img src='images/img/icon_mp3.gif' title='音乐'/>"
						} else if (v.indexOf('pdf') >= 0) {
							return "<img src='images/img/icon_pdf.gif' title='PDF'/>"
						} else if (v.indexOf('ppt') >= 0) {
							return "<img src='images/img/icon_ppt.gif' title='PPT'/>"
						} else if (v.indexOf('chm') >= 0) {
							return "<img src='images/img/icon_chm.gif'  />"
						} else if (v.indexOf('exe') >= 0) {
							return "<img src='images/img/icon_exe.gif' title='运行文件'/>"
						} else if (v.indexOf('jpg') >= 0
								|| v.indexOf('png') >= 0
								|| v.indexOf('gif') >= 0) {
							return "<img src='images/img/jpg.gif' title='图像' />"
						} else {
							return "<img src='images/img/png-0023.png' title='未知'/>"
						}
					},
					filter : {
						type : 'list',
						options : ['视频', '音乐', '图像', 'OFFICE文档', '记事本文件',
								'PDF', '运行文件']
					}
				}, {
					header : '文件名',
					dataIndex : 'title',
					filter : {
						type : 'string'
					}
				}, {
					header : '上传人',
					dataIndex : 'shareUser',
					filter : {
						type : 'string'
					}
				}, {
					header : '大小',
					dataIndex : 'fileSize',
					filter : {
						type : 'numeric'
					}
				}, {
					header : '上传时间',
					dataIndex : 'shareDate',
					filter : {
						type : 'date'
					}
				}],
				features : [filters],
				plugins : [{
					ptype : 'rowexpander',
					rowBodyTpl : ["<b style='margin-left:0px;'>描述:</b> {shareDes}"]
				}],
				listeners : {
					containercontextmenu : function(view, e, eOpts) {
						e.preventDefault();
						shareManager_menu.showAt(e.getXY());
					},
					itemcontextmenu : function(view, record, item, index, e,
							eOpts) {
						e.preventDefault();
						shareManager_menu.showAt(e.getXY());
					},
					itemdblclick : function(view, record, item, index, e, eOpts) {
					}
				}
			}]
		}]
	}],
	listeners : {
		render : function(p) {
			p.getEl().on("contextmenu", function(e) {
						e.preventDefault();
					});
			Ext.Ajax.request({
				url : '../../../share/shareManager!isManager',
				success : function(res) {
					if (res.responseText == 'true' || res.responseText == true) {
						isManager = true;
					}
				},
				failure : function() {
				}
			})
		}
	}
});
var shareFileupload = function(hidden) {
	Ext.create('Ext.window.Window', {
		width : 450,
		id : 'shareFileUpload_window',
		frame : true,
		border : false,
		draggable : false,
		closable : true,
		resizable : false,
		modal : true,
		layout : 'fit',
		items : [{
			xtype : 'form',
			frame : true,
			width : 450,
			layout : 'anchor',
			defaults : {
				anchor : '100%'
			},
			id : 'shareFileUpload_form',
			items : [{
						xtype : 'combobox',
						fieldLabel : '所属文件夹',
						editable : false,
						hidden : hidden,
						allowBlank : hidden,
						store : filter_shareCatalogStore,
						id : 'catalogueListID',
						afterLabelTextTpl : required,
						queryMode : 'remote',
						labelWidth : 70,
						displayField : 'text',
						valueField : 'id'
					}, {
						xtype : 'filefield',
						id : 'shareFileUpload_File',
						emptyText : '选择文件',
						labelWidth : 70,
						allowBlank : false,
						fieldLabel : '上传',
						name : 'share',
						buttonText : '',
						buttonConfig : {
							iconCls : 'upload-icon'
						}
					}, {
						xtype : 'htmleditor',
						fieldLabel : '文件描述',
						labelWidth : 70,
						height : 200,
						allowBlank : false,
						name : 'shareDes',
						afterLabelTextTpl : required
					}],
			buttons : [{
				text : '确认',
				handler : function() {
					var form = Ext.getCmp('shareFileUpload_form').getForm();
					if (form.isValid()) {
						var url;
						if (hidden) {
							url = '../../../share/shareManager!uploadFile?catalogue.id='
									+ catalogID4add;
						} else {
							url = '../../../share/shareManager!uploadFile?catalogue.id='
									+ Ext.getCmp('catalogueListID').value
						}
						form.submit({
							url : url,
							waitTitle : '提示',
							waitMsg : '正在在上传',
							success : function(fp, o) {
								if (hidden) {
									shareFileStore.load();
								}
								Ext.getCmp('shareFileUpload_window').close();
							},
							failure : function(fp, o) {
								Ext.Msg
										.alert('提示',
												"<span style='color:red'>操作失败请联系管理员！</span>")
								Ext.getCmp('shareFileUpload_window').close();
							}
						})
					}
				}
			}, {
				text : '取消',
				handler : function() {
					Ext.getCmp('shareFileUpload_window').close();
				}
			}]
		}]
	}).show();

}
var filter_shareCatalogStore = Ext.create('Ext.data.Store', {
			fields : ['id', 'text'],
			proxy : {
				type : 'ajax',
				url : '../../../share/shareManager!getShareCatalogName',
				reader : {
					type : 'json'
				}
			}
		});