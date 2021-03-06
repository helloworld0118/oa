var findFailShow = function(main, iconCls) {
	var tabpanel = Ext.getCmp(main);
	var tab = tabpanel.getComponent('findFail');
	if (!tab) {
		tab = tabpanel.add({
					title : '查看帮助',
					iconCls : iconCls,
					id : 'findFail',
					xtype : 'findFail',
					closable : true
				})
	}
	tabpanel.setActiveTab(tab);
}
Ext.define('FindFail', {
			extend : 'Ext.panel.Panel',
			alias : 'widget.findFail',
			id : 'findFail',
			layout : 'fit',
			html:'<center><h1>暂无此帮助</h1></center>'
		})