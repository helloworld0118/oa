var examReportListStore = Ext.create('Ext.data.Store', {
			model : 'report',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				url : '../../../report/report!getAll2Owner',
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'items',
					totalProperty : 'total'
				}
			}
		})
// 主窗口 -列表页
Ext.define('Examine_report', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.examine_report',
	layout : 'fit',
	autoScroll : true,
	items : [{
		xtype : 'grid',
		forceFit : true,
		frame : true,
		store : examReportListStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : examReportListStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : function() {
						examReportListStore.load();
					}
				}, '-', '->', '-', {
					width : 200,
					fieldLabel : '搜索',
					labelWidth : 35,
					emptyText : '标题',
					xtype : 'searchfield',
					store : examReportListStore
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
					dataIndex : 'title',
					width : 130
				}, {
					header : '汇报时间',
					dataIndex : 'time'
				}, {
					header : '类型',
					dataIndex : 'type'
				}, {
					header : '汇报人',
					dataIndex : 'reportUser'
				}],
		listeners : {
			afterrender : function() {
				examReportListStore.load();
			},
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
			},
			itemdblclick : function(view, record, item, index, e, eOpts) {
				reportShowDetail(record);
			}
		}
	}]
});