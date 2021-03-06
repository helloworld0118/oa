// model
Ext.define('showNotice', {
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
					}, {
						name : 'haveSee'
					}]
		})
// store
var protalNoticeStore = Ext.create('Ext.data.Store', {
			model : 'showNotice',
			pageSize : 5,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../notice/notice!getShow'
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
var showDetailNotice = function(record) {
	var tabpanel = Ext.getCmp('MainTab');
	tabpanel.remove(Ext.getCmp('showDetailNotice_panel'));
	var taskShowDetail = tabpanel.getComponent('showDetailNotice_panel');
	tabpanel.autoScroll = false;
	if (!taskShowDetail) {
		taskShowDetail = tabpanel.add({
			title : '公告/通知',
			closable : true,
			autoScroll : false,
			iconCls : 'wb_system_notice',
			id : 'showDetailNotice_panel',
			listeners : {
				render : function() {
					Ext.Ajax.request({
								url : '../../../notice/notice!update',
								params : {
									'noticeInfo.id' : record.data.id
								},
								success : function(res) {
									protalNoticeStore.load();
								},
								failure : function(res) {
								}
							})
				},
				afterrender : function(panel) {
					tpl = Ext
							.create(
									'Ext.Template',
									'<div style="background:#DBD4D4;margin-top:0px;">',
									'<p style="font-size:25px;text-align:center;color:{color}">{title}</p>',
									'<p><b style="margin-left:10px;">发布人:</b>{user}<b style="margin-left:20px;">发布时间:</b>{arrangTime}</p>',
									'<p><b style="margin-left:10px;">生效时间:</b>{beginTime}<b style="margin-left:20px;">结束时间:</b>{endTime}</p>',
									'</div>',
									'<div style="padding-left:15px;">{detail}</div>');
					tpl.overwrite(panel.body, record.data);
					panel.doComponentLayout();
				}
			}
		})
	}
	tabpanel.setActiveTab(taskShowDetail);
}
// xtype
Ext.define('Protal_notice', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.protal_notice',
	layout : 'fit',
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
		id : 'protal_notice_grid',
		store : protalNoticeStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : protalNoticeStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		columns : [{
			header : '阅读',
			dataIndex : 'haveSee',
			width : 20,
			renderer : function(v) {
				if (!v) {
					return "<img src='images/show/folder.gif' title='未看'/>"
				} else {
					return "<img src='images/show/folder_open.gif' title='已看'/>"
				}
			}
		}, {
			header : '标题',
			dataIndex : 'title'
		}, {
			header : '发布时间',
			dataIndex : 'arrangTime'
		}],
		listeners : {
			/*afterrender : function() {
				protalNoticeStore.load();
			},*/
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
			},
			itemdblclick : function(view, record, item, index, e, eOpts) {
				showDetailNotice(record);
			}
		}
	}]
});