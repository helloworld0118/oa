// 右键菜单
var rec;

var notice_menu = Ext.create('Ext.menu.Menu', {
			margin : '0 0 10 0',
			items : [{
						iconCls : 'add',
						text : '增加',
						handler : function() {
							Ext.create('notice_EditWindow', {
										title : '增加'
									}).show();
						}
					}, {
						iconCls : 'delte0',
						text : '删除',
						handler : function() {
							notice_delete();
						}
					}, {
						iconCls : 'refresh',
						text : '刷新',
						handler : function() {
							notice_refresh()
						}
					}, {
						iconCls : 'wb_read',
						text : '阅读情况',
						handler : function() {
							showReadDetail();
						}
					}]
		})
// model
Ext.define('Notice', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id'
					}, {
						name : 'user'
					}, {
						name : 'title'
					}, {
						name : 'detail'
					}, {
						name : 'arrangTime'
					}, {
						name : 'beginTime'
					}, {
						name : 'endTime'
					}, {
						name : 'isAllDay'
					}, {
						name : 'color'
					}, {
						name : 'state'
					}]
		})
// store
var NoticeStore = Ext.create('Ext.data.Store', {
			model : 'Notice',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../notice/notice!getAll'
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
var notice_refresh = function() {
	NoticeStore.load();
}
Ext.define('mycolorPicker', {
			extend : 'Ext.menu.ColorPicker',
			allowReselect : true,
			alias : 'widget.myColor',
			focus : Ext.emptyFn,
			plain : true,
			clickEvent : 'mousedown',
			id : 'color_my',
			listeners : {
				select : function(picker, color) {
					text_color = color;
					Ext.getCmp('notice_title').setFieldStyle('color:' + '#'
							+ color);
					Ext.util.CSS.updateRule('.wb_color', 'background-color',
							'#' + color);
					Ext.getCmp('color_my').hide();
				}
			}
		})
// 删除
var notice_delete = function() {
	var grid = Ext.getCmp('notice_grid');
	var selModel = grid.getSelectionModel();
	if (selModel.hasSelection()) {
		var select = selModel.getSelection();
		Ext.Array.each(select, function(item) {
					Ext.Ajax.request({
								url : '../../../notice/notice!delete',
								params : {
									'noticeInfo.id' : item.data.id
								},
								success : function(res) {
								},
								failure : function(res) {
								}
							});
				});
		NoticeStore.load();
	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请至少选择一条数据！</span>");
	}
}
// 增加Window
var treeurl;
var text_color = '000000';
Ext.define('notice_EditWindow', {
	extend : 'Ext.window.Window',
	title : '增加',
	id : 'notice_add_window',
	frame : true,
	border : false,
	draggable : true,
	closable : true,
	modal : true,
	layout : 'fit',
	resizable : false,
	width : 600,
	items : [{
		xtype : 'form',
		bodyPadding : 5,
		id : 'notice_form',
		layout : 'column',
		frame : true,
		defaults : {
			columnWidth : 1,
			msgTarget : 'side'
		},
		listeners : {
			render : function(p) {
				Ext.util.CSS.updateRule('.wb_color', 'background-color',
							'#000000');
				p.getEl().on("contextmenu", function(e) {
							e.preventDefault();
						})
			}
		},
		items : [{
					xtype : 'textfield',
					name : 'noticeInfo.title',
					fieldLabel : '标题',
					id : 'notice_title',
					margin : '10 0 0 5',
					labelWidth : 40,
					columnWidth : .80,
					afterLabelTextTpl : required,
					allowBlank : false
				}, {
					xtype : 'button',
					margin : '10 0 0 5',
					text : '标题颜色',
					iconCls : 'wb_color',
					columnWidth : .18,
					menu : {
						xtype : 'myColor'
					}
				}, {
					xtype : 'daterangefield',
					id : 'notice_date',
					afterLabelTextTpl : required,
					labelWidth : 40,
					singleLine : true,
					margin : '10 0 0 5',
					columnWidth : 2,
					fieldLabel : '时间'
				}, {
					xtype : 'htmleditor',
					fieldLabel : '内容',
					margin : '10 0 0 5',
					labelWidth : 40,
					height:200,
					id : 'noticeInfo_detail'
				}],
		buttons : [{
			text : '确定',
			handler : function() {
				var form = Ext.getCmp('notice_form').getForm();
				var dates = Ext.getCmp('notice_date').getValue();
				var myFormat = 'Y-m-d H:i:s';
				if (dates[2]) {
					myFormat = 'Y-m-d';
				}
				if (form.isValid()) {
					Ext.Ajax.request({
						url : '../../../notice/notice!add',
						params : {
							'noticeInfo.title' : Ext.getCmp('notice_title').value,
							'noticeInfo.detail' : Ext
									.getCmp('noticeInfo_detail').value,
							'noticeInfo.beginTime' : Ext.Date.format(dates[0],
									myFormat),
							'noticeInfo.endTime' : Ext.Date.format(dates[1],
									myFormat),
							'noticeInfo.isAllDay' : dates[2],
							'noticeInfo.color' : text_color
						},
						success : function(res) {
							NoticeStore.load();
						},
						failure : function(res) {
						}
					})
					Ext.getCmp('notice_add_window').close();
				}

			}
		}, {
			text : '重置',
			handler : function() {
				Ext.getCmp('notice_form').getForm().reset();
			}
		}, {
			text : '取消',
			handler : function() {
				Ext.getCmp('notice_add_window').close();
			}
		}]
	}]
})
Ext.define('noticeRead', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id'
					}, {
						name : 'name'
					}, {
						name : 'depart'
					}, {
						name : 'position'
					}, {
						name : 'time'
					}]
		})

