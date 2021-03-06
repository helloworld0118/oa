// model
Ext.define('workoutApply', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id'
					}, {
						name : 'startDate'
					}, {
						name : 'endDate'
					}, {
						name : 'reason'
					}, {
						name : 'applyDate'
					}, {
						name : 'reallyEndDate'
					}, {
						name : 'state'
					},{
						name : 'outAddress'
					}, {
						name : 'userInfoByApplyUser'
					}, {
						name : 'comments'
					}]
		});
var workoutApplyStore = Ext.create('Ext.data.Store', {
			model : 'workoutApply',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../attendance/workout!getTask'
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
var workoutApply_menu = Ext.create('Ext.menu.Menu', {
			margin : '0 0 10 0',
			items : [{
				iconCls : 'my_save',
				text : '批准',
				handler : function() {
					var grid = Ext.getCmp('workoutApply_grid');
					var selModel = grid.getSelectionModel();
					if (selModel.getSelection().length == 1) {
						var rec=selModel.getSelection();
						workoutComment(rec[0], 1);
					} else {
						Ext.Msg.alert('提示',
								"<span style='color:red'>请选择一条数据！</span>");
					}

				}
			}, {
				iconCls : 'delte',
				text : '不准',
				handler : function() {
					var grid = Ext.getCmp('workoutApply_grid');
					var selModel = grid.getSelectionModel();
					if (selModel.getSelection().length == 1) {
						var rec=selModel.getSelection();
						workoutComment(rec[0], 2);
					} else {
						Ext.Msg.alert('提示',
								"<span style='color:red'>请选择一条数据！</span>");
					}

				}
			},{
						iconCls : 'refresh',
						text : '刷新',
						handler : function() {
							workoutApply_refresh()
						}
					}]
		});
// 刷新
var workoutApply_refresh = function() {
	workoutApplyStore.load();
}
var workoutComment = function(rec, value) {
	Ext.create('Ext.window.Window', {
		width : 520,
		id : 'workoutComment_window',
		frame : true,
		border : false,
		draggable : false,
		closable : true,
		resizable : false,
		modal : true,
		layout : 'fit',
		items : [{
					xtype : 'htmleditor',
					grow : true,
					id : 'workoutCommentFiled',
					margin : '5 0 0 10',
					labelWidth : 40,
					height:200,
					fieldLabel : '批语',
					anchor : '100%'
				}],
		buttons : [{
			text : '确定',
			handler : function() {
				Ext.Ajax.request({
					url : '../../../attendance/workout!update',
					params : {
						'workoutModel.id' : rec.data.id,
						'workoutModel.state' : (parseInt(rec.data.state) + parseInt(value)),
						'workoutCommentFiled' : Ext
								.getCmp('workoutCommentFiled').value
					},
					success : function(res) {
						if (res.responseText == 'true') {
							workoutApplyStore.load();
							Ext.getCmp('workoutComment_window').close();
						}
					},
					failure : function(res) {
					}
				});
			}
		}, {
			text : '取消',
			handler : function() {
				Ext.getCmp('workoutComment_window').close();
			}
		}]
	}).show();
}
// xtype
Ext.define('WorkExamine_outWork', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.workExamine_outWork',
	layout : 'fit',
	listeners : {
		afterrender : function() {
			workoutApplyStore.load();
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
		frame : true,
		id : 'workoutApply_grid',
		store : workoutApplyStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : workoutApplyStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : workoutApply_refresh
				}, '-', '->', '-', {
					width : 200,
					fieldLabel : '搜索',
					labelWidth : 35,
					emptyText : '申请人',
					xtype : 'searchfield',
					store : workoutApplyStore
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
					header : '状态',
					dataIndex : 'state',
					renderer : function(v) {
						if (v == '1') {
							return "<span style='color:green'>出差申请</span>";
						} else if (v == '4') {
							return "<span style='color:green'>归来申请</span>";
						}
					}

				}, {
					header : '申请人',
					dataIndex : 'userInfoByApplyUser'
				}, {
					header : '开始时间',
					dataIndex : 'startDate'
				}, {
					header : '预计归来时间',
					dataIndex : 'endDate'
				},{
					header : '出差地点',
					dataIndex : 'outAddress'
				}, {
					header : '申请时间',
					dataIndex : 'applyDate'
				}, {
					xtype : 'actioncolumn',
					header : '操作',
					width : 50,
					items : [{
								icon : 'images/icons/fam/accept.png',
								tooltip : '批准',
								handler : function(grid, rowIndex, colIndex) {
									var rec = grid.getStore().getAt(rowIndex);
									workoutComment(rec, 1);
								}
							}, {
								icon : 'images/icons/fam/cross.gif',
								tooltip : '不准',
								handler : function(grid, rowIndex, colIndex) {
									var rec = grid.getStore().getAt(rowIndex);
									workoutComment(rec, 2);
								}
							}]
				}],
		plugins : [{
			ptype : 'rowexpander',
			rowBodyTpl : [
					"<b style='margin-left:105px;'>原因:</b> {reason}",
					'<tpl if="reallyEndDate">',
					"<p><b style='margin-left:100px;'>实际结束时间:</b> {reallyEndDate}</p>",
					'</tpl>']
		}],
		listeners : {
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
				workoutApply_menu.showAt(e.getXY());
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
				workoutApply_menu.showAt(e.getXY());
			}
		}
	}]
});