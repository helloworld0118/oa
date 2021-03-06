Ext.define('Portal_waitFlow', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.portal_waitFlow',
	layout : 'fit',
	height:210,
	listeners : {
	/*	afterrender : function() {
			waitFlowStore.load();
		},*/
		render : function(p) {
			p.getEl().on("contextmenu", function(e) {
						e.preventDefault();
					})
		}
	},
	items : [{
		xtype : 'grid',
		forceFit : true,
		id:'portal_waitFlow_grid',
		frame : true,
		store : waitFlowStore,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : waitFlowStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		features: [groupingFeature],
		columns : [{
					header : '标题',
					dataIndex : 'title'
				}, {
					header : '申请时间',
					dataIndex : 'applyDate'
				}, {
					header : '申请人',
					dataIndex : 'applyUser'
				}, {
					header : '流程名称',
					dataIndex : 'flowName'
				}],
		listeners : {
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
			},
			itemdblclick : function(view, record, item, index, e, eOpts) {
				performFlow('portal_waitFlow_grid');
			}
		}
	}]
});