var showReadDetail = function() {
	var grid = Ext.getCmp('notice_grid');
	var selModel = grid.getSelectionModel();
	if (selModel.getSelection().length == 1) {
		var noticeReadStore = Ext.create('Ext.data.Store', {
					sorters : [{
								property : 'id',
								direction : 'ASC'
							}],
					model : 'noticeRead',
					proxy : {
						type : 'ajax',
						url : '../../../notice/notice!getNoticeReaded?noticeInfo.id='
								+ selModel.getSelection()[0].data.id,
						reader : {
							type : 'json',
							root : 'items',
							totalProperty : 'total'
						}
					}
				});
		noticeReadStore.load();
		Ext.create('Ext.window.Window', {
			title : '阅读情况',
			id : 'notice_readDetail_window',
			frame : true,
			border : false,
			draggable : true,
			closable : true,
			modal : true,
			layout : 'fit',
			width : 500,
			height : 400,
			resizable : false,
			listeners : {
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
				store : noticeReadStore,
				multiSelect : true,
				dockedItems : [{
					xtype : 'pagingtoolbar',
					store : noticeReadStore,
					dock : 'bottom',
					displayInfo : true,
					displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
				}],
				columns : [{
							header : '姓名',
							dataIndex : 'name'
						}, {
							header : '部门',
							dataIndex : 'depart'
						}, {
							header : '职位',
							dataIndex : 'position'
						}, {
							header : '时间',
							dataIndex : 'time'
						}],
				listeners : {}
			}]
		}).show();
	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请选择一条数据！</span>");
	}
}
// xtype
Ext.define('noticeInfo', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.noticeInfo',
	layout : 'fit',
	listeners : {
		afterrender : function() {
			NoticeStore.load();
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
		id : 'notice_grid',
		store : NoticeStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : NoticeStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'add',
					text : '增加',
					handler : function() {
						Ext.create('notice_EditWindow', {
									title : '增加'
								}).show();
					}
				}, '-', {
					iconCls : 'delte0',
					text : '删除',
					handler : notice_delete
				}, '-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : notice_refresh
				}, '-', {
					iconCls : 'wb_read',
					text : '阅读情况',
					handler : showReadDetail
				}, '-', '->', '-', {
					width : 200,
					fieldLabel : '搜索',
					labelWidth : 35,
					emptyText : '标题',
					xtype : 'searchfield',
					store : NoticeStore
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
					dataIndex : 'title'
				}, {
					header : '发布时间',
					dataIndex : 'arrangTime'
				}, {
					header : '生效时间',
					dataIndex : 'beginTime'
				}, {
					header : '结束时间',
					dataIndex : 'endTime'
				}, {
					header : '发布人',
					dataIndex : 'user'
				}, {
					header : '状态',
					dataIndex : 'state'
				}],
		plugins : [{
			ptype : 'rowexpander',
			rowBodyTpl : ["<p style='line-height:0px;'><b>内容:</b> {detail}</p>"]
		}],
		listeners : {
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
				notice_menu.showAt(e.getXY());
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
				notice_menu.showAt(e.getXY());
			}
		}
	}]
});