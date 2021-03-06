var portal_taskListStore = Ext.create('Ext.data.Store', {
			model : 'TaskInfo',
			pageSize : 5,
			proxy : {
				type : 'ajax',
				url : '../../../task/taskInfo!getTaskList',
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
Ext.define('Protal_task_list', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.protal_task_list',
	layout : 'fit',
	height:210,
	items : [{
		xtype : 'grid',
		forceFit : true,
		frame : true,
		store : portal_taskListStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : portal_taskListStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		columns : [{
					header : '任务标题',
					dataIndex : 'title',
					width : 130
				}, {
					header : '状态',
					dataIndex : 'state'
				}, {
					header : '负责人',
					dataIndex : 'responsibleUser'
				}, {
					header : '布置人',
					dataIndex : 'arrangeUser'
				}],
		listeners : {
			/*render : function() {
				portal_taskListStore.load();
			},*/
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
			},
			itemdblclick : function(view, record, item, index, e, eOpts) {
				taskShowDetail(record);
			}
		}
	}]
});